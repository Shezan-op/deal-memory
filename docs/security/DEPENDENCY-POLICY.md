# DealMemory Software Supply Chain & Dependency Policy

## 1. Core Principles
1. **Minimal Dependency Surface**:
   DealMemory adheres strictly to a lean dependency footprint. Dependencies are only introduced when core functionality cannot be securely or reliably implemented using native Node.js/Next.js/React standard libraries.
2. **Deterministic Lockfile Integrity**:
   The `package-lock.json` file is committed to version control and enforced on all CI builds via `npm ci`. Modification of the lockfile requires review.
3. **Zero Vulnerability Threshold**:
   No high or critical vulnerabilities reported by `npm audit` or GitHub Dependabot are permitted in the main branch.

---

## 2. Approved Core Dependencies

| Package | Version | Purpose | Security Review Status |
| :--- | :--- | :--- | :--- |
| `next` | `15.5.3` | React full-stack framework | Core framework, verified release. |
| `react` / `react-dom` | `19.1.0` | Declarative UI rendering | Official React 19 stable branch. |
| `@vectorize-io/hindsight-client` | `^0.1.2` | Official Hindsight memory client | Official Vectorize SDK, scoped registry. |
| `zod` | `^3.24.2` | Runtime schema validation | Industry standard defensive parser. |
| `lucide-react` | `^1.16.0` | Accessible SVG icon primitives | Zero runtime dependencies, safe SVGs. |

---

## 3. Dependency Onboarding Checklist
Before introducing any new third-party package:
- [ ] Verify package origin, maintainer reputation, and GitHub commit activity.
- [ ] Confirm no malicious or obfuscated `postinstall` scripts exist in `package.json`.
- [ ] Run `npm audit` locally before committing changes.
- [ ] Confirm license compatibility (MIT, Apache 2.0, BSD).
- [ ] Update [SBOM.md](file:///c:/Users/techt/dealmemory/docs/security/SBOM.md) and changelog.

---

## 4. Supply Chain Audit Commands

```bash
# Audit installed packages for known vulnerabilities
npm audit

# Perform strict clean-room dependency install
npm ci
```
