# DealMemory Security Changelog

## [2026-09-28] - Comprehensive Security & Robustness Hardening

### Summary
Comprehensive zero-trust audit conducted benchmarked against OWASP ASVS v5.0.0, OWASP Top 10:2025, OWASP GenAI/LLM Top 10:2026, and OWASP Top 10 for Agentic Applications:2026. All identified critical and high vulnerabilities have been remediated and covered by automated regression test suites.

---

### Remediated Vulnerabilities

#### SEC-001: Unprotected Demo Reset Route
- **Severity**: **CRITICAL** (OWASP A01 / ASVS V4.1)
- **Root Cause**: `/api/demo/reset` was publicly accessible with zero authentication or environment guards.
- **Fix**: Implemented environment guard (`NODE_ENV === 'production'` requires `DEMO_RESET_ALLOWED=true`), optional admin token authentication (`x-demo-admin-key`), and rate limiting (5 req/min).
- **Test**: `tests/security/access-control.test.ts`
- **Documentation**: `docs/security/INITIAL-AUDIT.md`, `docs/security/SECURITY-BASELINE.md`

#### SEC-002: Unbounded Memory Recall & Reflect Exfiltration
- **Severity**: **HIGH** (OWASP A01 / LLM02)
- **Root Cause**: `/api/memory/recall` and `/api/memory/reflect` accepted unconstrained queries without mandatory deal scoping, allowing arbitrary semantic memory queries across the bank.
- **Fix**: Required mandatory `dealId` parameter, enforced safe identifier validation (`SafeIdSchema`), and automatically injected `deal:{dealId}` tag filter.
- **Test**: `tests/security/access-control.test.ts`

#### SEC-003: Hardcoded Demo Anti-Cheat Violation
- **Severity**: **HIGH** (Functional Integrity & Transparency)
- **Root Cause**: `intelligence-service.ts` contained a ternary shortcut (`deal.id === 'deal-acme-001'`) returning static strings rather than dynamically synthesizing from recorded outcomes and Hindsight reflection.
- **Fix**: Replaced static shortcut with dynamic synthesis that aggregates `whatWorked`, `whatDidNotWork`, `whatHasBeenTried`, and detected contradictions directly from recorded domain outcomes and Hindsight reflection.
- **Test**: `tests/security/anti-cheat.test.ts`

#### SEC-004: Missing Rate Limiting on Expensive AI Endpoints
- **Severity**: **MEDIUM** (OWASP A04 / LLM10)
- **Root Cause**: Endpoints triggering LLM reflection and Hindsight writes had no request throttling.
- **Fix**: Created in-memory token bucket sliding window rate limiter (`rateLimiter`) applying per-IP limits across `/api/memory/reflect`, `/api/deals/[dealId]/prepare`, `/api/interactions`, and `/api/outcomes`.
- **Test**: `tests/security/rate-limit.test.ts`

#### SEC-005: Missing HTTP Security Headers
- **Severity**: **MEDIUM** (OWASP A02 / ASVS V14.4)
- **Root Cause**: `next.config.ts` lacked standard security headers, exposing application to clickjacking and MIME-sniffing.
- **Fix**: Configured global `headers()` in `next.config.ts` including CSP, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`.
- **Test**: `npm run security:baseline`

#### SEC-006: Unbounded Input Lengths in Transcripts and Queries
- **Severity**: **MEDIUM** (OWASP A03 / ASVS V5.1)
- **Root Cause**: Payloads were unconstrained, exposing application to memory exhaustion and token DoS.
- **Fix**: Enforced strict length limits in `schemas.ts`: transcripts max 50,000 characters, queries max 1,000 characters, context max 2,000 characters. Null bytes and control characters stripped via `sanitizeText()`.
- **Test**: `tests/security/input-validation.test.ts`

#### SEC-007: Delimiter Smuggling in Hindsight Prompt Construction
- **Severity**: **HIGH** (OWASP LLM01 / ASI01)
- **Root Cause**: User-supplied text could break out of `<sales_transcript_data>` or `<deal_context>` tags.
- **Fix**: Implemented `escapeXmlDelimiters()` to escape closing XML tags (`&lt;/...&gt;`) and added explicit security directives to Hindsight missions.
- **Test**: `tests/security/prompt-injection.test.ts`

#### SEC-008: Missing Timeouts on Upstream Hindsight Operations
- **Severity**: **MEDIUM** (Reliability / Cascading Failures)
- **Root Cause**: Fetch calls to Hindsight client lacked explicit timeouts, allowing worker processes to hang indefinitely during provider outages.
- **Fix**: Wrapped all provider calls in `executeWithTimeout()` (10s default, 15s reflect) with graceful domain fallback.
- **Test**: `tests/unit/domain.test.ts`
