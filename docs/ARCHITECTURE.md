# Architecture Overview

This document describes the architectural layers and component responsibilities in DealMemory.

## 1. Architectural Layers

```
UI Layer (Next.js React 19 Client Components)
    ↓
API Layer (Next.js Route Handlers)
    ↓
Domain Service Layer (IntelligenceService, DealRepository)
    ↓
Memory Layer (HindsightMemoryProvider Adapter)
    ↓
Infrastructure (Hindsight Memory Engine API)
```

## 2. Component Responsibilities

### UI Layer (`src/app/`, `src/components/`)
- Renders responsive, accessible, editorial UI inspired by `/minimalist-ui`.
- Handles user interactions, memory toggle states (ON/OFF), and guided demo steps.
- **Rule**: Never invokes Hindsight APIs directly from the browser; all communication flows through server-side route handlers.

### API Layer (`src/app/api/`)
- Validates request payloads using Zod schemas (`src/lib/validation/schemas.ts`).
- Orchestrates domain services and error handling.
- Sanitizes outputs and masks any sensitive keys or tokens.

### Domain Service Layer (`src/lib/domain/`)
- Contains business logic for deal lifecycle management and intelligence synthesis.
- Reconciles contradictory information (e.g., budget differences across stakeholders).
- Correlates historical evidence with current deal state to assemble the `DealPreparationBrief`.

### Memory Adapter Layer (`src/lib/hindsight/`)
- Implements `MemoryProvider` interface using `@vectorize-io/hindsight-client`.
- Manages deterministic document IDs, mission templates, bank configuration, retention, recall, and reflection.
