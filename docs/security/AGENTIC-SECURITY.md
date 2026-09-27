# DealMemory Agentic Security Specification

## Standard Baseline
Evaluated against **OWASP Top 10 for Agentic Applications (ASI:2026)** and OWASP Securing Agentic Applications Guidelines.

---

## Agentic Risk Classification Matrix

| Category ID | Vulnerability Category | Status in DealMemory | Mitigation & Technical Evidence |
| :--- | :--- | :--- | :--- |
| **ASI01** | **Agent Goal Hijack** | **PRIMARY** | Prompt delimiter isolation (`escapeXmlDelimiters`), inert XML tagging (`<sales_transcript_data>`), and anti-override directives in `HINDSIGHT_REFLECT_MISSION`. |
| **ASI02** | **Tool Misuse & Exploitation** | **NOT APPLICABLE** | DealMemory exposes zero external write tools (no email, shell, webhook, or file execution tools). Operates on Principle of Least Agency. |
| **ASI03** | **Identity & Privilege Abuse** | **PRIMARY** | Server-authoritative tenant resolution in `tenant.ts`. Client parameters like `?bankId=` or body overrides are ignored. |
| **ASI04** | **Agentic Supply Chain Vulnerabilities** | **SECONDARY** | Locked dependency tree for `@vectorize-io/hindsight-client`, verified build pipeline, zero runtime script injection. |
| **ASI05** | **Unexpected Code Execution** | **NOT APPLICABLE** | Zero `eval()`, `new Function()`, `vm`, or dynamic runtime script interpretation exists in the codebase. |
| **ASI06** | **Memory & Context Poisoning** | **PRIMARY** | Memory treated as untrusted historical data. Multi-interaction consensus required for pattern synthesis. Explicit conflict detection. |
| **ASI07** | **Insecure Inter-Agent Communication** | **NOT APPLICABLE** | Single-tier reasoning model; no arbitrary inter-agent message buses or unauthenticated autonomous agent swarms. |
| **ASI08** | **Cascading Failures** | **PRIMARY** | Bounded timeouts (10s retain/recall, 15s reflect), graceful domain synthesis fallback if Hindsight is offline. Zero infinite retry loops. |
| **ASI09** | **Human-Agent Trust Exploitation** | **PRIMARY** | Honest confidence labeling (`isInsufficientEvidence: true` when Memory is OFF). Grounded evidence citations for all claims. |
| **ASI10** | **Rogue Agents** | **NOT APPLICABLE** | No self-directed autonomous loops. Agent executes strictly in response to explicit user HTTP requests (`prepare`, `record`). |

---

## Detailed Threat Analysis

### ASI01: Agent Goal Hijack
- **Threat**: Adversary embeds jailbreak commands in meeting notes attempting to redirect the reflection agent's focus away from deal analysis toward exfiltrating keys or generating false winning strategies.
- **Controls**:
  - `escapeXmlDelimiters` prevents delimiter breakouts.
  - Strict system prompt role lock in [prompts.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/prompts.ts).
  - Test suite: [prompt-injection.test.ts](file:///c:/Users/techt/dealmemory/tests/security/prompt-injection.test.ts).

### ASI03: Identity & Privilege Abuse
- **Threat**: Attacker sends requests attempting to switch to another company's memory bank via client-supplied parameters (`bankId: "victim-bank"`).
- **Controls**:
  - `resolveTenantContext()` inspects trusted headers or session claims.
  - Test suite: [tenant-isolation.test.ts](file:///c:/Users/techt/dealmemory/tests/security/tenant-isolation.test.ts).

### ASI06: Memory & Context Poisoning
- **Threat**: Attacker submits a fabricated interaction asserting that a prospect has infinite budget or has agreed to purchase.
- **Controls**:
  - Distinguishes between prospective claims and recorded verified outcomes (`PROGRESSED` vs `STALLED`).
  - Highlights contradictions in the UI as active `MemoryConflict` items rather than silently trusting the latest claim.

### ASI08: Cascading Failures & Outage Resilience
- **Threat**: Hindsight cluster outage causes the DealMemory web server to hang indefinitely, depleting thread pools and causing denial of service.
- **Controls**:
  - Every external network call is wrapped in `executeWithTimeout(promise, timeoutMs)`.
  - If Hindsight fails, the `IntelligenceService` catches the error, logs structured diagnostic telemetry, and falls back cleanly to synthesizing insights from verified in-memory deal repository records.
  - Test suite: [domain.test.ts](file:///c:/Users/techt/dealmemory/tests/unit/domain.test.ts).
