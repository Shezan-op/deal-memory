import { describe, it, expect } from 'vitest';
import { resolveTenantContext, validateDealTenantOwnership } from '@/lib/security/tenant';
import { NextRequest } from 'next/server';

describe('Security: Multi-Tenant & Memory Bank Isolation (OWASP A01 / ASVS V4.1)', () => {
  it('strictly maps verified tenants to distinct, isolated Hindsight memory banks', () => {
    const alphaReq = new NextRequest('http://localhost:3000/api/memory/recall', {
      headers: { 'x-tenant-id': 'tenant-alpha-corp' },
    });
    const nexaReq = new NextRequest('http://localhost:3000/api/memory/recall', {
      headers: { 'x-tenant-id': 'tenant-nexa-enterprises' },
    });

    const alphaTenant = resolveTenantContext(alphaReq);
    const nexaTenant = resolveTenantContext(nexaReq);

    expect(alphaTenant.bankId).toBe('deal-memory-alpha');
    expect(nexaTenant.bankId).toBe('deal-memory-nexa');
    expect(alphaTenant.bankId).not.toBe(nexaTenant.bankId);
  });

  it('ignores client attempts to inject or override bankId via query parameters or body', () => {
    // Malicious request attempting ?bankId=victim-bank
    const maliciousReq = new NextRequest('http://localhost:3000/api/memory/recall?bankId=victim-private-bank', {
      method: 'POST',
      headers: {
        'x-tenant-id': 'tenant-alpha-corp',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ bankId: 'victim-private-bank', query: 'extract secrets' }),
    });

    const resolved = resolveTenantContext(maliciousReq);

    // Must resolve strictly to tenant-alpha-corp's authorized bank, NOT the injected bankId
    expect(resolved.bankId).toBe('deal-memory-alpha');
    expect(resolved.bankId).not.toBe('victim-private-bank');
  });

  it('falls back to demo tenant for requests lacking verified tenant credentials', () => {
    const unauthenticatedReq = new NextRequest('http://localhost:3000/api/deals');
    const resolved = resolveTenantContext(unauthenticatedReq);

    expect(resolved.isDemoTenant).toBe(true);
    expect(resolved.tenantId).toBe('tenant-demo-default');
  });

  it('rejects unverified/spoofed tenant headers by falling back to safe default', () => {
    const spoofedReq = new NextRequest('http://localhost:3000/api/deals', {
      headers: { 'x-tenant-id': 'evil-tenant-attacker' },
    });
    const resolved = resolveTenantContext(spoofedReq);

    expect(resolved.tenantId).toBe('tenant-demo-default');
    expect(resolved.bankId).toBe(process.env.HINDSIGHT_BANK_ID || 'deal-memory-demo');
  });

  it('validates deal ownership to prevent cross-tenant IDOR access', () => {
    const alphaTenant = resolveTenantContext(
      new NextRequest('http://localhost:3000/api/deals', {
        headers: { 'x-tenant-id': 'tenant-alpha-corp' },
      })
    );

    // Alpha tenant attempting to access deal owned by Nexa
    const nexaDealCompanyId = 'tenant-nexa-enterprises-cmp-1';
    const alphaDealCompanyId = 'tenant-alpha-corp-cmp-1';

    expect(validateDealTenantOwnership(alphaDealCompanyId, alphaTenant)).toBe(true);
    expect(validateDealTenantOwnership(nexaDealCompanyId, alphaTenant)).toBe(false);
  });
});
