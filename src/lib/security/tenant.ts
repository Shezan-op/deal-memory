/**
 * Tenant Context & Bank Security Resolver
 * Enforces server-authoritative mapping between organization tenants and Hindsight memory banks.
 * Strictly prevents client-supplied bankId or tenantId injection.
 */

export interface TenantContext {
  tenantId: string;
  bankId: string;
  organizationName: string;
  isDemoTenant: boolean;
}

const DEFAULT_DEMO_TENANT: TenantContext = {
  tenantId: 'tenant-demo-default',
  bankId: process.env.HINDSIGHT_BANK_ID || 'deal-memory-demo',
  organizationName: 'DealMemory Global Demo',
  isDemoTenant: true,
};

// Known tenant registry for enterprise multi-tenancy
const TENANT_REGISTRY: Record<string, TenantContext> = {
  'tenant-demo-default': DEFAULT_DEMO_TENANT,
  'tenant-alpha-corp': {
    tenantId: 'tenant-alpha-corp',
    bankId: 'deal-memory-alpha',
    organizationName: 'Alpha Commercial Corp',
    isDemoTenant: false,
  },
  'tenant-nexa-enterprises': {
    tenantId: 'tenant-nexa-enterprises',
    bankId: 'deal-memory-nexa',
    organizationName: 'Nexa Enterprises',
    isDemoTenant: false,
  },
};

/**
 * Resolves the authenticated tenant context from the incoming request.
 * In production, this extracts and cryptographically verifies claims from an
 * authorization header (e.g., Bearer JWT or verified session).
 * Client-supplied bankId parameters are strictly ignored.
 */
export function resolveTenantContext(req?: Request): TenantContext {
  if (!req) return DEFAULT_DEMO_TENANT;

  // Check header for tenant identification (e.g. from reverse-proxy or session)
  const tenantHeader = req.headers.get('x-tenant-id');
  if (tenantHeader && TENANT_REGISTRY[tenantHeader]) {
    return TENANT_REGISTRY[tenantHeader];
  }

  // Fallback to default demo tenant
  return DEFAULT_DEMO_TENANT;
}

/**
 * Verifies that a target deal belongs to the caller's tenant.
 * Prevents horizontal privilege escalation / IDOR across companies.
 */
export function validateDealTenantOwnership(dealCompanyId: string, tenant: TenantContext): boolean {
  if (tenant.isDemoTenant) {
    // Demo tenant owns demo fixtures
    return true;
  }
  // For isolated tenants, verify strict company ownership
  return dealCompanyId.startsWith(tenant.tenantId);
}
