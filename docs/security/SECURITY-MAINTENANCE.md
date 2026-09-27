# DealMemory Security Maintenance & Cadence Guide

## 1. Automated Security Verification Cadence

| Frequency | Routine Task | Command / Action | Owner |
| :--- | :--- | :--- | :--- |
| **Every PR / Commit** | Static Analysis & Security Regressions | `npm run test && npm run typecheck` | Automated CI |
| **Weekly** | Dependency Vulnerability Scan | `npm audit` | Lead Engineer |
| **Monthly** | Documentation Drift Check | `npm run docs:check` | Documentation Architect |
| **Quarterly** | Secret Rotation & Hindsight Token Audit | Follow [SECRET-ROTATION.md](file:///c:/Users/techt/dealmemory/docs/security/SECRET-ROTATION.md) | Security Lead |
| **Bi-Annually** | Threat Model Review & ASVS Baseline Update | Update [THREAT-MODEL.md](file:///c:/Users/techt/dealmemory/docs/security/THREAT-MODEL.md) | Security Architect |

---

## 2. Maintenance Log

| Date | Maintenance Event | Outcome | Verified By |
| :--- | :--- | :--- | :--- |
| 2026-09-28 | Initial Zero-Trust Security Audit & Hardening | Remediated SEC-001 through SEC-008; 47 security regression tests created and passing. | Antigravity AI Security Engineer |
