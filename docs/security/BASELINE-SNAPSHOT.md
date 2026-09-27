# DealMemory Baseline Snapshot

**Document Version**: 1.0.0  
**Snapshot Date**: 2026-09-28  
**Audit Context**: Forensic Red Team, Adversarial Security, Reliability, AI Safety, Memory Integrity, and Release Assurance  
**Classification**: Internal Technical Baseline Specification  

---

## 1. System & Runtime Environment

| Dimension | Specification |
| :--- | :--- |
| **Project Name** | DealMemory (`dealmemory`) |
| **Repository Root** | `c:\Users\techt\dealmemory` |
| **Framework** | Next.js 16.3.6 (App Router, Turbopack Bundler, React Server Components) |
| **Runtime** | Node.js v24.5.0 (Windows / Linux container-compatible) |
| **React Version** | React 19.2.8 / React DOM 19.2.8 |
| **Package Manager** | npm 11+ (enforced via lockfile `package-lock.json`) |
| **Primary Language** | TypeScript 5.x (Strict mode enabled, `noImplicitAny: true`, zero emit on error) |
| **Styling** | Tailwind CSS v4 / PostCSS |
| **Testing Harness** | Vitest 5.0.2 with Next.js environment mocks |

---

## 2. Dependencies & Supply Chain Inventory

### Direct Production Dependencies (`dependencies`)
- `@rolldown/binding-win32-x64-msvc` (`^1.2.11`): High-performance native build binding.
- `@vectorize-io/hindsight-client` (`^0.10.1`): Official Vectorize Hindsight TypeScript SDK for long-term memory operations (`retain`, `recall`, `reflect`, `mental models`).
- `next` (`16.3.6`): Core web framework.
- `react` / `react-dom` (`19.2.8`): UI component rendering.
- `zod` (`^3.25.76`): Deterministic runtime schema validation and boundary sanitization.

### Development Dependencies (`devDependencies`)
- `@tailwindcss/postcss` (`^4`): Tailwind PostCSS integration.
- `@types/node` (`^22.20.4`): Node.js type definitions.
- `@types/react` / `@types/react-dom` (`^19`): React 19 type definitions.
- `eslint` (`^9`) & `eslint-config-next` (`16.3.6`): Code quality and static analysis.
- `tailwindcss` (`^4`): Utility-first CSS generation.
- `tsx` (`^4.23.15`): TypeScript execution engine for audit and verification scripts.
- `typescript` (`^5`): TypeScript compiler.
- `vitest` (`^5.0.2`): Unit, integration, security, and chaos test runner.

---

## 3. Provider Architecture

### Long-Term Memory Layer: Vectorize Hindsight
- **Client Library**: `@vectorize-io/hindsight-client` (v0.10.1).
- **Endpoint Protocol**: REST HTTP/HTTPS via `HINDSIGHT_BASE_URL` (default: `http://localhost:8888`).
- **Memory Banks**:
  - `deal-memory-demo`: Server-authoritative default demo bank.
  - `deal-memory-alpha`: Dedicated isolated enterprise bank for Alpha Commercial Corp.
  - `deal-memory-nexa`: Dedicated isolated enterprise bank for Nexa Enterprises.
- **Operations Bound**:
  - `retainInteraction()`: Ingests structured deal interactions wrapped in defensive XML tags.
  - `retainOutcome()`: Records verified deal progress signals (`PROGRESSED`, `STALLED`, `LOST`, `WON`).
  - `recall()`: Vector and tagged contextual semantic retrieval.
  - `reflect()`: Cognitive reasoning across multi-interaction deal history.
  - `healthCheck()`: Non-blocking connection and version verification.

### LLM Reasoning & Fallback Model
- **Provider Protocol**: Server-side synthesis via Hindsight reflection and local deterministic domain intelligence fallback (`intelligenceService`).
- **Prompt Isolation**: Defensive XML boundaries (`<sales_transcript_data>`, `<deal_context>`), explicit refusal of instruction override, strict sanitization of quotes and counts.

---

## 4. Routes & API Attack Surface

### User-Facing Pages (`src/app/`)
- `GET /`: Landing page, problem overview, and live workflow navigation.
- `GET /deals`: Active enterprise pipeline dashboard.
- `GET /deals/[dealId]`: Detailed deal overview with open objections and stakeholder profile.
- `GET /deals/[dealId]/timeline`: Chronological audit trail of sales interactions and outcomes.
- `GET /deals/[dealId]/prepare`: Live Deal Preparation Engine (Memory ON vs. Memory OFF comparison).
- `GET /deals/[dealId]/memory`: Deal-scoped semantic memory inspector and verified evidence panel.
- `GET /learning-loop`: Educational visualization of the Retain -> Recall -> Reflect lifecycle.
- `GET /demo`: Interactive presentation controller with controlled state reset.

### Server API Endpoints (`src/app/api/`)
- `GET /api/deals`: Lists all authorized enterprise deals for current tenant context.
- `GET /api/deals/[dealId]`: Retrieves specific deal entity with company and contact metadata.
- `POST /api/deals/[dealId]/prepare`: Generates evidence-grounded meeting strategy brief.
  - *Rate Limit*: 30 req/min per IP.
  - *Input*: `{ memoryEnabled?: boolean, customGoal?: string }`.
- `GET /api/deals/[dealId]/timeline`: Retrieves chronological interaction history.
- `GET /api/deals/[dealId]/memory`: Queries deal-scoped semantic memories from Hindsight.
- `POST /api/interactions`: Ingests raw sales interaction transcripts.
  - *Rate Limit*: 60 req/min per IP.
  - *Input*: `Interaction` schema.
- `POST /api/outcomes`: Records outcome feedback and triggers Hindsight learning.
  - *Rate Limit*: 60 req/min per IP.
  - *Input*: `Outcome` schema.
- `POST /api/memory/recall`: Direct semantic search across scoped memories.
  - *Rate Limit*: 60 req/min per IP.
  - *Input*: `{ dealId: string, query: string, tags?: string[], types?: string[] }`.
- `POST /api/memory/reflect`: Direct cognitive reflection over memory banks.
  - *Rate Limit*: 20 req/min per IP.
  - *Input*: `{ dealId: string, query: string, context?: string }`.
- `POST /api/demo/reset`: Administrative reset of demo fixtures to seed state.
  - *Rate Limit*: 5 req/min per IP.
  - *Auth*: Blocked in production unless `DEMO_RESET_ALLOWED=true` and `x-demo-admin-key` matches `DEMO_ADMIN_KEY`.

---

## 5. Security & Isolation Controls

### Multi-Tenancy & Authorization
- **Tenant Context**: Resolved server-authoritatively by `resolveTenantContext()` via verified headers/session.
- **Client Bank Selection**: **Strictly forbidden**. Requests submitting arbitrary `bankId` or `tenantId` are sanitized or rejected.
- **Tenant Boundary Enforcement**: `validateDealTenantOwnership()` ensures cross-company deal queries are rejected.

### HTTP Security Headers ([next.config.ts](file:///c:/Users/techt/dealmemory/next.config.ts))
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: http:; frame-ancestors 'none';`
- `X-Frame-Options`: `DENY` (prevents clickjacking).
- `X-Content-Type-Options`: `nosniff` (disables MIME-sniffing).
- `Referrer-Policy`: `strict-origin-when-cross-origin`.
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload` (HSTS).
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), browsing-topics=()`.

### Rate Limiting & Denial-of-Service Defense
- In-memory sliding window token bucket (`RateLimiter`).
- Returns HTTP 429 with RFC-compliant `Retry-After` header when thresholds are reached.

### Timeouts & Circuit Breaking
- All external Hindsight HTTP requests execute inside `executeWithTimeout()`:
  - Health check: 4,000 ms.
  - Retain: 10,000 ms.
  - Recall: 10,000 ms.
  - Reflect: 15,000 ms.
- Network connection failures (ECONNREFUSED) trigger domain-level fallbacks without uncaught exceptions or server crashes.

### Input Bounds & Defense-in-Depth ([schemas.ts](file:///c:/Users/techt/dealmemory/src/lib/validation/schemas.ts))
- All IDs constrained to `^[a-zA-Z0-9_-]{1,64}$`.
- Transcripts bounded to 50,000 characters; queries to 1,000 characters; goals to 500 characters.
- Text sanitization strips dangerous null bytes (`\0`) and non-printable control characters.

---

## 6. Seed System & Demo Mode

- **Seed Script**: `scripts/seed-demo.ts` seeds realistic B2B enterprise deals (`deal-acme-001`, `deal-nexa-002`, `deal-omni-003`).
- **Dynamic Learning Demonstration**: Acme deal showcases progression from stalled technical reviews (objections: migration risk, Okta SSO) to validated milestones through evidence-grounded strategy.
- **Reset Safety**: State resets only reinitialize local memory state; production databases are physically decoupled and safeguarded by environment guards.
