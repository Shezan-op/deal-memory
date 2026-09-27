# DealMemory Security Maintenance Policy & Runbook

**Document Version**: 1.0.0  
**Audit Context**: Continuous Security Assurance & Lifecycle Maintenance  
**Target Audience**: Security Engineers, Platform Maintainers, and Code Reviewers  

---

## 1. Permanent Maintenance Rules

Every modification to the DEALMEMORY codebase must adhere to the **Change-Assurance Cycle**:

```
Code Change
  ├── 1. Security Review (Verify threat model impact)
  ├── 2. Automated Tests (Unit, Integration, Chaos, Mutation)
  ├── 3. Documentation Review (Update relevant docs in docs/)
  ├── 4. Hindsight Audit (Verify memory bank & prompt integrity)
  ├── 5. Dependency & Secret Scan (Run security:deps & security:secrets)
  └── 6. Release Verification (Run final:audit)
```

---

## 2. Security Verification Commands

Run these automated verification commands locally or in CI/CD pipelines before any pull request is merged:

```bash
# 1. Fast smoke test (Rate limits & access control)
npm run security:smoke

# 2. Forensic secret scan (Checks codebase & Git history)
npm run security:secrets

# 3. High-severity dependency vulnerability scan
npm run security:deps

# 4. Full security regression test suite (All 10 security suites)
npm run security:audit

# 5. Baseline security check (Headers, bounds, rate limits)
npm run security:baseline

# 6. Documentation consistency check
npm run docs:check

# 7. Content rule and hackathon boundary check
npm run content:check

# 8. Clean typecheck and build verification
npm run typecheck
npm run build

# 9. Master Release Assurance Gate
npm run final:audit
```

---

## 3. How to Update External Integrations

### Updating the Hindsight SDK / Provider
1. Check compatibility with `@vectorize-io/hindsight-client`:
   ```bash
   npm outdated @vectorize-io/hindsight-client
   ```
2. Update the package in `package.json` and reinstall cleanly:
   ```bash
   npm install @vectorize-io/hindsight-client@latest
   ```
3. Run Hindsight memory contract tests:
   ```bash
   npm run test tests/security/chaos.test.ts
   npm run test tests/security/anti-cheat.test.ts
   ```
4. Verify server-authoritative bank resolution in [tenant.ts](file:///c:/Users/techt/dealmemory/src/lib/security/tenant.ts) and [hindsight-memory-provider.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/hindsight-memory-provider.ts).
5. Update `docs/security/HINDSIGHT-SECURITY.md` with any new SDK configuration options.

### Updating AI Models & Mission Prompts
1. All prompts are centralized in [prompts.ts](file:///c:/Users/techt/dealmemory/src/lib/hindsight/prompts.ts).
2. When modifying a prompt:
   - Ensure `escapeXmlDelimiters()` is preserved for all user-provided context.
   - Maintain the directive: *"Ground all recommendations in verified historical evidence. Do not fabricate consensus if evidence is conflicting or missing."*
3. Run prompt injection and anti-cheat regression tests:
   ```bash
   npm run test tests/security/prompt-injection.test.ts
   npm run test tests/security/anti-cheat.test.ts
   ```

### Updating npm Dependencies
1. Review changelogs for breaking changes.
2. Run audit check:
   ```bash
   npm audit
   ```
3. Update packages and verify lockfile consistency:
   ```bash
   npm update
   git diff package-lock.json
   ```
4. Update `docs/security/SBOM.md` to reflect new version numbers.

---

## 4. Documentation Drift Prevention

- **Single Source of Truth**:
  - Hindsight behavior: `docs/security/HINDSIGHT-SECURITY.md`
  - API schemas: `docs/API.md` and `src/lib/validation/schemas.ts`
  - Threat Model: `docs/security/THREAT-MODEL.md`
  - Control Matrix: `docs/security/ASVS-CONTROL-MATRIX.md`
- **Documentation Verification**:
  Whenever an API route, security header, or environment variable is modified, update the documentation and run:
  ```bash
  npm run docs:check
  ```
