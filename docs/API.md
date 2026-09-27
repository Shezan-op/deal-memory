# API Route Documentation

All API endpoints are hosted under Next.js App Router route handlers.

## 1. Deal Management Endpoints

### `GET /api/deals`
Returns all deals in the organization with summaries, stages, and open blockers.

### `GET /api/deals/[dealId]`
Returns full metadata for a specific deal including company information and stakeholder directory.

### `GET /api/deals/[dealId]/timeline`
Returns chronological interaction history, action logs, and outcome statuses.

### `GET /api/deals/[dealId]/memory`
Returns all memories retained in Hindsight for this deal, grouped by World Facts, Experiences, and Observations.

## 2. Deal Intelligence Endpoints

### `POST /api/deals/[dealId]/prepare`
Generates a structured meeting preparation brief.
- **Request Body**:
  ```json
  {
    "memoryMode": "on" // or "off"
  }
  ```
- **Response**: `DealPreparationBrief` containing recommended approach, what worked, what stalled, conflicts, and supporting evidence citations.

## 3. Ingestion & Outcomes

### `POST /api/interactions`
Logs a new sales conversation and retains it into Hindsight.

### `POST /api/outcomes`
Records an outcome for an existing interaction (e.g. `PROGRESSED`, `STALLED`), updating Hindsight with an `:outcome` document.

### `POST /api/demo/reset`
Restores the demo dataset to initial factory state.
