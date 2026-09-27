# Threat Model

| Threat | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Transcript Prompt Injection** | Attacker injects instructions inside customer notes attempting to override system behavior. | Transcripts treated purely as data payloads; missions strictly separated; Zod output validation. |
| **Cross-Tenant Data Leakage** | Organization A accesses memory of Organization B. | Physical bank-level isolation in Hindsight; no shared memory banks across tenants. |
| **Credential / Token Exposure** | API keys exposed to browser client or third-party loggers. | Server-only execution; structured logger strips all tokens and secrets automatically. |
| **Duplicate Document Poisoning** | Rep submits identical meeting notes multiple times, skewing pattern weights. | Deterministic document IDs (`deal:{id}:interaction:{id}`) ensure idempotent upserts. |
| **Hallucinated Agreement / Terms** | Agent generates non-existent pricing or promises. | Evidence-first skepticism disposition; agent required to cite exact document IDs. |
| **Silent Contradiction Blindness** | Two stakeholders quote conflicting budgets; agent blindly averages them. | Automated conflict detection checks field variations and surfaces warnings directly in the UI. |
