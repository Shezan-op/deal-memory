import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateInteractionDocId,
  generateOutcomeDocId,
  generateInteractionTags,
  InteractionOutcomeSchema,
  CreateInteractionSchema,
} from '@/lib/validation/schemas';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { intelligenceService } from '@/lib/domain/intelligence-service';

describe('Domain & Schema Unit Tests', () => {
  beforeEach(() => {
    dealRepository.reset();
  });

  describe('Document ID and Tag Generators', () => {
    it('generates deterministic interaction document IDs', () => {
      const docId = generateInteractionDocId('deal-acme-001', 'acme-003');
      expect(docId).toBe('deal:deal-acme-001:interaction:acme-003');
    });

    it('generates deterministic outcome document IDs', () => {
      const outcomeDocId = generateOutcomeDocId('deal-acme-001', 'acme-003');
      expect(outcomeDocId).toBe('deal:deal-acme-001:interaction:acme-003:outcome');
    });

    it('generates consistent lowercase scoped tags', () => {
      const tags = generateInteractionTags({
        dealId: 'deal-acme-001',
        companyId: 'acme-corp',
        stage: 'technical-validation',
        contactIds: ['marcus-vance'],
        objections: ['Implementation complexity'],
        action: '30-day migration sandbox',
        outcomeType: 'PROGRESSED',
      });

      expect(tags).toContain('deal:deal-acme-001');
      expect(tags).toContain('company:acme-corp');
      expect(tags).toContain('stage:technical-validation');
      expect(tags).toContain('contact:marcus-vance');
      expect(tags).toContain('objection:implementation-complexity');
      expect(tags).toContain('action:30-day-migration-sandbox');
      expect(tags).toContain('outcome:progressed');
    });
  });

  describe('Schema Validation', () => {
    it('validates a correct outcome object', () => {
      const validOutcome = {
        outcomeType: 'PROGRESSED',
        summary: 'CTO approved technical sandbox evaluation',
        reason: 'Migration roadmap mitigated operational downtime concerns',
        actionTaken: 'Delivered 30-day phased roadmap',
        timestamp: '2026-08-28T16:00:00Z',
      };
      const result = InteractionOutcomeSchema.safeParse(validOutcome);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid outcome type', () => {
      const invalidOutcome = {
        outcomeType: 'TOTALLY_RANDOM_STATUS',
        summary: 'Invalid',
        reason: 'Invalid',
        actionTaken: 'Invalid',
        timestamp: '2026-08-28T16:00:00Z',
      };
      const result = InteractionOutcomeSchema.safeParse(invalidOutcome);
      expect(result.success).toBe(false);
    });
  });

  describe('Intelligence Service & Memory ON/OFF Contrast', () => {
    it('returns generic advice when memory is disabled (Memory OFF)', async () => {
      const brief = await intelligenceService.generatePreparationBrief({
        dealId: 'deal-acme-001',
        memoryEnabled: false,
      });

      expect(brief.memoryEnabled).toBe(false);
      expect(brief.whatHasBeenTried.length).toBe(0);
      expect(brief.supportingEvidence.length).toBe(0);
      expect(brief.recommendedApproach).toContain('Standard Sales Recommendation');
      expect(brief.recommendedApproach.toLowerCase()).toContain('discount');
    });

    it('returns grounded, historical evidence when memory is enabled (Memory ON)', async () => {
      const brief = await intelligenceService.generatePreparationBrief({
        dealId: 'deal-acme-001',
        memoryEnabled: true,
      });

      expect(brief.memoryEnabled).toBe(true);
      expect(brief.whatHasBeenTried.length).toBeGreaterThan(0);
      expect(brief.supportingEvidence.length).toBeGreaterThan(0);
      expect(brief.learnedPattern).toContain('operational implementation proof');
      expect(brief.recommendedApproach).toContain('30-day sandbox migration guarantee');
      expect(brief.recommendedApproach).toContain('$85,000');
      expect(brief.risksAndWatchouts.some((r) => r.includes('DO NOT offer an unprompted discount'))).toBe(true);
    });

    it('detects conflicting budget memories between interactions', async () => {
      const brief = await intelligenceService.generatePreparationBrief({
        dealId: 'deal-acme-001',
        memoryEnabled: true,
      });

      expect(brief.conflicts.length).toBeGreaterThan(0);
      const budgetConflict = brief.conflicts.find((c) => c.field === 'Annual Budget Ceiling');
      expect(budgetConflict).toBeDefined();
      expect(budgetConflict?.earlierValue).toContain('$100,000');
      expect(budgetConflict?.laterValue).toContain('$85,000');
    });
  });
});
