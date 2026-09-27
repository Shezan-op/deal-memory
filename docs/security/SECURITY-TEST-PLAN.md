# DealMemory Security Test Plan

## 1. Test Objectives & Scope
The objective of this security test plan is to validate DealMemory against adversarial attacks, prompt injection, data leakage, denial-of-service, and multi-tenant isolation failure, benchmarking against **OWASP ASVS v5.0.0**, **OWASP Top 10:2025**, and **OWASP GenAI/LLM Top 10:2026**.

### In-Scope Components
- All API Route Handlers: `/api/deals/*`, `/api/interactions`, `/api/outcomes`, `/api/memory/*`, `/api/demo/reset`, `/api/health`.
- Domain Services: `IntelligenceService`, `HindsightMemoryProvider`, `DealRepository`.
- Security Guards: `rateLimiter`, `resolveTenantContext`, `escapeXmlDelimiters`, `SafeIdSchema`, `sanitizeText`.
- HTTP Security Headers in Next.js configuration.

### Out-of-Scope
- Physical server infrastructure and hosting data center physical controls.
- Third-party cloud infrastructure internals of Vectorize.io beyond API contract boundaries.

---

## 2. Test Suites & Verification Methods

| Test Category | Suite Location | Primary Focus | Verification Method |
| :--- | :--- | :--- | :--- |
| **Access Control & Auth** | [access-control.test.ts](file:///c:/Users/techt/dealmemory/tests/security/access-control.test.ts) | Demo reset protection, admin token checks, 404 on missing deals, path traversal rejection. | Automated Vitest |
| **Prompt Injection & AI** | [prompt-injection.test.ts](file:///c:/Users/techt/dealmemory/tests/security/prompt-injection.test.ts) | XML delimiter escaping, prompt smuggling, script tag neutrality in transcripts. | Automated Vitest |
| **Rate Limiting & DoS** | [rate-limit.test.ts](file:///c:/Users/techt/dealmemory/tests/security/rate-limit.test.ts) | Sliding window quota enforcement, IP isolation, Retry-After header generation. | Automated Vitest |
| **Input Validation & Types** | [input-validation.test.ts](file:///c:/Users/techt/dealmemory/tests/security/input-validation.test.ts) | Transcript size bounds (50k limit), prototype pollution, control character stripping, ID regex. | Automated Vitest |
| **Tenant & Bank Isolation** | [tenant-isolation.test.ts](file:///c:/Users/techt/dealmemory/tests/security/tenant-isolation.test.ts) | Multi-tenant memory bank mapping, rejection of client bankId injection, cross-company IDOR. | Automated Vitest |
| **Anti-Cheat & Reasoning** | [anti-cheat.test.ts](file:///c:/Users/techt/dealmemory/tests/security/anti-cheat.test.ts) | Memory ON/OFF contrast, dynamic synthesis without hardcoded shortcuts, adaptation to custom data. | Automated Vitest |
| **Concurrency & State** | [concurrency-idempotency.test.ts](file:///c:/Users/techt/dealmemory/tests/security/concurrency-idempotency.test.ts) | Idempotent duplicate ingestion, outcome re-recording, concurrent request safety. | Automated Vitest |
| **Domain Logic Integrity** | [domain.test.ts](file:///c:/Users/techt/dealmemory/tests/unit/domain.test.ts) | Conflict detection (budget discrepancies), evidence item linking, provider fallback logic. | Automated Vitest |

---

## 3. Execution Commands

```bash
# Execute complete security test plan
npm run test

# Run individual security suite
npx vitest run tests/security/tenant-isolation.test.ts
```
