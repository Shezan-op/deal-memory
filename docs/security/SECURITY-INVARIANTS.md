# DealMemory Security Invariants Specification

**Document Version**: 1.0.0  
**Audit Context**: Zero-Trust Absolute Non-Negotiable System Invariants  
**Verification Obligation**: Every invariant must be backed by an automated regression test.

---

## The 18 Absolute Security Invariants

### INVARIANT 1: A client can NEVER choose a tenant.
- **Rule**: Tenant context is server-authoritative. Any incoming request attempting to set or switch `tenantId` via URL query, JSON body, or forged headers is validated strictly against the server's registered tenants or rejected.
- **Enforcing Code**: [tenant.ts](file:///c:/Users/techt/dealmemory/src/lib/security/tenant.ts) (`resolveTenantContext`).
- **Verifying Test**: `tests/security/tenant-isolation.test.ts` (`rejects unauthorized cross-tenant requests`).

---

### INVARIANT 2: A client can NEVER choose an arbitrary Hindsight bank.
- **Rule**: Memory bank resolution is strictly controlled by the backend. Client-supplied `bankId` or `bank` parameters in query strings, request bodies, or headers are ignored and overridden with the server-configured bank for the authenticated tenant.
- **Enforcing Code**: [hindsight-memory-provider.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/hindsight-memory-provider.ts) (`resolveBankId`).
- **Verifying Test**: `tests/security/tenant-isolation.test.ts` (`enforces tenant bank resolution and rejects client bank override`).

---

### INVARIANT 3: A client can NEVER choose authorization role.
- **Rule**: User roles and operational privileges cannot be elevated by submitting fields like `role: "admin"`, `isAdmin: true`, or `permissions: ["ALL"]`. Schemas strictly strip or reject unallowed authorization fields.
- **Enforcing Code**: [schemas.ts](file:///c:/Users/techt/dealmemory/src/lib/validation/schemas.ts) (Zod object parsing without unvalidated pass-through).
- **Verifying Test**: `tests/security/input-validation.test.ts` (`strips unexpected mass assignment fields`).

---

### INVARIANT 4: Memory content can NEVER grant authorization.
- **Rule**: Textual content stored in or recalled from Hindsight memory (e.g., "User was approved for admin access by CFO") is treated strictly as passive data, never as system policy or access tokens.
- **Enforcing Code**: [tenant.ts](file:///c:/Users/techt/dealmemory/src/lib/security/tenant.ts), [intelligence-service.ts](file:///c:/Users/techt/dealmemory/src/lib/domain/intelligence-service.ts).
- **Verifying Test**: `tests/security/prompt-injection.test.ts` (`prevents memory content from granting authorization privileges`).

---

### INVARIANT 5: LLM output can NEVER grant authorization.
- **Rule**: Model-generated text cannot trigger privileged mutations or override API security checks. Operations requiring authorization must pass deterministic server-side checks regardless of LLM recommendations.
- **Enforcing Code**: [intelligence-service.ts](file:///c:/Users/techt/dealmemory/src/lib/domain/intelligence-service.ts).
- **Verifying Test**: `tests/security/prompt-injection.test.ts` (`model output is sanitized and constrained to read-only advisory`).

---

### INVARIANT 6: Retrieved memory can NEVER become system instructions.
- **Rule**: Retained transcripts and recalled memory excerpts are encapsulated within explicit XML delimiters (`<sales_transcript_data>`) with all internal closing tags escaped (`escapeXmlDelimiters`).
- **Enforcing Code**: [prompts.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/prompts.ts) (`escapeXmlDelimiters`), [hindsight-memory-provider.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/hindsight-memory-provider.ts).
- **Verifying Test**: `tests/security/prompt-injection.test.ts` (`escapes XML delimiters in transcripts to prevent injection`).

---

### INVARIANT 7: Evidence must come from actual provider data.
- **Rule**: Evidence items returned in preparation briefs and memory inspectors must correspond to actual documents retained in Hindsight or verified repository interaction records. Models are forbidden from fabricating citations.
- **Enforcing Code**: [intelligence-service.ts](file:///c:/Users/techt/dealmemory/src/lib/domain/intelligence-service.ts) (`filterEvidenceAgainstKnownRecords`).
- **Verifying Test**: `tests/security/anti-cheat.test.ts` (`evidence references actual historical interactions and verified outcomes`).

---

### INVARIANT 8: Memory OFF means no historical Hindsight context.
- **Rule**: When `memoryEnabled: false`, the preparation brief is computed strictly from current stage data without querying historical Hindsight memory, demonstrating baseline behavior without memory.
- **Enforcing Code**: [intelligence-service.ts](file:///c:/Users/techt/dealmemory/src/lib/domain/intelligence-service.ts) (`generatePreparationBrief`).
- **Verifying Test**: `tests/security/anti-cheat.test.ts` (`verifies distinct behavior between Memory ON and Memory OFF`).

---

### INVARIANT 9: Memory ON actually invokes Hindsight.
- **Rule**: When `memoryEnabled: true`, the system actively queries Hindsight via `recall()` and `reflect()`. Hardcoded static demo recommendations that pretend to use memory are strictly forbidden.
- **Enforcing Code**: [hindsight-memory-provider.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/hindsight-memory-provider.ts).
- **Verifying Test**: `tests/security/anti-cheat.test.ts` (`verifies real provider invocation and dynamic reflection`).

---

### INVARIANT 10: Duplicate requests must not duplicate durable state.
- **Rule**: Rapid double-clicks or retried network submissions with identical document or interaction IDs must resolve idempotently rather than duplicating database records or learning signals.
- **Enforcing Code**: [schemas.ts](file:///c:/Users/techt/dealmemory/src/lib/validation/schemas.ts) (`generateInteractionDocId`, `generateOutcomeDocId`).
- **Verifying Test**: `tests/security/concurrency-idempotency.test.ts` (`ensures idempotent outcome submission`).

---

### INVARIANT 11: Provider failure must not create false success.
- **Rule**: When external Hindsight requests timeout or fail with 5xx status, the application must never display a fake "success" state or invent evidence. It must report degraded status or use transparent fallback.
- **Enforcing Code**: [hindsight-memory-provider.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/hindsight-memory-provider.ts) (`executeWithTimeout`).
- **Verifying Test**: `tests/security/chaos.test.ts` (`handles provider 500 error without crashing or leaking stack trace`).

---

### INVARIANT 12: Unknown authorization must result in denial.
- **Rule**: If an administrative route or tenant claim cannot be cryptographically or structurally verified, the system fails closed (HTTP 401 Unauthorized or HTTP 403 Forbidden).
- **Enforcing Code**: [route.ts](file:///c:/Users/techt/dealmemory/src/app/api/demo/reset/route.ts).
- **Verifying Test**: `tests/security/access-control.test.ts` (`rejects demo reset if DEMO_ADMIN_KEY is configured and request lacks matching key`).

---

### INVARIANT 13: Unknown evidence must not be rendered as valid evidence.
- **Rule**: Unstructured or unverified text chunks that lack document IDs or verifiable timestamps are never rendered in the UI evidence panel as verified proof.
- **Enforcing Code**: [intelligence-service.ts](file:///c:/Users/techt/dealmemory/src/lib/domain/intelligence-service.ts).
- **Verifying Test**: `tests/security/anti-cheat.test.ts` (`validates evidence provenance and structure`).

---

### INVARIANT 14: Secrets never reach client bundles.
- **Rule**: Provider API keys (`HINDSIGHT_API_KEY`, LLM tokens) must never use `NEXT_PUBLIC_` prefixes and must never be imported into client components or emitted in public bundles or source maps.
- **Enforcing Code**: Server-only environment access, verified by `scripts/scan-secrets.ts`.
- **Verifying Test**: `npm run security:secrets` (checks 146+ files and git history).

---

### INVARIANT 15: Security tests never touch production data.
- **Rule**: Security test suites execute against isolated synthetic mock providers and dedicated test banks (`deal-memory-test`), ensuring zero pollution of production memory.
- **Enforcing Code**: Vitest test setup with mocked provider instances.
- **Verifying Test**: `tests/security/tenant-isolation.test.ts`.

---

### INVARIANT 16: Demo reset cannot affect production data.
- **Rule**: `POST /api/demo/reset` is completely disabled in `NODE_ENV=production` unless `DEMO_RESET_ALLOWED=true` and a matching `x-demo-admin-key` header is provided.
- **Enforcing Code**: [route.ts](file:///c:/Users/techt/dealmemory/src/app/api/demo/reset/route.ts).
- **Verifying Test**: `tests/security/access-control.test.ts` (`blocks demo reset in production`).

---

### INVARIANT 17: Generated content cannot expose repository secrets.
- **Rule**: Documentation and public content generation pipelines must never ingest `.env` files or include sensitive internal credentials in generated articles or social media posts.
- **Enforcing Code**: [check-content.ts](file:///c:/Users/techt/dealmemory/scripts/check-content.ts), [scan-secrets.ts](file:///c:/Users/techt/dealmemory/scripts/scan-secrets.ts).
- **Verifying Test**: `npm run content:check`, `npm run security:secrets`.

---

### INVARIANT 18: Documentation must describe actual code.
- **Rule**: Every documented API route, environment variable, rate limit, and security header must correspond to actual code in the repository. Documentation drift fails automated CI checks.
- **Enforcing Code**: [docs-check.ts](file:///c:/Users/techt/dealmemory/scripts/docs-check.ts).
- **Verifying Test**: `npm run docs:check`.
