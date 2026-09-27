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
} from './prompts';
import { Logger } from '../logging/logger';
import { MemoryServiceUnavailableError } from '../errors/memory-errors';

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

  private resolveBankId(bankId?: string): string {
    return bankId || this.defaultBankId;
  }

  async healthCheck(): Promise<MemoryProviderHealth> {
    const targetBank = this.resolveBankId();
    try {
      const version = await this.client.getVersion();
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
      // Create bank if it doesn't already exist
      await this.client.createBank(targetBank, {
        name: 'DealMemory B2B Intelligence Bank',
        mission: HINDSIGHT_RETAIN_MISSION,
        disposition: {
          skepticism: 4, // Evidence-first, questions unverified claims
          literalism: 4, // Sticks to concrete numbers, dates, commitments
          empathy: 3, // Sensitive to stakeholder friction and executive tone
        },
      });
    } catch {
      // 409 or already exists is normal
      Logger.info(`Bank ${targetBank} already registered or initialized`);
    }

    try {
      // Configure missions and observation parameters
      await this.client.updateBankConfig(targetBank, {
        retainMission: HINDSIGHT_RETAIN_MISSION,
        retainExtractionMode: 'verbose',
        observationsMission: HINDSIGHT_OBSERVATIONS_MISSION,
        reflectMission: HINDSIGHT_REFLECT_MISSION,
        dispositionSkepticism: 4,
        dispositionLiteralism: 4,
        dispositionEmpathy: 3,
      });
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

    // Format structured dialogue into clear, rich conversational markdown
    const formattedContent = [
      `### Interaction ${interaction.id} (${interaction.timestamp})`,
      `**Deal**: ${interaction.dealId} | **Company**: ${interaction.companyId} | **Stage**: ${interaction.stage} | **Channel**: ${interaction.channel}`,
      `**Participants**: ${interaction.participants.join(', ')}`,
      `**Context**: ${interaction.context}`,
      `**Content/Transcript**:`,
      interaction.rawContent,
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
      await this.client.retain(targetBank, formattedContent, {
        context: `Deal ${interaction.dealId} interaction: ${interaction.context}`,
        timestamp: new Date(interaction.timestamp),
        documentId: docId,
        metadata: {
          interaction_id: interaction.id,
          deal_id: interaction.dealId,
          company_id: interaction.companyId,
          stage: interaction.stage,
          channel: interaction.channel,
          action_attempted: interaction.actionAttempted || 'none',
          outcome_type: interaction.outcome?.outcomeType || 'none',
        },
      });

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
      await this.client.retain(targetBank, outcomeContent, {
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
      });

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
      const response = await this.client.recall(targetBank, query, {
        types: options?.types,
        tags: options?.tags,
        tagsMatch: options?.tagsMatch || 'any',
        budget: options?.budget || 'mid',
        maxTokens: options?.maxTokens || 4096,
        includeSourceFacts: options?.includeSourceFacts ?? true,
      });

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
      const response = await this.client.reflect(targetBank, query, {
        budget: options?.budget || 'mid',
        context: options?.context,
        tags: options?.tags,
        tagsMatch: options?.tagsMatch,
        includeFacts: options?.includeFacts ?? true,
        responseSchema: options?.responseSchema,
      });

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
      const response = await this.client.listMemories(targetBank, {
        limit: 100,
        offset: 0,
      });

      let items: EvidenceItem[] = ((response as any).items || (response as any).memories || []).map((m: any) => ({
        id: m.id,
        text: m.text,
        type: m.type,
        context: m.context,
        occurredStart: m.occurred_start,
        documentId: m.document_id,
        metadata: m.metadata,
        dealId: m.metadata?.deal_id,
      }));

      if (dealId) {
        items = items.filter(
          (item) => item.dealId?.toLowerCase() === dealId.toLowerCase() || item.documentId?.includes(dealId.toLowerCase())
        );
      }

      return items;
    } catch (err: unknown) {
      Logger.warn(`listMemories failed on ${targetBank}, falling back`, { error: String(err) });
      return [];
    }
  }

  async createMentalModel(
    params: { id: string; name: string; sourceQuery: string; tags?: string[] },
    bankId?: string
  ): Promise<string> {
    const targetBank = this.resolveBankId(bankId);
    try {
      const res = await this.client.createMentalModel(targetBank, params.name, params.sourceQuery, {
        id: params.id,
        tags: params.tags,
        trigger: {
          refreshAfterConsolidation: true,
          mode: 'delta',
        },
      });
      Logger.info(`Created mental model ${params.id} in ${targetBank}`);
      return res.operation_id;
    } catch (err: unknown) {
      Logger.warn(`Mental model creation notice for ${params.id}:`, { error: String(err) });
      return 'op-manual';
    }
  }

  async refreshMentalModel(modelId: string, bankId?: string): Promise<void> {
    const targetBank = this.resolveBankId(bankId);
    try {
      await this.client.refreshMentalModel(targetBank, modelId);
      Logger.info(`Triggered refresh for mental model ${modelId}`);
    } catch (err: unknown) {
      Logger.warn(`Mental model refresh failed for ${modelId}:`, { error: String(err) });
    }
  }
}
