import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as recallHandler } from '@/app/api/memory/recall/route';
import { POST as prepareHandler } from '@/app/api/deals/[dealId]/prepare/route';
import { HindsightMemoryProvider } from '@/lib/hindsight/hindsight-memory-provider';
import { intelligenceService } from '@/lib/domain/intelligence-service';
import { rateLimiter } from '@/lib/security/rate-limiter';

describe('Chaos Engineering & Fault Injection (OWASP Reliability / ASVS V13)', () => {
  beforeEach(() => {
    rateLimiter.reset();
    vi.restoreAllMocks();
  });

  it('handles provider 500 error during recall without crashing or leaking stack trace', async () => {
    const memoryProvider = intelligenceService.getMemoryProvider();
    vi.spyOn(memoryProvider, 'recall').mockRejectedValueOnce(
      new Error('Hindsight cluster 500: internal engine panic at memory_bank.rs:412')
    );

    const req = new NextRequest('http://localhost:3000/api/memory/recall', {
      method: 'POST',
      body: JSON.stringify({
        dealId: 'deal-acme-001',
        query: 'What objections were raised?',
      }),
      headers: {
        'content-type': 'application/json',
        'x-real-ip': '192.168.1.100',
      },
    });

    const res = await recallHandler(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe('Internal memory recall failure.');
    expect(JSON.stringify(json)).not.toContain('memory_bank.rs');
    expect(JSON.stringify(json)).not.toContain('stack');
  });

  it('handles provider timeout gracefully without blocking indefinitely', async () => {
    const memoryProvider = new HindsightMemoryProvider({
      baseUrl: 'http://127.0.0.1:9999',
      defaultBankId: 'chaos-bank',
    });

    // Mock client.recall to hang indefinitely
    (memoryProvider as any).client = {
      recall: () => new Promise((resolve) => setTimeout(resolve, 60000)),
    };

    // Fast-timeout test using small timeout
    const start = Date.now();
    try {
      await (memoryProvider as any).executeWithTimeout(
        (memoryProvider as any).client.recall(),
        50,
        'Chaos test timeout'
      );
      expect.fail('Should have timed out');
    } catch (err: any) {
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(1000);
      expect(err.message).toContain('timed out after 50ms');
    }
  });

  it('handles malformed / unexpected provider response structures safely', async () => {
    const memoryProvider = new HindsightMemoryProvider({
      defaultBankId: 'chaos-bank',
    });

    // Mock client.recall to return malformed object with missing results field
    (memoryProvider as any).client = {
      recall: vi.fn().mockResolvedValue({ corrupt: true, results: null }),
    };

    // recall method normalizes (response.results || []) safely
    const results = await memoryProvider.recall('objection query', undefined, 'chaos-bank');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });

  it('handles network connection refused (ECONNREFUSED) in health check gracefully', async () => {
    const memoryProvider = new HindsightMemoryProvider({
      baseUrl: 'http://127.0.0.1:54321', // nonexistent port
      defaultBankId: 'chaos-bank',
    });

    (memoryProvider as any).client = {
      getVersion: vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:54321')),
    };

    const health = await memoryProvider.healthCheck();
    expect(health.connected).toBe(false);
    expect(health.bankId).toBe('chaos-bank');
    expect(health.error).toContain('ECONNREFUSED');
  });

  it('enforces backpressure under request flood (rate limiting 60/min)', async () => {
    const makeReq = () =>
      new NextRequest('http://localhost:3000/api/memory/recall', {
        method: 'POST',
        body: JSON.stringify({
          dealId: 'deal-acme-001',
          query: 'stress query',
        }),
        headers: {
          'content-type': 'application/json',
          'x-real-ip': '10.99.99.1',
        },
      });

    // Fire 60 requests (allowed)
    for (let i = 0; i < 60; i++) {
      rateLimiter.check('recall:10.99.99.1', 60, 60);
    }

    // 61st request must trigger 429
    const res = await recallHandler(makeReq());
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toContain('Too many recall requests');
    expect(res.headers.get('Retry-After')).toBeDefined();
  });

  it('rejects corrupt/malformed JSON payloads on prepare route with 400 or defaults safely', async () => {
    const req = new NextRequest('http://localhost:3000/api/deals/deal-acme-001/prepare', {
      method: 'POST',
      body: '{"corrupt_json: true, unterminated...',
      headers: {
        'content-type': 'application/json',
        'x-real-ip': '10.99.99.2',
      },
    });

    const res = await prepareHandler(req, {
      params: Promise.resolve({ dealId: 'deal-acme-001' }),
    });
    // In NextRequest, catch block falls back to default params and processes safely (200), never uncaught 500
    expect([200, 400]).toContain(res.status);
  });
});
