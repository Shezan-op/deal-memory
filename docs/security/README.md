# DealMemory Security Architecture & Documentation Index

## Overview

This directory contains the security specification, threat model, compliance matrices, test plans, and operational runbooks for **DealMemory**, an outcome-learning B2B revenue intelligence platform powered by Hindsight.

DealMemory operates under a **Zero-Trust Security Model** across all layers:
1. **Network & Transport**: Modern HTTP security headers (CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff).
2. **Identity & Multi-Tenancy**: Server-authoritative tenant context resolution (`x-tenant-id`), deterministic memory bank mapping (`deal-memory-alpha`, `deal-memory-nexa`), and strict rejection of client-supplied `bankId` parameters.
3. **Memory & AI Safety**: Strict boundary separation between passive conversational data (`<sales_transcript_data>`), system instructions, and dynamic reflection. XML delimiter sanitization, bounded prompt lengths, and protection against indirect prompt injection.
4. **Availability & Resource Protection**: Sliding-window in-memory token bucket rate limiting on expensive AI endpoints (`prepare`, `reflect`, `recall`, `interactions`, `outcomes`).
5. **Data & State Integrity**: Idempotent interaction ingestion, atomic outcome updates, and graceful fallback when upstream memory providers are temporarily degraded.

---

## Security Documentation Index

| Document | Purpose & Scope |
| :--- | :--- |
| [SECURITY-STANDARDS.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-STANDARDS.md) | Official standards baseline: OWASP ASVS v5.0.0, OWASP Top 10:2025, OWASP GenAI Top 10:2026, OWASP Agentic Top 10:2026. |
| [INITIAL-AUDIT.md](file:///c:/Users/techt/dealmemory/docs/security/INITIAL-AUDIT.md) | Initial reconnaissance, vulnerable components identified, and attack path catalog. |
| [THREAT-MODEL.md](file:///c:/Users/techt/dealmemory/docs/security/THREAT-MODEL.md) | Comprehensive STRIDE threat model across assets, actors, trust boundaries, and data flows. |
| [ASVS-CONTROL-MATRIX.md](file:///c:/Users/techt/dealmemory/docs/security/ASVS-CONTROL-MATRIX.md) | Detailed verification matrix mapping Level 1 & Level 2 ASVS requirements to tests and code. |
| [AI-SECURITY.md](file:///c:/Users/techt/dealmemory/docs/security/AI-SECURITY.md) | Deep analysis of OWASP GenAI/LLM risks (prompt injection, memory poisoning, model hallucination). |
| [AGENTIC-SECURITY.md](file:///c:/Users/techt/dealmemory/docs/security/AGENTIC-SECURITY.md) | Evaluation against OWASP Top 10 for Agentic Applications (ASI:2026), goal hijacking, and least agency. |
| [SECURITY-BASELINE.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-BASELINE.md) | Explicit security baselines: headers, timeouts, rate limits, CORS, CSP, input boundaries. |
| [DATA-FLOW.md](file:///c:/Users/techt/dealmemory/docs/security/DATA-FLOW.md) | Map of all data flows between browser, application server, Hindsight memory bank, and LLMs. |
| [DATA-RETENTION.md](file:///c:/Users/techt/dealmemory/docs/security/DATA-RETENTION.md) | Storage policies, lifecycles, and deletion semantics for interactions, outcomes, and mental models. |
| [LOGGING-REDACTION.md](file:///c:/Users/techt/dealmemory/docs/security/LOGGING-REDACTION.md) | Redaction specifications for PII, API tokens, session credentials, and raw memory dumps. |
| [DEPENDENCY-POLICY.md](file:///c:/Users/techt/dealmemory/docs/security/DEPENDENCY-POLICY.md) | Supply-chain security, automated auditing (`npm audit`), and package curation guidelines. |
| [INCIDENT-RESPONSE.md](file:///c:/Users/techt/dealmemory/docs/security/INCIDENT-RESPONSE.md) | 6-stage operational incident response playbook covering key leaks, memory poisoning, and tenant leaks. |
| [SECRET-ROTATION.md](file:///c:/Users/techt/dealmemory/docs/security/SECRET-ROTATION.md) | Step-by-step procedures for rotating Hindsight API keys, admin tokens, and deployment credentials. |
| [SBOM.md](file:///c:/Users/techt/dealmemory/docs/security/SBOM.md) | Software Bill of Materials tracking runtime and development dependencies. |
| [DEMO-SECURITY-CHECKLIST.md](file:///c:/Users/techt/dealmemory/docs/security/DEMO-SECURITY-CHECKLIST.md) | Pre-recording and demo presentation safety guidelines to prevent credential or PII leakage. |
| [SECURITY-TEST-PLAN.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-TEST-PLAN.md) | Test methodology, adversarial test cases, fuzzing, and regression test strategy. |
| [SECURITY-TEST-REPORT.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-TEST-REPORT.md) | Formal audit results, executed test suites, and verified controls. |
| [SECURITY-CHANGELOG.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-CHANGELOG.md) | Chronological record of security vulnerabilities remediated in DealMemory. |
| [SECURITY-EXCEPTIONS.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-EXCEPTIONS.md) | Register of accepted residual risks and architectural boundary constraints. |
| [SECURITY-MAINTENANCE.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-MAINTENANCE.md) | Ongoing security verification routines, weekly audits, and dependency refresh schedules. |
| [GITHUB-SECURITY-SETUP.md](file:///c:/Users/techt/dealmemory/docs/security/GITHUB-SECURITY-SETUP.md) | Branch protection rules, secret scanning, and automated CI security gates. |
| [FINAL-AUDIT.md](file:///c:/Users/techt/dealmemory/docs/security/FINAL-AUDIT.md) | Complete audit scoreboard with exact PASS/PARTIAL/FAIL/UNVERIFIED counts. |

---

## Verification Commands

Run automated security validation directly from the command line:

```bash
# Quick security sanity check (headers, env guards, access control)
npm run security:smoke

# Full security regression test suite (45+ security tests)
npm run security:audit

# Automated baseline verification (CSP, HSTS, rate limiter, schema validation)
npm run security:baseline

# Verify documentation links and consistency
npm run docs:check
```
