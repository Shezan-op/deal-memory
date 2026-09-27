# Security Change Record Template

## Change Overview
- **Change ID**: `SEC-CHG-YYYYMMDD-XX`
- **Date**: `YYYY-MM-DD`
- **Author**: `Name / Role`
- **Component(s) Affected**: `e.g. src/app/api/deals/[dealId]/prepare/route.ts`

---

## 1. Motivation & Threat Addressed
- **Threat Scenario**: Describe the attack path or vulnerability.
- **OWASP / ASVS Mapping**: `e.g. OWASP A01: Broken Access Control`
- **Severity**: `CRITICAL | HIGH | MEDIUM | LOW | INFO`

---

## 2. Technical Remediation
- **Code Changes**: Summary of lines and files modified.
- **Defensive Mechanism**: `e.g. Server-authoritative validation, delimiter escaping, rate limiting.`

---

## 3. Verification & Evidence
- **Automated Regression Test**: `e.g. tests/security/tenant-isolation.test.ts`
- **Test Results**: Command output proving pass status.

---

## 4. Documentation Synchronized
- [ ] Updated `docs/security/SECURITY-CHANGELOG.md`
- [ ] Updated `docs/security/SECURITY-BASELINE.md` (if limits or headers changed)
- [ ] Updated `docs/API.md` (if endpoint contracts changed)
- [ ] Checked `npm run docs:check`
