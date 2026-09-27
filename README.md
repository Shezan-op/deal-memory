# DEALMEMORY

> “Every sales conversation becomes experience the next conversation can learn from.”

DealMemory is an outcome-learning deal intelligence system powered by [Hindsight](https://github.com/vectorize-io/hindsight). Instead of treating sales calls as isolated summarization exercises, DealMemory turns every interaction, action attempted, and observed outcome into durable organizational memory that actively shapes future deal preparation.

---

## The Problem: Stateless Sales AI

Traditional sales AI tools operate on a primitive model:
```
Call Transcript → LLM Summary → CRM Note
```
When an account executive prepares for the next call, a standard RAG chatbot retrieves unstructured notes and outputs generic advice: *"Highlight ROI and offer a 15% discount if they express hesitation."*

If offering that discount in call #2 caused the prospect to disengage because their real issue was engineering migration capacity, a stateless LLM will still recommend that exact same discount in call #5. It has zero concept of outcomes.

---

## The DealMemory Architecture

DealMemory closes the feedback loop:
```
Sales Conversation
       ↓
Memory Retained (Deterministic Doc ID)
       ↓
Action Taken (e.g., 30-Day Migration Roadmap)
       ↓
Outcome Observed (PROGRESSED / STALLED / LOST)
       ↓
Retain Outcome (Linked directly to interaction)
       ↓
Consolidation & Reflect (Observed Patterns Formed)
       ↓
Better Future Action
```

When an account executive prepares for a meeting, DealMemory doesn't guess—it presents an **evidence-backed preparation brief** citing verified historical interactions.

---

## Memory ON vs. Memory OFF

On our flagship demo account (**Acme Corp**, $120k ARR, Technical Validation stage):

| State | Agent Recommendation | Why / Evidence |
| :--- | :--- | :--- |
| **Memory OFF** *(Stateless)* | "Highlight product features and offer a 15-20% discount if the client pushes back on implementation." | ❌ **Fatal Flaw:** Zero memory that Acme already rejected discounts on Oct 24, which stalled the deal. |
| **Memory ON** *(Hindsight)* | "Do NOT lead with discounts. On Oct 24, a 15% discount caused the account to stall. Progress unlocked on Nov 02 when we provided an engineer-led migration roadmap. Lead with technical milestones and attach the SOC2 bridge letter." | ✅ **Evidence-Linked:** Cites doc `deal:acme-001:interaction:002` (stalled) and `004` (progressed). |

---

## Core Features

1. **Outcome-Linked Intelligence**: Tracks not just what was said, but what was tried, why it was tried, and what happened after.
2. **Deterministic Document IDs**: Uses immutable paths (`deal:{dealId}:interaction:{interactionId}` and `:outcome`) to ensure idempotent Hindsight ingestion.
3. **Contradiction Detection**: Flags conflicting statements across calls (e.g., CTO stated $100k budget vs. CFO cited $85k cap) so reps can validate discrepancies before quoting terms.
4. **Interactive Judge Demo (`/demo`)**: A 60-second guided flow demonstrating Problem → Memory OFF → Memory ON → Live Ingestion → Updated Learning.
5. **Auditable Evidence Layer**: Every recommendation exposes supporting evidence, learned patterns, limitations, and counter-evidence.

---

## Quickstart

### Prerequisites
- Node.js 20+
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/Shezan-op/deal-memory.git
cd deal-memory
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Hindsight endpoint:
```env
HINDSIGHT_BASE_URL="http://localhost:8888"
HINDSIGHT_API_KEY=""
HINDSIGHT_BANK_ID="deal-memory-demo"
```

### 3. Seed the Dataset
Populate 3 companies, 7 stakeholders, and 12 rich B2B interactions into Hindsight:
```bash
npm run seed
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the Deal Inbox, or visit [http://localhost:3000/demo](http://localhost:3000/demo) for the interactive guided walkthrough.

---

## Commands

```bash
npm run test           # Run Vitest unit tests
npm run typecheck      # Validate TypeScript types
npm run seed           # Ingest fixture data into Hindsight
npm run content:check  # Validate submission articles, word counts, and links
npm run audit          # Run complete end-to-end repository audit
```

---

## Documentation Index

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [System Design & Sequence Diagrams](./docs/SYSTEM-DESIGN.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Hindsight Integration Deep Dive](./docs/HINDSIGHT-DESIGN.md)
- [Memory Taxonomy & Document ID Specification](./docs/MEMORY-TAXONOMY.md)
- [Synthetic Dataset Specification](./docs/DATASET-DESIGN.md)
- [API Route Documentation](./docs/API.md)
- [Security & Prompt Injection Defenses](./docs/SECURITY.md)
- [Threat Model](./docs/THREAT-MODEL.md)
- [Memory Evaluation Scenarios](./docs/MEMORY-EVALUATION.md)
- [Demo Presentation Script (60–120s)](./docs/DEMO-SCRIPT.md)
- [Runbook & Deployment Guide](./docs/RUNBOOK.md)
- [Content Submission Workspace & Guide](./docs/CONTENT-SUBMISSION.md)
- [Architecture Decision Records (ADRs)](./docs/adr/)

---

## License

Apache-2.0 © 2026 DealMemory Contributors.
