# OWASP ASVS v5.0.0 Control Matrix

**Standard**: OWASP Application Security Verification Standard (ASVS) v5.0.0  
**Application**: DealMemory AI Deal Intelligence Engine  
**Evaluation Scope**: Level 1 & Level 2 Controls applicable to B2B SaaS Deal Intelligence

---

| Control ID | ASVS Requirement Description | Applicable? | Implementation in DealMemory | Test / Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **V1.1.1** | Verify use of structured architecture with clear trust boundaries. | Yes | UI -> Server API -> Domain Service -> Hindsight Adapter. Browser never communicates directly with Hindsight. | Verified via `docs/SYSTEM-DESIGN.md` and source inspection. | **PASS** |
| **V1.1.4** | Verify all components operate under principle of least privilege. | Yes | Agent possesses zero autonomous execution tools (no email sending, no DB deletion, no file system writes). | Verified via `src/lib/domain/models.ts` and code search. | **PASS** |
| **V2.1.1** | Verify user authentication controls are implemented server-side. | Partial | MVP uses organizational tenant context mapping; production auth deferred to enterprise SSO/OIDC. | Documented in `docs/security/SECURITY-EXCEPTIONS.md`. | **PARTIAL** |
| **V3.1.1** | Verify session tokens are protected from disclosure in transit. | Yes | HTTPS enforced in production; HSTS header enabled with 2-year max-age. | Configured in `next.config.ts`. | **PASS** |
| **V4.1.1** | Verify access control decisions are enforced on trusted server. | Yes | Deal access, memory recall, and preparation brief generation are validated on server. Client cannot override bank ID. | Verified in `src/app/api/deals/[dealId]/prepare/route.ts`. | **PASS** |
| **V4.1.2** | Verify tenant isolation prevents cross-tenant data access (IDOR). | Yes | Hindsight bank IDs are derived server-side per tenant (`deal-memory-${tenantId}`). Cross-tenant deal lookups fail closed. | Verified via `tests/security/tenant-isolation.test.ts`. | **PASS** |
| **V4.1.5** | Verify administrative and sensitive endpoints require explicit authorization. | Yes | `/api/demo/reset` requires `x-demo-admin-key` and is blocked in production unless `DEMO_RESET_ALLOWED=true`. | Tested in `tests/security/access-control.test.ts`. | **PASS** |
| **V5.1.1** | Verify all input data is validated against a strict schema. | Yes | Zod schemas enforce type, length, regex (`^[a-zA-Z0-9_-]{1,64}$`), and enum bounds on all request payloads. | Verified in `src/lib/validation/schemas.ts`. | **PASS** |
| **V5.1.4** | Verify request body size limits are enforced to prevent DoS. | Yes | Payload sizes bounded: queries max 1,000 chars, transcripts max 50,000 chars, tags max 50 items. | Verified in `src/lib/validation/schemas.ts`. | **PASS** |
| **V5.2.2** | Verify sanitization of untrusted data before insertion into downstream prompts. | Yes | Transcripts delimited with `<sales_transcript_data>` tags; explicit anti-jailbreak instructions prevent prompt injection. | Tested in `tests/security/prompt-injection.test.ts`. | **PASS** |
| **V5.3.1** | Verify output rendering prevents Cross-Site Scripting (XSS). | Yes | React automatic string escaping; zero use of `dangerouslySetInnerHTML` on customer data. CSP blocks inline script execution. | Verified via static search and `next.config.ts`. | **PASS** |
| **V6.1.1** | Verify sensitive secrets are never stored in source code. | Yes | Hindsight API keys and internal secrets loaded exclusively via `process.env`. Structured logger strips secrets. | Verified via `scripts/final-audit.ts` and secret scan. | **PASS** |
| **V7.1.1** | Verify application errors do not expose stack traces or system internals. | Yes | Catch blocks sanitize user-facing errors into clean JSON `{ error: "..." }`; stack traces logged only server-side. | Tested in `tests/security/input-validation.test.ts`. | **PASS** |
| **V7.2.1** | Verify log injection is prevented and sensitive customer PII is masked. | Yes | Structured logger strips control characters and masks tokens/keys prior to emission. | Verified in `src/lib/logging/logger.ts`. | **PASS** |
| **V10.1.1** | Verify malicious input cannot traverse directories or file paths. | Yes | Entity IDs restricted to alphanumeric + underscore/dash; zero file system path construction from client input. | Verified in `src/lib/validation/schemas.ts`. | **PASS** |
| **V11.1.1** | Verify rate limiting protects expensive and sensitive operations. | Yes | In-memory token bucket rate limiter restricts reflection/preparation requests to 30 req/min per IP. | Tested in `tests/security/rate-limit.test.ts`. | **PASS** |
| **V14.1.1** | Verify HTTP security headers are configured. | Yes | CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy implemented. | Configured in `next.config.ts`. | **PASS** |
| **V14.2.1** | Verify external service communications use bounded timeouts. | Yes | Network calls to Hindsight wrapped in `AbortSignal.timeout(10000)` with fallback. | Implemented in `src/lib/hindsight/hindsight-memory-provider.ts`. | **PASS** |
