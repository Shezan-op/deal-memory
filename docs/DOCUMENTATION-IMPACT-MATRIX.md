# Documentation Impact Matrix

## Overview
This matrix enforces continuous synchronization between code changes and system documentation to eliminate documentation drift.

| Code Modification Area | Trigger Condition | Documentation Files Requiring Update | Security & Compliance Impact | Required Verification Command |
| :--- | :--- | :--- | :--- | :--- |
| **API Route Handlers** (`src/app/api/*`) | Added, modified, or deleted route; altered query/body schema. | `docs/API.md`<br>`docs/security/INITIAL-AUDIT.md`<br>`docs/security/ASVS-CONTROL-MATRIX.md` | OWASP A01 / A03: Access Control & IDOR | `npm run test && npm run docs:check` |
| **Hindsight Memory Adapter** (`src/lib/hindsight/*`) | Retain/Recall/Reflect options, timeout, bank mapping. | `docs/HINDSIGHT-DESIGN.md`<br>`docs/security/AI-SECURITY.md`<br>`docs/security/SECURITY-BASELINE.md` | ASI01 / ASI06: Memory & Prompt Injection | `npx vitest run tests/security/tenant-isolation.test.ts` |
| **Domain Intelligence** (`src/lib/domain/*`) | Synthesis logic, conflict detection, brief structures. | `docs/ARCHITECTURE.md`<br>`docs/security/anti-cheat.test.ts` | Functional Integrity & Transparency | `npx vitest run tests/security/anti-cheat.test.ts` |
| **Validation Schemas** (`src/lib/validation/schemas.ts`) | Modified field constraints, length limits, regexes. | `docs/security/SECURITY-BASELINE.md`<br>`docs/security/INITIAL-AUDIT.md` | ASVS V5: Input Validation Bounds | `npx vitest run tests/security/input-validation.test.ts` |
| **Environment Configuration** (`.env.example`) | Added, renamed, or modified environment variable. | `.env.example`<br>`docs/RUNBOOK.md`<br>`docs/security/SECRET-ROTATION.md` | OWASP A02: Security Misconfiguration | `npm run security:baseline` |
| **Dependencies** (`package.json`) | Upgraded, added, or removed third-party package. | `docs/security/SBOM.md`<br>`docs/security/DEPENDENCY-POLICY.md` | OWASP A03 / ASI04: Supply Chain | `npm audit` |
