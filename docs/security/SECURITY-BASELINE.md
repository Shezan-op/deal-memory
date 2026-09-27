# DealMemory Security Baseline Specification

## 1. HTTP Security Headers
Configured globally in [next.config.ts](file:///c:/Users/techt/dealmemory/next.config.ts) and applied to all HTTP routes:

| Header | Configured Value | Security Purpose |
| :--- | :--- | :--- |
| **Content-Security-Policy** | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: http:; frame-ancestors 'none';` | Restricts asset loading origins; eliminates framing attacks. |
| **X-Frame-Options** | `DENY` | Prevents clickjacking and UI redressing attacks. |
| **X-Content-Type-Options** | `nosniff` | Disables MIME type sniffing by browsers. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects sensitive paths and query strings from leaking across origins. |
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | Enforces HTTPS transport for 2 years with HSTS preload. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Disables access to sensitive hardware and privacy-invasive APIs. |

---

## 2. Input Limits & Defensive Validation Bounds
Enforced deterministically by Zod schemas in [schemas.ts](file:///c:/Users/techt/dealmemory/src/lib/validation/schemas.ts):

| Field / Input | Maximum Bound | Validation Rule |
| :--- | :--- | :--- |
| **Identifiers (`dealId`, `interactionId`)** | 64 characters | Alphanumeric, underscores, hyphens only (`/^[a-zA-Z0-9_-]+$/`). No `..`, `/`, `\`. |
| **Raw Sales Transcripts** | 50,000 characters | Non-empty, sanitized against null bytes and control characters. |
| **Search & Recall Queries** | 1,000 characters | Min 1 char, max 1,000 chars. Sanitized. |
| **Meeting Context** | 2,000 characters | Min 5 chars, max 2,000 chars. Sanitized. |
| **Custom Goal** | 500 characters | Optional, max 500 chars. Sanitized. |
| **Participants List** | Max 50 items | Each participant max 100 characters. |
| **Objections List** | Max 20 items | Each objection max 200 characters. |
| **Tags List** | Max 50 items | Each tag max 100 characters. |

---

## 3. Rate Limiting Baselines
Enforced by sliding window token bucket in [rate-limiter.ts](file:///c:/Users/techt/dealmemory/src/lib/security/rate-limiter.ts):

| Route / Endpoint | Limit | Window | Purpose |
| :--- | :--- | :--- | :--- |
| `POST /api/deals/[dealId]/prepare` | 30 requests | 60 seconds | Protects LLM and Hindsight reflection reasoning budget. |
| `POST /api/memory/reflect` | 20 requests | 60 seconds | Throttles compute-intensive reflection reasoning. |
| `POST /api/memory/recall` | 60 requests | 60 seconds | Prevents search index exhaustion. |
| `POST /api/interactions` | 60 requests | 60 seconds | Throttles automated document ingestion. |
| `POST /api/outcomes` | 60 requests | 60 seconds | Throttles outcome learning writes. |
| `POST /api/demo/reset` | 5 requests | 60 seconds | Strictly throttles state reset attempts. |

---

## 4. Timeout Baselines
Enforced via `Promise.race()` in [hindsight-memory-provider.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/hindsight-memory-provider.ts):

| Operation | Timeout Duration | Failure Behavior |
| :--- | :--- | :--- |
| **Health Check** | 5,000 ms | Reports disconnected; switches UI to local standby mode. |
| **Retain (Interaction / Outcome)** | 10,000 ms | Catches error; returns graceful failure response without crashing. |
| **Recall** | 10,000 ms | Falls back to in-memory deal interaction records. |
| **Reflect** | 15,000 ms | Falls back to dynamic domain reflection engine. |

---

## 5. Error Response Sanitization
- API routes catch exceptions and return structured JSON with safe user-facing error messages.
- Technical error stack traces, server file paths, internal IP addresses, and API credentials are **never** exposed in HTTP response bodies.
- Detailed technical errors are logged server-side via `Logger.error()` for diagnostic analysis.
