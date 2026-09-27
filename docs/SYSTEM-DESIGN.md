# System Design & Architecture Diagrams

This document illustrates the end-to-end data flow and architectural components of DealMemory.

## 1. High-Level Architecture

```mermaid
graph TD
    UI[Next.js 16 Editorial UI] -->|REST API| API[Next.js Route Handlers]
    API --> Service[Deal Intelligence Service]
    Service --> Repo[Deal Repository]
    Service --> Provider[Hindsight Memory Provider]
    Provider -->|SDK Calls| Hindsight[Hindsight Memory Engine]
    Repo --> Fixtures[(Domain Fixtures)]
```

## 2. Ingestion & Outcome Learning Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Rep as Sales Representative
    participant UI as Next.js Frontend
    participant API as /api/outcomes
    participant Service as Deal Intelligence Service
    participant HS as Hindsight Memory Bank

    Rep->>UI: Submit Interaction Outcome (e.g. Migration Roadmap -> PROGRESSED)
    UI->>API: POST /api/outcomes
    API->>Service: retainOutcome(dealId, interactionId, outcome)
    Service->>HS: retain(documentId="deal:acme-001:interaction:004:outcome", tags=["outcome:progressed"])
    HS-->>Service: Confirmation (Indexed)
    Service->>HS: reflect("Synthesize updated deal progression strategy")
    HS-->>Service: Updated Mental Model
    Service-->>API: Success Response
    API-->>UI: Render Updated Deal Progression State
```

## 3. Preparation Generation with Evidence Linking

```mermaid
sequenceDiagram
    autonumber
    actor Rep as Sales Representative
    participant UI as Next.js Frontend (/prepare)
    participant API as /api/deals/[dealId]/prepare
    participant Service as Intelligence Service
    participant HS as Hindsight Memory Bank

    Rep->>UI: Click "Prepare Next Interaction" (Memory: ON)
    UI->>API: POST /api/deals/[dealId]/prepare { memoryMode: "on" }
    API->>Service: generateBrief(dealId, memoryMode="on")
    Service->>HS: recall("What actions succeeded vs stalled for this account?")
    HS-->>Service: Recalled Docs (interaction:002 stalled, interaction:004 progressed)
    Service->>Service: Detect Conflicts ($100k vs $85k budget)
    Service->>HS: reflect("Recommend next call strategy based on recalled docs")
    HS-->>Service: Reflection Output
    Service-->>API: Structured DealPreparationBrief
    API-->>UI: Render Brief with Document ID Citations & Conflict Warning
```
