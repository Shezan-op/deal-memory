import { describe, it, expect, beforeEach } from 'vitest';
import { IntelligenceService } from '@/lib/domain/intelligence-service';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { Deal, Interaction } from '@/lib/domain/models';

describe('Security: Anti-Cheat & Dynamic Memory Reasoning Integrity (OWASP A06 / Section 65-66)', () => {
  let intelligenceService: IntelligenceService;

  beforeEach(() => {
    intelligenceService = new IntelligenceService();
    dealRepository.resetToSeed();
  });

  it('guarantees Memory OFF mode strictly suppresses historical interactions and returns baseline heuristics', async () => {
    const brief = await intelligenceService.generatePreparationBrief({
      dealId: 'deal-acme-001',
      memoryEnabled: false,
    });

    expect(brief.dealId).toBe('deal-acme-001');
    expect(brief.whatHasBeenTried).toHaveLength(0);
    expect(brief.whatWorked).toHaveLength(0);
    expect(brief.whatDidNotWork).toHaveLength(0);
    expect(brief.supportingEvidence).toHaveLength(0);
    expect(brief.conflicts).toHaveLength(0);
    expect(brief.isInsufficientEvidence).toBe(true);
    expect(brief.learnedPattern).toContain('Memory disabled');
  });

  it('guarantees Memory ON mode dynamically incorporates historical interactions, outcomes, and evidence', async () => {
    const brief = await intelligenceService.generatePreparationBrief({
      dealId: 'deal-acme-001',
      memoryEnabled: true,
    });

    expect(brief.dealId).toBe('deal-acme-001');
    expect(brief.whatHasBeenTried.length).toBeGreaterThan(0);
    expect(brief.whatWorked.length).toBeGreaterThan(0);
    expect(brief.supportingEvidence.length).toBeGreaterThan(0);
    expect(brief.isInsufficientEvidence).toBe(false);
  });

  it('dynamically adapts recommendations to new custom deals and outcomes without hardcoding', async () => {
    const dynamicDealId = 'deal-synthetic-custom-999';
    const dynamicDeal: Deal = {
      id: dynamicDealId,
      companyId: 'company-synthetic',
      companyName: 'Synthetic Aerospace Labs',
      title: 'Satellite Telemetry Automation',
      value: 250000,
      stage: 'technical-validation',
      status: 'active',
      stakeholderIds: [],
      openObjections: ['ITAR compliance guarantee'],
      competitors: ['LegacySpace'],
      lastInteractionDate: '2026-09-27T10:00:00Z',
      interactionCount: 2,
    };

    const interaction1: Interaction = {
      id: 'int-dyn-001',
      dealId: dynamicDealId,
      companyId: 'company-synthetic',
      contactIds: [],
      timestamp: '2026-09-20T10:00:00Z',
      channel: 'meeting',
      stage: 'discovery',
      participants: ['Chief Engineer'],
      context: 'Initial scoping session',
      rawContent: 'Customer discussed ITAR telemetry pipeline',
      actionAttempted: 'Proposed 25% price reduction concession',
      outcome: {
        outcomeType: 'STALLED',
        actionTaken: 'Proposed 25% price reduction concession',
        summary: 'Commercial discount stalled; engineering requires compliance sign-off.',
        reason: 'Price reduction did not address our ITAR compliance concerns.',
        stakeholderReaction: 'Negative reaction to premature commercial discount.',
        timestamp: '2026-09-20T11:00:00Z',
      },
    };

    const interaction2: Interaction = {
      id: 'int-dyn-002',
      dealId: dynamicDealId,
      companyId: 'company-synthetic',
      contactIds: [],
      timestamp: '2026-09-25T14:00:00Z',
      channel: 'meeting',
      stage: 'technical-validation',
      participants: ['Chief Security Officer'],
      context: 'Compliance architectural review',
      rawContent: 'Presented air-gapped GovCloud deployment topology',
      actionAttempted: 'Presented air-gapped GovCloud deployment topology',
      outcome: {
        outcomeType: 'PROGRESSED',
        actionTaken: 'Presented air-gapped GovCloud deployment topology',
        summary: 'GovCloud architecture presentation unlocked technical validation.',
        reason: 'Security team agreed topology satisfies ITAR specifications.',
        stakeholderReaction: 'CSO approved next step and requested formal POC.',
        timestamp: '2026-09-25T15:00:00Z',
      },
    };

    // Inject custom deal and interactions
    dealRepository.addDeal(dynamicDeal);
    dealRepository.addInteraction(interaction1);
    dealRepository.addInteraction(interaction2);

    const customBrief = await intelligenceService.generatePreparationBrief({
      dealId: dynamicDealId,
      memoryEnabled: true,
    });

    // Verify recommendations are derived dynamically from the custom data
    expect(customBrief.dealId).toBe(dynamicDealId);
    expect(customBrief.whatWorked.some((w) => w.includes('GovCloud'))).toBe(true);
    expect(customBrief.whatDidNotWork.some((d) => d.includes('price reduction'))).toBe(true);
    expect(customBrief.learnedPattern).toMatch(/govcloud/i);
    expect(customBrief.recommendedApproach).toMatch(/GovCloud|concession|validated/i);
  });
});
