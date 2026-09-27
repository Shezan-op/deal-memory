import { describe, it, expect } from 'vitest';
import {
  SafeIdSchema,
  CreateInteractionSchema,
  CreateOutcomeSchema,
  RecallRequestSchema,
  ReflectRequestSchema,
  sanitizeText,
} from '@/lib/validation/schemas';

describe('Security: Input Validation & Defensive Normalization (OWASP A03 / ASVS V5.1)', () => {
  describe('SafeIdSchema', () => {
    it('accepts clean alphanumeric IDs with underscores and hyphens', () => {
      expect(SafeIdSchema.safeParse('deal-acme-001').success).toBe(true);
      expect(SafeIdSchema.safeParse('tenant_demo_123').success).toBe(true);
      expect(SafeIdSchema.safeParse('int-456').success).toBe(true);
    });

    it('rejects path traversal attempts in identifiers', () => {
      expect(SafeIdSchema.safeParse('../../../etc/passwd').success).toBe(false);
      expect(SafeIdSchema.safeParse('..\\windows\\win.ini').success).toBe(false);
      expect(SafeIdSchema.safeParse('deal/../../secret').success).toBe(false);
    });

    it('rejects SQL injection fragments in identifiers', () => {
      expect(SafeIdSchema.safeParse("deal' OR '1'='1").success).toBe(false);
      expect(SafeIdSchema.safeParse('deal; DROP TABLE deals;--').success).toBe(false);
      expect(SafeIdSchema.safeParse('deal" UNION SELECT * FROM users--').success).toBe(false);
    });

    it('rejects identifiers exceeding max length of 64 characters', () => {
      const longId = 'a'.repeat(65);
      expect(SafeIdSchema.safeParse(longId).success).toBe(false);
    });

    it('rejects null bytes and control characters inside identifiers', () => {
      expect(SafeIdSchema.safeParse('deal\0admin').success).toBe(false);
      expect(SafeIdSchema.safeParse('deal\x08bypass').success).toBe(false);
      expect(SafeIdSchema.safeParse('deal\nnextline').success).toBe(false);
    });
  });

  describe('CreateInteractionSchema Boundedness & Type Safety', () => {
    it('rejects interaction transcripts exceeding 50,000 characters to prevent memory exhaustion', () => {
      const oversizedContent = 'A'.repeat(50001);
      const parsed = CreateInteractionSchema.safeParse({
        id: 'int-test-001',
        dealId: 'deal-test-001',
        companyId: 'company-001',
        timestamp: '2026-09-28T12:00:00Z',
        channel: 'meeting',
        stage: 'discovery',
        participants: ['Alice'],
        context: 'Meeting context',
        rawContent: oversizedContent,
      });

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('exceed 50,000');
      }
    });

    it('rejects invalid sales stages outside canonical lifecycle', () => {
      const parsed = CreateInteractionSchema.safeParse({
        id: 'int-test-002',
        dealId: 'deal-test-001',
        companyId: 'company-001',
        timestamp: '2026-09-28T12:00:00Z',
        channel: 'meeting',
        stage: 'invalid_super_stage' as any,
        participants: ['Alice'],
        context: 'Meeting context',
        rawContent: 'Valid transcript content',
      });

      expect(parsed.success).toBe(false);
    });

    it('rejects invalid communication channels', () => {
      const parsed = CreateInteractionSchema.safeParse({
        id: 'int-test-003',
        dealId: 'deal-test-001',
        companyId: 'company-001',
        timestamp: '2026-09-28T12:00:00Z',
        channel: 'carrier_pigeon' as any,
        stage: 'discovery',
        participants: ['Alice'],
        context: 'Meeting context',
        rawContent: 'Valid transcript content',
      });

      expect(parsed.success).toBe(false);
    });
  });

  describe('CreateOutcomeSchema Defensive Constraints', () => {
    it('rejects invalid outcome types', () => {
      const parsedInvalid = CreateOutcomeSchema.safeParse({
        outcomeType: 'SUPER_ADMIN_OVERRIDE_WON',
        summary: 'Attempted privilege escalation',
        reason: 'Attempted arbitrary outcome',
        actionTaken: 'Bypass negotiation',
        timestamp: '2026-09-28T12:00:00Z',
      });

      expect(parsedInvalid.success).toBe(false);
    });

    it('rejects prototype pollution attempts embedded in outcome JSON', () => {
      const rawPollution = JSON.parse(
        '{"outcomeType": "STALLED", "summary": "Valid summary", "reason": "Valid reason", "actionTaken": "Demo", "timestamp": "2026-09-28T12:00:00Z", "__proto__": {"isAdmin": true}}'
      );
      const parsed = CreateOutcomeSchema.safeParse(rawPollution);

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        // Zod strips unrecognized keys not in schema
        expect((parsed.data as any).__proto__.isAdmin).toBeUndefined();
        expect((Object.prototype as any).isAdmin).toBeUndefined();
      }
    });
  });

  describe('sanitizeText', () => {
    it('strips null bytes, bell chars, and backspaces while preserving clean punctuation', () => {
      const untrusted = 'Hello\0 World!\x07 Alert\x08 test';
      const cleaned = sanitizeText(untrusted);
      expect(cleaned).toBe('Hello World! Alert test');
      expect(cleaned).not.toContain('\0');
      expect(cleaned).not.toContain('\x07');
    });
  });

  describe('RecallRequestSchema & ReflectRequestSchema Query Limits', () => {
    it('rejects recall query exceeding 1,000 characters', () => {
      const longQuery = 'A'.repeat(1001);
      const parsed = RecallRequestSchema.safeParse({ query: longQuery });
      expect(parsed.success).toBe(false);
    });

    it('rejects reflect request with invalid budget parameter', () => {
      const parsed = ReflectRequestSchema.safeParse({
        query: 'What worked?',
        budget: 'unlimited_expensive_tier' as any,
      });
      expect(parsed.success).toBe(false);
    });
  });
});
