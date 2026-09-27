import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter, getClientIp } from '@/lib/security/rate-limiter';
import { NextRequest } from 'next/server';

describe('Security: Rate Limiting & DoS Protection (OWASP A04 / ASVS V3.2)', () => {
  beforeEach(() => {
    // Reset rate limiter state between tests
    rateLimiter.reset();
  });

  it('allows requests within the configured threshold', () => {
    const testIp = '192.168.1.100';
    for (let i = 0; i < 5; i++) {
      const result = rateLimiter.check(`test-endpoint:${testIp}`, 5, 60);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5 - (i + 1));
    }
  });

  it('enforces 429 rate limit when quota is exceeded with valid retryAfterMs', () => {
    const testIp = '192.168.1.101';
    const limit = 3;
    const windowSeconds = 30;

    // Use all 3 permits
    for (let i = 0; i < limit; i++) {
      const result = rateLimiter.check(`expensive-ai-op:${testIp}`, limit, windowSeconds);
      expect(result.allowed).toBe(true);
    }

    // 4th request must be blocked
    const blockedResult = rateLimiter.check(`expensive-ai-op:${testIp}`, limit, windowSeconds);
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.resetInSeconds).toBeGreaterThan(0);
    expect(blockedResult.resetInSeconds).toBeLessThanOrEqual(windowSeconds);
  });

  it('isolates quotas between distinct client IPs', () => {
    const attackerIp = '10.0.0.99';
    const legitimateIp = '10.0.0.1';
    const limit = 2;

    // Attacker exhausts quota
    rateLimiter.check(`recall:${attackerIp}`, limit, 60);
    rateLimiter.check(`recall:${attackerIp}`, limit, 60);
    const attackerBlocked = rateLimiter.check(`recall:${attackerIp}`, limit, 60);
    expect(attackerBlocked.allowed).toBe(false);

    // Legitimate user must still be permitted
    const legitResult = rateLimiter.check(`recall:${legitimateIp}`, limit, 60);
    expect(legitResult.allowed).toBe(true);
    expect(legitResult.remaining).toBe(1);
  });

  it('safely extracts client IP from request headers and falls back securely', () => {
    const reqWithForwarded = new NextRequest('http://localhost:3000/api/memory/recall', {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18',
      },
    });
    expect(getClientIp(reqWithForwarded)).toBe('203.0.113.195');

    const reqWithRealIp = new NextRequest('http://localhost:3000/api/memory/recall', {
      headers: {
        'x-real-ip': '198.51.100.42',
      },
    });
    expect(getClientIp(reqWithRealIp)).toBe('198.51.100.42');

    const reqWithoutIpHeaders = new NextRequest('http://localhost:3000/api/memory/recall');
    expect(getClientIp(reqWithoutIpHeaders)).toBe('127.0.0.1');
  });
});
