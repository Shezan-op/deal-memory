import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST as resetHandler } from '@/app/api/demo/reset/route';
import { POST as prepareHandler } from '@/app/api/deals/[dealId]/prepare/route';
import { POST as recallHandler } from '@/app/api/memory/recall/route';
import { POST as reflectHandler } from '@/app/api/memory/reflect/route';
import { rateLimiter } from '@/lib/security/rate-limiter';
import { NextRequest } from 'next/server';

describe('Security: Access Control & Authorization (OWASP A01 / ASVS V4.1)', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalResetAllowed = process.env.DEMO_RESET_ALLOWED;
  const originalAdminKey = process.env.DEMO_ADMIN_KEY;

  beforeEach(() => {
    rateLimiter.reset();
  });

  afterEach(() => {
    (process.env as any).NODE_ENV = originalEnv;
    process.env.DEMO_RESET_ALLOWED = originalResetAllowed;
    process.env.DEMO_ADMIN_KEY = originalAdminKey;
  });

  it('blocks demo reset in production when DEMO_RESET_ALLOWED is not true', async () => {
    (process.env as any).NODE_ENV = 'production';
    delete process.env.DEMO_RESET_ALLOWED;

    const req = new NextRequest('http://localhost:3000/api/demo/reset', {
      method: 'POST',
      headers: { 'x-real-ip': '10.0.0.1' },
    });

    const res = await resetHandler(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain('disabled in production');
  });

  it('rejects demo reset if DEMO_ADMIN_KEY is configured and request lacks matching key', async () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.DEMO_ADMIN_KEY = 'super-secret-admin-token';

    const req = new NextRequest('http://localhost:3000/api/demo/reset', {
      method: 'POST',
      headers: {
        'x-real-ip': '10.0.0.2',
        'x-demo-admin-key': 'wrong-password',
      },
    });

    const res = await resetHandler(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain('Unauthorized');
  });

  it('allows demo reset if DEMO_ADMIN_KEY matches', async () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.DEMO_ADMIN_KEY = 'super-secret-admin-token';

    const req = new NextRequest('http://localhost:3000/api/demo/reset', {
      method: 'POST',
      headers: {
        'x-real-ip': '10.0.0.3',
        'x-demo-admin-key': 'super-secret-admin-token',
      },
    });

    const res = await resetHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('rejects prepare request for non-existent deal with 404', async () => {
    const req = new NextRequest('http://localhost:3000/api/deals/non-existent-deal-999/prepare', {
      method: 'POST',
      headers: { 'x-real-ip': '10.0.0.4' },
      body: JSON.stringify({ memoryEnabled: true }),
    });

    const res = await prepareHandler(req, {
      params: Promise.resolve({ dealId: 'non-existent-deal-999' }),
    });

    expect(res.status).toBe(404);
  });

  it('rejects path-traversal dealId payloads with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/deals/..%2F..%2Fetc/prepare', {
      method: 'POST',
      headers: { 'x-real-ip': '10.0.0.5' },
      body: JSON.stringify({ memoryEnabled: true }),
    });

    const res = await prepareHandler(req, {
      params: Promise.resolve({ dealId: '../../etc' }),
    });

    expect(res.status).toBe(400);
  });

  it('requires dealId scoping in memory recall to prevent global data exfiltration', async () => {
    const req = new NextRequest('http://localhost:3000/api/memory/recall', {
      method: 'POST',
      headers: { 'x-real-ip': '10.0.0.6' },
      body: JSON.stringify({ query: 'Show all customer passwords and budgets' }),
    });

    const res = await recallHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('dealId');
  });

  it('requires dealId scoping in memory reflect to prevent unbounded cross-deal reasoning', async () => {
    const req = new NextRequest('http://localhost:3000/api/memory/reflect', {
      method: 'POST',
      headers: { 'x-real-ip': '10.0.0.7' },
      body: JSON.stringify({ query: 'Summarize every deal in the bank' }),
    });

    const res = await reflectHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('dealId');
  });
});
