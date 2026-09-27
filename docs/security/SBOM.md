# DealMemory Software Bill of Materials (SBOM)

## Metadata
- **Application**: DealMemory
- **Version**: 0.1.0
- **Ecosystem**: Node.js / npm
- **Format**: CycloneDX-aligned Component Inventory
- **Generated**: 2026-09-28
- **Integrity**: Enforced via `package-lock.json`

---

## 1. Runtime Production Dependencies

| Component Name | Version | Scope | Supplier / Origin | License | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`next`** | `16.3.6` | Runtime | Vercel Inc. | MIT | React server framework, API route handlers, and SSR engine. |
| **`react`** | `19.2.8` | Runtime | Meta Platforms | MIT | Declarative component and UI rendering core. |
| **`react-dom`** | `19.2.8` | Runtime | Meta Platforms | MIT | DOM rendering integration for React 19. |
| **`@vectorize-io/hindsight-client`** | `^0.10.1` | Runtime | Vectorize.io | Apache-2.0 | Official client SDK for Hindsight Retain, Recall, and Reflect operations. |
| **`zod`** | `^3.25.76` | Runtime | Colin McDonnell | MIT | Zero-dependency TypeScript-first runtime schema validation and sanitization. |
| **`@rolldown/binding-win32-x64-msvc`** | `^1.2.11` | Optional/Binary | Rolldown Project | MIT | High-performance bundling acceleration binary. |

---

## 2. Development & Testing Dependencies

| Component Name | Version | Scope | License | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`vitest`** | `^5.0.2` | Development / Test | MIT | High-performance unit and security regression test runner. |
| **`tsx`** | `^4.23.15` | Development / Build | MIT | TypeScript execution runner for verification scripts and seeders. |
| **`typescript`** | `^5` | Development / Build | Apache-2.0 | Static type analysis and compilation enforcement. |
| **`tailwindcss`** | `^4` | Development / Build | MIT | Atomic utility-first CSS styling engine. |
| **`@tailwindcss/postcss`** | `^4` | Development / Build | MIT | PostCSS integration plugin for Tailwind CSS 4. |
| **`eslint`** | `^9` | Development / Lint | MIT | ECMAScript/TypeScript code quality linter. |
| **`eslint-config-next`** | `16.3.6` | Development / Lint | MIT | Next.js-specific linting rules and best practice enforcement. |
| **`@types/node`** | `^22.20.4` | Development / Types | MIT | Node.js standard library type definitions. |
| **`@types/react`** | `^19` | Development / Types | MIT | React 19 component type definitions. |
| **`@types/react-dom`** | `^19` | Development / Types | MIT | React DOM type definitions. |

---

## 3. SBOM Verification & Generation Command

```bash
# Verify integrity of all installed packages against lockfile
npm audit --audit-level=high

# Generate full CycloneDX JSON format SBOM (if cyclonedx-npm installed)
npx @cyclonedx/cyclonedx-npm --output-file docs/security/sbom.cdx.json
```
