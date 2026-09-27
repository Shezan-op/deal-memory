# Changelog

All notable changes to **DealMemory** are documented in this file.

## [0.1.0] - 2026-09-28
### Added
- Initial release of DealMemory: outcome-learning deal intelligence system powered by Hindsight.
- Domain models and Zod schemas with deterministic document IDs (`deal:{id}:interaction:{id}`).
- Full `MemoryProvider` implementation using `@vectorize-io/hindsight-client` v0.10.1.
- In-memory domain repository and synthetic dataset with 3 companies, 7 stakeholders, and 12 realistic B2B interactions.
- Next.js 16 + React 19 editorial UI:
  - Deal Inbox (`/deals`)
  - Deal Overview (`/deals/[dealId]`)
  - Chronological Timeline (`/deals/[dealId]/timeline`)
  - Preparation Brief with Memory ON/OFF contrast (`/deals/[dealId]/prepare`)
  - Memory Explorer (`/deals/[dealId]/memory`)
  - Global Learning Loop visualizer (`/learning-loop`)
  - Step-by-step Interactive Judge Demo (`/demo`)
- Conflict detection engine identifying contradictory stakeholder budget numbers.
- Automated seed script (`scripts/seed-demo.ts`) and Vitest test suite (`tests/unit/domain.test.ts`).
- Content submission workspace (`content/`) with articles, social posts, video scripts, and automated validator (`scripts/check-content.ts`).
- Full system documentation, architecture diagrams, and 8 Architecture Decision Records (`docs/adr/`).
