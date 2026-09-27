## Pull Request Security & Quality Checklist

### Description of Change
<!-- Provide a concise summary of the change and rationale -->

---

### Security Verification Checklist
Please verify the following before submitting:

- [ ] **Authentication & Authorization**:
  - [ ] No server-side authorization decisions rely on client-supplied parameters (`userId`, `role`, `bankId`, `companyId`).
  - [ ] Deal ownership and tenant boundaries are strictly verified.
- [ ] **Input Validation & Sanitization**:
  - [ ] All incoming request bodies and query parameters are validated via Zod schemas.
  - [ ] Maximum length bounds are enforced.
  - [ ] Text inputs are sanitized against null bytes and control characters.
- [ ] **Memory & AI Safety**:
  - [ ] Untrusted customer dialogue is safely delimited with XML entity escaping (`escapeXmlDelimiters`).
  - [ ] Retained memory is treated as untrusted historical data, never as system instructions.
- [ ] **Secrets & Data Leakage**:
  - [ ] No API keys, credentials, or session tokens are committed to git or exposed in client bundles.
  - [ ] Log output is scrubbed and redacted.
- [ ] **Automated Testing & Documentation**:
  - [ ] Regression test added for bug fixes / security changes in `tests/security/`.
  - [ ] All tests passing (`npm test`).
  - [ ] TypeScript check passing (`npm run typecheck`).
  - [ ] Documentation updated according to `docs/DOCUMENTATION-IMPACT-MATRIX.md`.
