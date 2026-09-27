# Hindsight Integration Deep Dive

This document details how DealMemory integrates with the official [Hindsight Memory Engine](https://github.com/vectorize-io/hindsight) via `@vectorize-io/hindsight-client`.

## 1. Bank Initialization & Missions

Each tenant organization maps to an isolated memory bank. Banks are initialized with customized missions and reasoning dispositions:

```typescript
// Bank configuration applied during setup
await client.updateBankConfig(bankId, {
  retainMission: `Extract durable deal knowledge from sales interactions. Prioritize stakeholder roles, pain points, business requirements, objections, competitor mentions, pricing constraints, technical requirements, commitments, decisions, actions attempted, and outcomes. Preserve temporal context. Ignore greetings, filler, and generic conversational text.`,
  observationsMission: `Identify recurring patterns across sales interactions. Note which actions consistently resolve objections versus those that stall deals. Track shifts in budget or authority.`,
  reflectMission: `You are a revenue intelligence analyst assisting a sales representative. Ground all recommendations in retained deal evidence. Distinguish known facts from inference. Prefer current-deal evidence. Never invent pricing, competitor information, or commitments.`,
  dispositionSkepticism: 0.8, // Evidence-first skepticism over agreeable cheerleading
});
```

## 2. Deterministic Document IDs

To ensure idempotency across updates and re-indexing, document IDs strictly follow a deterministic pattern:
- Interaction: `deal:{dealId}:interaction:{interactionId}`
- Outcome: `deal:{dealId}:interaction:{interactionId}:outcome`

This prevents duplicate vector pollution and allows direct citation in preparation briefs.

## 3. Retain Lifecycle

Interactions are ingested with scoped metadata and contextual descriptions:
```typescript
const res = await client.retain(bankId, interaction.content, {
  documentId: "deal:acme-001:interaction:002",
  timestamp: "2026-10-24T14:30:00Z",
  context: "Discovery follow-up with VP Eng Marcus Vance on implementation concerns.",
  metadata: {
    dealId: "deal_acme_001",
    stage: "Discovery",
    objection: "implementation",
    action: "discount_offered",
  }
});
```

## 4. Recall vs. Reflect

- **Recall**: Factual lookup of historical data. Answers: *"What did the CFO say about pricing?"*
- **Reflect**: Synthesized reasoning over recalled memories. Answers: *"How should I approach the next call given that previous discounts stalled?"*
