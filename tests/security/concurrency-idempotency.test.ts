import { describe, it, expect, beforeEach } from 'vitest';
import { dealRepository } from '@/lib/repositories/deal-repository';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { Interaction } from '@/lib/domain/models';

describe('Security & Robustness: Concurrency & Idempotency (OWASP A08 / Section 44-46)', () => {
  beforeEach(() => {
    dealRepository.resetToSeed();
  });

  it('guarantees interaction insertion with identical ID is idempotent', () => {
    const duplicateId = 'int-idemp-001';
    const interaction: Interaction = {
      id: duplicateId,
      dealId: 'deal-acme-001',
      companyId: 'company-acme',
      contactIds: ['contact-marcus'],
      timestamp: '2026-09-28T10:00:00Z',
      channel: 'call',
      stage: 'technical-validation',
      participants: ['Marcus Vance'],
      context: 'Initial check-in',
      rawContent: 'Discussed architectural review criteria',
    };

    // First insertion
    dealRepository.addInteraction(interaction);
    const countBefore = dealRepository.getInteractionsForDeal('deal-acme-001').length;

    // Duplicate submission (e.g. rapid double-click or network retry)
    dealRepository.addInteraction(interaction);
    const countAfter = dealRepository.getInteractionsForDeal('deal-acme-001').length;

    // Count of unique interaction records must remain unchanged
    expect(countAfter).toBe(countBefore);
  });

  it('guarantees recording outcome for an interaction is idempotent and updates in place', () => {
    const outcome1 = {
      outcomeType: 'PROGRESSED' as const,
      summary: 'Initial outcome recorded',
      reason: 'Sandbox verified',
      actionTaken: 'Delivered sandbox',
      timestamp: '2026-09-28T11:00:00Z',
    };

    const outcome2 = {
      outcomeType: 'PROGRESSED' as const,
      summary: 'Updated outcome after formal confirmation',
      reason: 'Sandbox verified and approved by architecture review board',
      actionTaken: 'Delivered sandbox and board presentation',
      timestamp: '2026-09-28T11:05:00Z',
    };

    dealRepository.recordOutcome('acme-003', outcome1);
    const recorded1 = dealRepository.getInteraction('acme-003');
    expect(recorded1?.outcome?.summary).toBe('Initial outcome recorded');

    // Re-recording outcome (e.g. edited or retried)
    dealRepository.recordOutcome('acme-003', outcome2);
    const recorded2 = dealRepository.getInteraction('acme-003');
    expect(recorded2?.outcome?.summary).toBe('Updated outcome after formal confirmation');
  });

  it('safely handles concurrent preparation requests without state race conditions', async () => {
    // Fire 5 simultaneous preparation requests
    const promises = Array.from({ length: 5 }).map((_, i) =>
      intelligenceService.generatePreparationBrief({
        dealId: 'deal-acme-001',
        memoryEnabled: true,
        customGoal: `Concurrent preparation worker ${i + 1}`,
      })
    );

    const results = await Promise.all(promises);

    expect(results).toHaveLength(5);
    for (const brief of results) {
      expect(brief.dealId).toBe('deal-acme-001');
      expect(brief.whatWorked.length).toBeGreaterThan(0);
      expect(brief.supportingEvidence.length).toBeGreaterThan(0);
    }
  });
});
