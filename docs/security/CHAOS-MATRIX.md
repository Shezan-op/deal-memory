# DealMemory Chaos & Resilience Engineering Matrix

**Document Version**: 1.0.0  
**Audit Context**: Systematic Fault Injection & Resiliency Verification  
**Standard Compliance**: OWASP ASVS v5.0.0 Level 2 / Reliability Engineering  

---

## 1. Resilience Testing Objectives

The DEALMEMORY system must maintain high availability, bounded resource consumption, and predictable fail-safe behavior under adverse network, provider, or environmental conditions.

---

## 2. Component Chaos Engineering Matrix

| Component | Injected Failure | Expected Behavior | Observed Behavior | Recovery Mechanism | Regression Test |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hindsight Memory Provider** | Cluster 500 / 503 Internal Panic during `recall()` | Catches error safely; returns sanitized HTTP 500 without leaking stack trace or file paths | HTTP 500 returned with `{ error: 'Internal memory recall failure.' }`. Stack trace suppressed. | Server continues processing subsequent requests normally. | `tests/security/chaos.test.ts` (`handles provider 500 error`) |
| **Hindsight Memory Provider** | Network Hang / Timeout (>10,000ms on Retain/Recall) | Aborts operation via `executeWithTimeout()`; returns error response; prevents thread blockage | Request aborts after timeout threshold with descriptive timeout error; no hung sockets. | Node.js event loop remains responsive; socket freed. | `tests/security/chaos.test.ts` (`handles provider timeout gracefully`) |
| **Hindsight Memory Provider** | Malformed / Corrupted JSON payload from provider (missing `results` key) | Gracefully normalizes response to empty array `[]`; avoids uncaught TypeError | Returns empty results array without crashing; logs warning. | Handlers safely return valid JSON structure to UI. | `tests/security/chaos.test.ts` (`handles malformed / unexpected provider response`) |
| **Hindsight Health Check** | Network Connection Refused (`ECONNREFUSED` / offline server) | Health check returns `{ connected: false }` with error message; does not throw uncaught error | Health check catches error; marks status offline; UI gracefully enters offline standby mode. | System automatically retries on next poll or user navigation. | `tests/security/chaos.test.ts` (`handles network connection refused`) |
| **Preparation Engine** | Third-party LLM / Reflection provider 500 failure | Gracefully falls back to local deterministic domain intelligence service | Brief is generated using verified interaction records from repository; UI remains functional. | Transparent domain fallback ensures user workflow is uninterrupted. | `tests/security/concurrency-idempotency.test.ts` |
| **API Rate Limiter** | Request Flood (70 recall requests in 10 seconds from single IP) | Allows first 60 requests; rejects requests 61–70 with HTTP 429 Too Many Requests and `Retry-After` | Exactly 60 requests accepted; 61st onwards receive 429 with reset countdown header. | Rate bucket automatically replenishes after sliding window expires. | `tests/security/chaos.test.ts` (`enforces backpressure under request flood`) |
| **API Route Handlers** | Malformed / Truncated JSON in HTTP request body | Gracefully parses or returns HTTP 400 Bad Request; zero unhandled promise rejections | NextRequest parser catch block safely handles malformed body; returns safe response. | Next request handled cleanly. | `tests/security/chaos.test.ts` (`rejects corrupt/malformed JSON payloads`) |
| **Demo State Controller** | Concurrent / Rapid double-click on state reset (`POST /api/demo/reset`) | Rate limiter throttles to max 5 resets/min; state resets idempotently without race conditions | Initial reset re-seeds memory cleanly; subsequent rapid clicks are throttled safely. | Idempotent seed function replaces in-memory state cleanly. | `tests/security/access-control.test.ts`, `rate-limit.test.ts` |
| **Multi-Tenant Scoping** | Forged Tenant ID header (`x-tenant-id: malicious-tenant`) | System checks registry; rejects or ignores unknown tenant; defaults to secure demo tenant | Unauthorized tenant header is ignored; request bound strictly to default demo tenant. | Strict server-side registry prevents unauthorized bank access. | `tests/security/tenant-isolation.test.ts` |
| **Input Sanitizer** | Path traversal attempt in dealId (`../../etc/passwd`) | `SafeIdSchema` rejects format with HTTP 400; filesystem never touched | Request rejected immediately with descriptive regex validation failure. | Request terminated at validation gate before hitting repository. | `tests/security/input-validation.test.ts`, `mutation.test.ts` |

---

## 3. Chaos Verification Command

To verify that all chaos engineering and fault injection scenarios pass reliably:

```bash
npm run test tests/security/chaos.test.ts
```
