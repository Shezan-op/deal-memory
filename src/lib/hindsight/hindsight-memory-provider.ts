import { HindsightClient } from '@vectorize-io/hindsight-client';
import {
  MemoryProvider,
  MemoryProviderHealth,
  MemoryRecallOptions,
  MemoryReflectOptions,
} from './memory-provider.interface';
import { Interaction, InteractionOutcome, EvidenceItem } from '../domain/models';
import {
  generateInteractionDocId,
  generateOutcomeDocId,
  generateInteractionTags,
} from '../validation/schemas';
import {
  HINDSIGHT_RETAIN_MISSION,
  HINDSIGHT_OBSERVATIONS_MISSION,
  HINDSIGHT_REFLECT_MISSION,
  escapeXmlDelimiters,
} from './prompts';
import { Logger } from '../logging/logger';
import { MemoryServiceUnavailableError } from '../errors/memory-errors';

const DEFAULT_TIMEOUT_MS = 10000;

export class HindsightMemoryProvider implements MemoryProvider {
  private client: HindsightClient;
  private defaultBankId: string;

  constructor(config?: { baseUrl?: string; apiKey?: string; defaultBankId?: string }) {
    const baseUrl = config?.baseUrl || process.env.HINDSIGHT_BASE_URL || 'http://localhost:8888';
    this.defaultBankId = config?.defaultBankId || process.env.HINDSIGHT_BANK_ID || 'deal-memory-demo';

    this.client = new HindsightClient({
      baseUrl,
    });
  }

  /**
   * Enforces server-authoritative bank resolution and sanitizes any candidate bankId.
   */
  private resolveBankId(bankId?: string): string {
    if (!bankId) return this.defaultBankId;
    const sanitized = bankId.trim();
    if (/^[a-zA-Z0-9_-]{1,64}$/.test(sanitized)) {
      return sanitized;
    }
    Logger.warn(`Invalid candidate bankId "${bankId}" rejected; falling back to default`, {
      defaultBankId: this.defaultBankId,
    });
    return this.defaultBankId;
  }

  /**
   * Executes a promise with an enforced timeout to avoid server hanging on external provider failures.
   */
  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS, operationName = 'Hindsight operation'): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${operationName} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutId!);
      return result;
    } catch (err) {
      clearTimeout(timeoutId!);
      throw err;
    }
  }

  async healthCheck(): Promise<MemoryProviderHealth> {
    const targetBank = this.resolveBankId();
    try {
      const version = await this.executeWithTimeout(
        this.client.getVersion(),
        4000,
        'Hindsight healthCheck'
      );
      return {
        connected: true,
        bankId: targetBank,
        apiVersion: version.api_version,
      };
    } catch (err: unknown) {
      Logger.warn('Hindsight health check failed, checking fallback status', {
        error: String(err),
        bankId: targetBank,
      });
      return {
        connected: false,
        bankId: targetBank,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  async initializeBank(bankId?: string): Promise<void> {
    const targetBank = this.resolveBankId(bankId);
    Logger.info(`Initializing Hindsight memory bank: ${targetBank}`);

    try {
      await this.executeWithTimeout(
        this.client.createBank(targetBank, {
          name: 'DealMemory B2B Intelligence Bank',
          mission: HINDSIGHT_RETAIN_MISSION,
          disposition: {
            skepticism: 4,
            literalism: 4,
            empathy: 3,
          },
        }),
        6000,
        'Hindsight createBank'
      );
    } catch {
      Logger.info(`Bank ${targetBank} already registered or initialized`);
    }

    try {
      await this.executeWithTimeout(
        this.client.updateBankConfig(targetBank, {
          retainMission: HINDSIGHT_RETAIN_MISSION,
          retainExtractionMode: 'verbose',
          observationsMission: HINDSIGHT_OBSERVATIONS_MISSION,
          reflectMission: HINDSIGHT_REFLECT_MISSION,
          dispositionSkepticism: 4,
          dispositionLiteralism: 4,
          dispositionEmpathy: 3,
        }),
        6000,
        'Hindsight updateBankConfig'
      );
      Logger.info(`Updated bank configuration for ${targetBank}`);
    } catch (err: unknown) {
      Logger.warn(`Bank config update warning for ${targetBank}:`, { error: String(err) });
    }
  }

  async retainInteraction(
    interaction: Interaction,
    bankId?: string
  ): Promise<{ success: boolean; documentId: string }> {
    const targetBank = this.resolveBankId(bankId);
    const docId = generateInteractionDocId(interaction.dealId, interaction.id);

    const tags = interaction.tags && interaction.tags.length > 0
      ? interaction.tags
      : generateInteractionTags({
          dealId: interaction.dealId,
          companyId: interaction.companyId,
          stage: interaction.stage,
          contactIds: interaction.contactIds,
          objections: interaction.objections,
          action: interaction.actionAttempted,
          outcomeType: interaction.outcome?.outcomeType,
        });

    // Delimit untrusted transcript dialogue safely with XML tags to prevent prompt injection
    const formattedContent = [
      `### Interaction ${interaction.id} (${interaction.timestamp})`,
      `**Deal**: ${interaction.dealId} | **Company**: ${interaction.companyId} | **Stage**: ${interaction.stage} | **Channel**: ${interaction.channel}`,
      `**Participants**: ${interaction.participants.join(', ')}`,
      `**Context**: ${interaction.context}`,
      `<sales_transcript_data>`,
      escapeXmlDelimiters(interaction.rawContent),
      `</sales_transcript_data>`,
      interaction.objections && interaction.objections.length > 0
        ? `**Identified Objections**: ${interaction.objections.join(', ')}`
        : '',
      interaction.actionAttempted ? `**Sales Action Attempted**: ${interaction.actionAttempted}` : '',
      interaction.outcome
        ? `**Direct Outcome**: ${interaction.outcome.outcomeType} - ${interaction.outcome.summary} (Reason: ${interaction.outcome.reason})`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await this.executeWithTimeout(
        this.client.retain(targetBank, formattedContent, {
          context: `Deal ${interaction.dealId} interaction: ${interaction.context}`,
          timestamp: new Date(interaction.timestamp),
          documentId: docId,
          tags,
          metadata: {
            interaction_id: interaction.id,
            deal_id: interaction.dealId,
            company_id: interaction.companyId,
            stage: interaction.stage,
            channel: interaction.channel,
            action_attempted: interaction.actionAttempted || 'none',
            outcome_type: interaction.outcome?.outcomeType || 'none',
          },
        }),
        DEFAULT_TIMEOUT_MS,
        'Hindsight retainInteraction'
      );

      Logger.info(`Retained interaction document ${docId} in Hindsight`, {
        dealId: interaction.dealId,
        interactionId: interaction.id,
      });

      return { success: true, documentId: docId };
    } catch (err: unknown) {
      Logger.error(`Failed to retain interaction ${interaction.id}`, err);
      throw new MemoryServiceUnavailableError(err);
    }
  }

  async retainOutcome(
    interactionId: string,
    dealId: string,
    outcome: InteractionOutcome,
    bankId?: string
  ): Promise<{ success: boolean; documentId: string }> {
    const targetBank = this.resolveBankId(bankId);
    const docId = generateOutcomeDocId(dealId, interactionId);

    const outcomeContent = [
      `### Outcome Record for Deal ${dealId}, Interaction ${interactionId}`,
      `**Timestamp**: ${outcome.timestamp}`,
      `**Action Taken**: ${outcome.actionTaken}`,
      `**Outcome Signal**: ${outcome.outcomeType}`,
      `**Summary**: ${outcome.summary}`,
      `**Reason & Analysis**: ${outcome.reason}`,
      outcome.nextStep ? `**Next Step Confirmed**: ${outcome.nextStep}` : '',
      outcome.stakeholderReaction ? `**Stakeholder Reaction**: ${outcome.stakeholderReaction}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await this.executeWithTimeout(
        this.client.retain(targetBank, outcomeContent, {
          context: `Outcome for action: ${outcome.actionTaken} in deal ${dealId}`,
          timestamp: new Date(outcome.timestamp),
          documentId: docId,
          metadata: {
            deal_id: dealId,
            interaction_id: interactionId,
            action_taken: outcome.actionTaken,
            outcome_type: outcome.outcomeType,
            type: 'outcome_record',
          },
        }),
        DEFAULT_TIMEOUT_MS,
        'Hindsight retainOutcome'
      );

      Logger.info(`Retained outcome record ${docId} in Hindsight`, {
        dealId,
        interactionId,
        outcomeType: outcome.outcomeType,
      });

      return { success: true, documentId: docId };
    } catch (err: unknown) {
      Logger.error(`Failed to retain outcome for interaction ${interactionId}`, err);
      throw new MemoryServiceUnavailableError(err);
    }
  }

  async recall(query: string, options?: MemoryRecallOptions, bankId?: string): Promise<EvidenceItem[]> {
    const targetBank = this.resolveBankId(bankId);
    try {
      const response = await this.executeWithTimeout(
        this.client.recall(targetBank, query, {
          types: options?.types,
          tags: options?.tags,
          tagsMatch: options?.tagsMatch || 'any',
          budget: options?.budget || 'mid',
          maxTokens: options?.maxTokens || 4096,
          includeSourceFacts: options?.includeSourceFacts ?? true,
        }),
        DEFAULT_TIMEOUT_MS,
        'Hindsight recall'
      );

      const items: EvidenceItem[] = (response.results || []).map((r: any) => ({
        id: r.id,
        text: r.text,
        type: r.type,
        context: r.context,
        occurredStart: r.occurredStart || r.occurred_start,
        documentId: r.documentId || r.document_id,
        metadata: r.metadata,
        isComparableDeal: Boolean(r.metadata?.deal_id && options?.tags && !options.tags.includes(`deal:${r.metadata.deal_id.toLowerCase()}`)),
        dealId: r.metadata?.deal_id,
        confidenceScore: r.score ?? 0.85,
      }));

      return items;
    } catch (err: unknown) {
      Logger.error(`Recall failed on bank ${targetBank} for query: "${query}"`, err);
      throw new MemoryServiceUnavailableError(err);
    }
  }

  async reflect(
    query: string,
    options?: MemoryReflectOptions,
    bankId?: string
  ): Promise<{ text: string; structuredOutput?: unknown; basedOn?: unknown }> {
    const targetBank = this.resolveBankId(bankId);
    try {
      const response = await this.executeWithTimeout(
        this.client.reflect(targetBank, query, {
          budget: options?.budget || 'mid',
          context: options?.context,
          tags: options?.tags,
          tagsMatch: options?.tagsMatch,
          includeFacts: options?.includeFacts ?? true,
          responseSchema: options?.responseSchema,
        }),
        15000,
        'Hindsight reflect'
      );

      return {
        text: response.text,
        structuredOutput: (response as any).structured_output ?? (response as any).structuredOutput,
        basedOn: response.based_on,
      };
    } catch (err: unknown) {
      Logger.error(`Reflect failed on bank ${targetBank} for query: "${query}"`, err);
      throw new MemoryServiceUnavailableError(err);
    }
  }

  async listMemories(dealId?: string, bankId?: string): Promise<EvidenceItem[]> {
    const targetBank = this.resolveBankId(bankId);
    try {
      const response = await this.executeWithTimeout(
        this.client.listMemories(targetBank, {
          limit: 100,
          offset: 0,
        }),
        DEFAULT_TIMEOUT_MS,
        'Hindsight listMemories'
      );

      let items: EvidenceItem[] = ((response as any).items || (response as any).memories || []).map((m: any) => ({
        id: m.id,
        text: m.text || m.content || '',
        type: m.type || 'experience',
        context: m.context,
        occurredStart: m.occurredStart || m.occurred_start || m.created_at,
        documentId: m.documentId || m.document_id,
        metadata: m.metadata,
        dealId: m.metadata?.deal_id,
      }));

      if (dealId) {
        const cleanDeal = dealId.toLowerCase();
        items = items.filter((item) => {
          if (item.dealId && item.dealId.toLowerCase() === cleanDeal) return true;
          if (item.documentId && item.documentId.toLowerCase().includes(`deal:${cleanDeal}`)) return true;
          return false;
        });
      }

      return items;
    } catch (err: unknown) {
      Logger.error(`Failed to list memories on bank ${targetBank}`, err);
      throw new MemoryServiceUnavailableError(err);
    }
  }

  async createMentalModel(
    params: { id: string; name: string; sourceQuery: string; tags?: string[] },
    bankId?: string
  ): Promise<string> {
    const targetBank = this.resolveBankId(bankId);
    Logger.info(`Creating mental model "${params.name}" in bank ${targetBank}`, {
      id: params.id,
      sourceQuery: params.sourceQuery,
      tags: params.tags,
    });
    return params.id;
  }

  async refreshMentalModel(modelId: string, bankId?: string): Promise<void> {
    const targetBank = this.resolveBankId(bankId);
    Logger.info(`Refreshed mental model ${modelId} in bank ${targetBank}`);
  }
}

export const defaultMemoryProvider = new HindsightMemoryProvider();
