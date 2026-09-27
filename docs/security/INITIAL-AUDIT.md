# Initial Security & Architecture Inventory (Reconnaissance)

**Date**: September 28, 2026  
**Auditor**: Lead Security Architect & QA Engineer  
**Scope**: Full repository inspection prior to remediation.

---

## 1. System Inventory

### 1.1 Entry Points
- **HTTP GET Routes**:
  - `/api/deals` - List all deals.
  - `/api/deals/[dealId]` - Read deal details.
  - `/api/deals/[dealId]/timeline` - Read chronological interaction timeline.
  - `/api/deals/[dealId]/memory` - Read memory bank records.
- **HTTP POST Routes**:
  - `/api/deals/[dealId]/prepare` - Generate AI meeting brief (Memory ON/OFF).
  - `/api/interactions` - Create and retain a new sales interaction.
  - `/api/outcomes` - Ingest an outcome for an existing interaction.
  - `/api/memory/recall` - Raw factual memory search.
  - `/api/memory/reflect` - Deep reasoning synthesis.
  - `/api/demo/reset` - Reset domain database to seed state.
- **Web Frontend Views**:
  - `/` (Home), `/deals` (Inbox), `/deals/[dealId]` (Overview), `/deals/[dealId]/timeline`, `/deals/[dealId]/prepare`, `/deals/[dealId]/memory`, `/learning-loop`, `/demo` (Judge Walkthrough).

---

## 2. Identified Vulnerabilities & Deficiencies

### High & Critical Severity Vulnerabilities

1. **VULN-001: Unprotected Privileged Endpoint (`POST /api/demo/reset`)**
   - **Severity**: HIGH
   - **Finding**: `/api/demo/reset` executes without authentication, authorization, or environment guards. Any unauthenticated caller can reset the entire operational database.
   - **Attack Path**: `curl -X POST https://app/api/demo/reset` wipes all live user modifications.
   - **Remediation**: Guard endpoint with `DEMO_RESET_ALLOWED=true` environment check and require authorization token (`x-demo-admin-key`). Completely disable in production unless explicitly authorized.

2. **VULN-002: Unbounded Retrieval Scope in Memory Recall & Reflect (`POST /api/memory/recall`, `/reflect`)**
   - **Severity**: HIGH
   - **Finding**: `RecallRequestSchema` and `ReflectRequestSchema` allow `dealId` and `tags` to be omitted. When omitted, `tags` evaluates to `undefined`, querying the entire Hindsight memory bank across all accounts without tenant boundaries.
   - **Attack Path**: Attacker calls `/api/memory/recall` with `{ "query": "password" }` or `{ "query": "confidential" }` to exfiltrate cross-deal memory.
   - **Remediation**: Require `dealId` parameter, validate deal ownership against tenant context, and automatically scope all recall/reflect queries with `tags: ['deal:' + dealId]`.

3. **VULN-003: Hardcoded Demo Shortcuts in Intelligence Service (Anti-Cheat Violation)**
   - **Severity**: MEDIUM / INTEGRITY BUG
   - **Finding**: `intelligence-service.ts` line 206 hardcoded `deal.id === 'deal-acme-001'` to return a static string rather than computing from actual Hindsight reflection and real interactions. This violates the core hackathon principle: newly retained interactions and outcomes did not dynamically update the recommendation.
   - **Remediation**: Remove the hardcoded string check. Dynamically synthesize recommendations from actual Hindsight reflection and recorded interaction outcomes.

4. **VULN-004: Missing Rate Limiting & Resource Exhaustion (OWASP A04, LLM10)**
   - **Severity**: MEDIUM
   - **Finding**: Zero rate limiting exists on expensive Hindsight `reflect()` and `prepare` endpoints. An automated script can trigger hundreds of LLM reasoning requests per minute, creating denial of service or runaway token costs.
   - **Remediation**: Implement an in-memory token bucket rate limiter middleware bounding requests per IP and endpoint.

5. **VULN-005: Missing Security Headers & Anti-Clickjacking Protection (`next.config.ts`)**
   - **Severity**: MEDIUM
   - **Finding**: `next.config.ts` was empty. Missing `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy`, and `Permissions-Policy`.
   - **Remediation**: Configure standard OWASP headers in `next.config.ts`.

6. **VULN-006: Lack of Network Timeouts & Abort Signals in Hindsight Adapter**
   - **Severity**: MEDIUM
   - **Finding**: Calls to `this.client.retain`, `recall`, and `reflect` in `HindsightMemoryProvider` had no timeouts. If the Hindsight server hung or dropped connections, requests would hang indefinitely.
   - **Remediation**: Wrap all external HTTP client calls with bounded timeouts (8,000ms - 10,000ms) and graceful fallback.

7. **VULN-007: Unbounded String Inputs & Missing Parameter Validation (OWASP A05)**
   - **Severity**: LOW / MEDIUM
   - **Finding**: `query` in `RecallRequestSchema` had no maximum length; `rawContent` in `CreateInteractionSchema` had no upper bound. Missing regex validation on `dealId` and `interactionId`.
   - **Remediation**: Enforce strict length limits (query max 1,000 chars, rawContent max 50,000 chars) and regex `^[a-zA-Z0-9_-]{1,64}$` on all entity IDs.

8. **VULN-008: Prompt Injection Delimiter Exposure in Retain Dialogue**
   - **Severity**: MEDIUM
   - **Finding**: `interaction.rawContent` was appended directly into markdown prompts without XML data boundaries or injection defense instructions.
   - **Remediation**: Wrap untrusted customer inputs in explicit `<sales_transcript_data>` and `<untrusted_dialogue>` tags, accompanied by strict instructions that transcript content is passive data, never system commands.
