# Hackathon Judging Criteria Alignment

This document details how DealMemory aligns with the official evaluation dimensions.

## 1. Innovation (30%)
- **Outcome-Linked Intelligence**: Traditional sales tools only transcribe and summarize. DealMemory connects actions directly to outcomes (PROGRESSED vs. STALLED), turning past failures into active warnings.
- **Conflict Detection Engine**: Instead of averaging numbers, DealMemory identifies and surfaces conflicting claims made by different stakeholders.

## 2. Hindsight Memory Utilization (25%)
- Uses official `@vectorize-io/hindsight-client` (v0.10.1).
- Employs deterministic document IDs (`deal:{id}:interaction:{id}`) to ensure idempotency.
- Configures custom bank missions and skeptical reasoning dispositions.
- Implements both `recall()` for factual lookups and `reflect()` for synthesized strategic reasoning.

## 3. Technical Implementation (20%)
- Modern stack: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4.
- Clean architectural separation: UI → API → Domain Service → Memory Adapter.
- Robust validation via Zod schemas and comprehensive test coverage with Vitest.
- Zero client-side credential leakage; structured logging with token sanitization.

## 4. User Experience (15%)
- Minimalist, editorial UI built strictly on high-contrast typography and clear information hierarchy.
- Replaces open-ended chatbot interfaces with structured, scannable preparation briefs.
- Interactive Judge Demo (`/demo`) delivers the complete narrative within 60–90 seconds.

## 5. Real-World Impact (10%)
- Directly addresses enterprise sales cycles where multi-month deals stall due to repeated mistakes across rotating account executives.
- Saves hours of manual CRM note archaeology while preventing costly tactical errors.
