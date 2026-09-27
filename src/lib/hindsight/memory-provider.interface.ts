import { Interaction, InteractionOutcome, EvidenceItem, DealPreparationBrief } from '../domain/models';

export interface MemoryRecallOptions {
  types?: Array<'world' | 'experience' | 'observation'>;
  tags?: string[];
  tagsMatch?: 'any' | 'any_strict' | 'all' | 'all_strict' | 'exact';
  budget?: 'low' | 'mid' | 'high';
  maxTokens?: number;
  includeSourceFacts?: boolean;
}

export interface MemoryReflectOptions {
  budget?: 'low' | 'mid' | 'high';
  context?: string;
  tags?: string[];
  tagsMatch?: 'any' | 'any_strict' | 'all' | 'all_strict' | 'exact';
  includeFacts?: boolean;
  responseSchema?: Record<string, unknown>;
}

export interface MemoryProviderHealth {
  connected: boolean;
  bankId: string;
  apiVersion?: string;
  error?: string;
}

export interface MemoryProvider {
  healthCheck(): Promise<MemoryProviderHealth>;
  initializeBank(bankId: string): Promise<void>;
  retainInteraction(interaction: Interaction, bankId?: string): Promise<{ success: boolean; documentId: string }>;
  retainOutcome(interactionId: string, dealId: string, outcome: InteractionOutcome, bankId?: string): Promise<{ success: boolean; documentId: string }>;
  recall(query: string, options?: MemoryRecallOptions, bankId?: string): Promise<EvidenceItem[]>;
  reflect(query: string, options?: MemoryReflectOptions, bankId?: string): Promise<{ text: string; structuredOutput?: unknown; basedOn?: unknown }>;
  listMemories(dealId?: string, bankId?: string): Promise<EvidenceItem[]>;
  createMentalModel(params: { id: string; name: string; sourceQuery: string; tags?: string[] }, bankId?: string): Promise<string>;
  refreshMentalModel(modelId: string, bankId?: string): Promise<void>;
}
