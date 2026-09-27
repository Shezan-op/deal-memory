# DealMemory Security Incident Response Playbook

## Overview
This runbook defines the incident response procedures for DealMemory, aligned with NIST SP 800-61 Rev. 2 and OWASP incident response best practices.

---

## 1. Incident Severity Classification

| Severity Level | Definition | Examples | Response Target |
| :--- | :--- | :--- | :--- |
| **P1 - CRITICAL** | Active compromise of tenant boundary, leaked production keys, or remote code execution. | Cross-tenant memory exfiltration, leaked `HINDSIGHT_API_KEY` on public internet, unauthenticated production database reset. | Immediate triage (< 30 min) |
| **P2 - HIGH** | Exploitable vulnerability in authenticated endpoint, rate limit bypass causing token exhaustion, or prompt injection altering recommendations. | Adversarial prompt jailbreak altering sales guidance, broken authorization on deal endpoints. | Within 4 hours |
| **P3 - MEDIUM** | Security misconfiguration, non-sensitive information disclosure, or failing security test. | Rate limiter memory leak, public health endpoint leaking runtime stack details. | Within 24 hours |
| **P4 - LOW** | Minor documentation drift, non-critical dependency warning, or cosmetic issue. | Outdated dependency patch release without known exploit. | Next release sprint |

---

## 2. Six-Phase Response Workflow

1. **Identification**: Detection via alerts, automated test failures, bug reports, or log anomalies.
2. **Containment**: Immediate mitigation to prevent further damage (e.g. disabling vulnerable route, revoking compromised key, enabling circuit breaker).
3. **Eradication**: Root-cause analysis, code patching, malicious data purging from Hindsight banks.
4. **Recovery**: Deploying verified fix, restoring healthy service state, validating monitoring metrics.
5. **Post-Incident Review**: Blameless post-mortem, timeline reconstruction, preventative action items.
6. **Documentation**: Updating [SECURITY-CHANGELOG.md](file:///c:/Users/techt/dealmemory/docs/security/SECURITY-CHANGELOG.md) and incident records.

---

## 3. Scenario-Specific Playbooks

### Playbook A: Compromised or Leaked Hindsight API Key
1. **Immediate Revocation**: Access the Vectorize / Hindsight administrative console and revoke the active API key immediately.
2. **Key Regeneration**: Generate a new production API key.
3. **Secret Deployment**: Update the hosting provider environment variables (`HINDSIGHT_API_KEY`) and trigger zero-downtime redeployment.
4. **Audit Bank Activity**: Inspect Hindsight bank audit logs for unauthorized recall queries or retention events during the exposure window.

### Playbook B: Cross-Tenant Memory Leak Report
1. **Quarantine Tenant Access**: Temporarily restrict access to the affected tenant bank by updating `tenant.ts` or applying an IP block.
2. **Identify Root Cause**: Determine if leak occurred due to missing tag scoping, client-supplied bank parameter injection, or prompt reflection leakage.
3. **Verify Regression Suite**: Run `npx vitest run tests/security/tenant-isolation.test.ts`.
4. **Deploy Fix & Notify**: Patch server-side query scoping, redeploy, and issue customer disclosure notification if required by SLA/GDPR.

### Playbook C: Stored Memory Poisoning / Prompt Injection
1. **Locate Malicious Document**: Query the affected bank for the document ID associated with the malicious transcript (`deal:{dealId}:interaction:{interactionId}`).
2. **Tombstone Document**: Issue deletion request to Hindsight client to purge the poisoned document.
3. **Re-Consolidate Observations**: Trigger `refreshMentalModel()` to re-synthesize mental models and purge distorted observations.
4. **Enhance Validation**: Update `schemas.ts` or `prompts.ts` with additional defensive sanitization rules.
