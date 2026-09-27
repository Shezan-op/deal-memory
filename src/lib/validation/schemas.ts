import { z } from 'zod';

export const InteractionOutcomeSchema = z.object({
  outcomeType: z.enum([
    'PROGRESSED',
    'STALLED',
    'LOST',
    'NEXT_STEP_CONFIRMED',
    'NO_CHANGE',
    'POSITIVE_SIGNAL',
    'NEGATIVE_SIGNAL',
    'UNKNOWN',
  ]),
  summary: z.string().min(1, 'Summary is required'),
  reason: z.string().min(1, 'Reason is required'),
  nextStep: z.string().optional(),
  stakeholderReaction: z.string().optional(),
  actionTaken: z.string().min(1, 'Action taken is required'),
  timestamp: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

export const CreateInteractionSchema = z.object({
  id: z.string().min(1),
  dealId: z.string().min(1),
  companyId: z.string().min(1),
  contactIds: z.array(z.string()).default([]),
  timestamp: z.string(),
  channel: z.enum(['call', 'email', 'meeting', 'demo', 'technical-deep-dive']),
  stage: z.enum([
    'discovery',
    'qualification',
    'technical-validation',
    'pricing-negotiation',
    'contract-review',
    'closed-won',
    'closed-lost',
    'stalled',
  ]),
  participants: z.array(z.string()).min(1),
  context: z.string().min(5),
  rawContent: z.string().min(10),
  objections: z.array(z.string()).optional(),
  actionAttempted: z.string().optional(),
  outcome: InteractionOutcomeSchema.optional(),
  tags: z.array(z.string()).optional(),
});

export const PrepareRequestSchema = z.object({
  dealId: z.string().min(1),
  memoryEnabled: z.boolean().default(true),
  customGoal: z.string().optional(),
});

export const RecallRequestSchema = z.object({
  query: z.string().min(1),
  dealId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  types: z.array(z.enum(['world', 'experience', 'observation'])).optional(),
});

export const ReflectRequestSchema = z.object({
  query: z.string().min(1),
  dealId: z.string().optional(),
  budget: z.enum(['low', 'mid', 'high']).default('mid'),
});

export function generateInteractionDocId(dealId: string, interactionId: string): string {
  const cleanDeal = dealId.trim().toLowerCase();
  const cleanInteraction = interactionId.trim().toLowerCase();
  return `deal:${cleanDeal}:interaction:${cleanInteraction}`;
}

export function generateOutcomeDocId(dealId: string, interactionId: string): string {
  const base = generateInteractionDocId(dealId, interactionId);
  return `${base}:outcome`;
}

export function generateInteractionTags(params: {
  dealId: string;
  companyId: string;
  stage: string;
  contactIds?: string[];
  objections?: string[];
  outcomeType?: string;
  action?: string;
}): string[] {
  const tags: Set<string> = new Set();

  tags.add(`deal:${params.dealId.toLowerCase()}`);
  tags.add(`company:${params.companyId.toLowerCase()}`);
  tags.add(`stage:${params.stage.toLowerCase()}`);

  if (params.contactIds) {
    for (const cid of params.contactIds) {
      tags.add(`contact:${cid.toLowerCase()}`);
    }
  }

  if (params.objections) {
    for (const obj of params.objections) {
      const cleanObj = obj.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      tags.add(`objection:${cleanObj}`);
    }
  }

  if (params.outcomeType) {
    tags.add(`outcome:${params.outcomeType.toLowerCase()}`);
  }

  if (params.action) {
    const cleanAction = params.action.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    tags.add(`action:${cleanAction}`);
  }

  return Array.from(tags);
}
