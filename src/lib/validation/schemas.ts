import { z } from 'zod';

/**
 * Strict identifier pattern: Alphanumeric, underscores, hyphens only (1-64 characters).
 * Prevents path traversal, delimiter injection, and SQL/NoSQL injection payloads.
 */
export const SafeIdSchema = z
  .string()
  .min(1, 'ID is required')
  .max(64, 'ID cannot exceed 64 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'ID may only contain alphanumeric characters, underscores, and hyphens')
  .refine((val) => !val.includes('..') && !val.includes('/') && !val.includes('\\'), {
    message: 'Path traversal sequences are strictly forbidden',
  });

/**
 * Sanitizes input strings by stripping null bytes and excessive control characters.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // Strip null bytes
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Strip non-printable control chars except tab/newline
    .trim();
}

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
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary cannot exceed 500 characters').transform(sanitizeText),
  reason: z.string().min(1, 'Reason is required').max(2000, 'Reason cannot exceed 2000 characters').transform(sanitizeText),
  nextStep: z.string().max(500).optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  stakeholderReaction: z.string().max(500).optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  actionTaken: z.string().min(1, 'Action taken is required').max(500, 'Action taken cannot exceed 500 characters').transform(sanitizeText),
  timestamp: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

export const CreateOutcomeSchema = InteractionOutcomeSchema;

export const OutcomeSubmissionSchema = z.object({
  interactionId: SafeIdSchema,
  dealId: SafeIdSchema,
  outcome: InteractionOutcomeSchema,
});

export const CreateInteractionSchema = z.object({
  id: SafeIdSchema,
  dealId: SafeIdSchema,
  companyId: SafeIdSchema,
  contactIds: z.array(SafeIdSchema).max(50, 'Cannot exceed 50 contacts').default([]),
  timestamp: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
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
  participants: z.array(z.string().max(100)).min(1, 'At least one participant is required').max(50),
  context: z.string().min(5, 'Context must be at least 5 characters').max(2000, 'Context cannot exceed 2000 characters').transform(sanitizeText),
  rawContent: z.string().min(10, 'Transcript content must be at least 10 characters').max(50000, 'Transcript content cannot exceed 50,000 characters').transform(sanitizeText),
  objections: z.array(z.string().max(200)).max(20).optional(),
  actionAttempted: z.string().max(500).optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  outcome: InteractionOutcomeSchema.optional(),
  tags: z.array(z.string().max(100)).max(50).optional(),
});

export const PrepareRequestSchema = z.object({
  dealId: SafeIdSchema,
  memoryEnabled: z.boolean().default(true),
  customGoal: z.string().max(500).optional().transform((val) => (val ? sanitizeText(val) : undefined)),
});

export const RecallRequestSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000, 'Query cannot exceed 1000 characters').transform(sanitizeText),
  dealId: SafeIdSchema.optional(),
  tags: z.array(z.string().max(100)).max(20).optional(),
  types: z.array(z.enum(['world', 'experience', 'observation'])).optional(),
});

export const ReflectRequestSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000, 'Query cannot exceed 1000 characters').transform(sanitizeText),
  dealId: SafeIdSchema.optional(),
  budget: z.enum(['low', 'mid', 'high']).default('mid'),
});

export function generateInteractionDocId(dealId: string, interactionId: string): string {
  const cleanDeal = dealId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const cleanInteraction = interactionId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
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

  tags.add(`deal:${params.dealId.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`);
  tags.add(`company:${params.companyId.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`);
  tags.add(`stage:${params.stage.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`);

  if (params.contactIds) {
    for (const cid of params.contactIds) {
      tags.add(`contact:${cid.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`);
    }
  }

  if (params.objections) {
    for (const obj of params.objections) {
      const cleanObj = obj.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      tags.add(`objection:${cleanObj}`);
    }
  }

  if (params.outcomeType) {
    tags.add(`outcome:${params.outcomeType.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`);
  }

  if (params.action) {
    const cleanAction = params.action.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    tags.add(`action:${cleanAction}`);
  }

  return Array.from(tags);
}
