# Deterministic Document IDs and Scoped Memory Taxonomy with Hindsight

Building an AI agent that maintains state across long enterprise sales cycles quickly exposes the limits of naive vector databases. When you allow an agent to append unstructured text chunks to an embedding store without an identity model, three things happen almost immediately: duplicate memories pile up, stale facts overwrite recent updates, and the agent hallucinates consensus where clear contradictions exist.

When developing DealMemory—an outcome-learning deal intelligence system—we treated memory taxonomy and document identity as first-order architectural concerns. This article explains how we designed deterministic document IDs and hierarchical tag spaces using [Hindsight](https://github.com/vectorize-io/hindsight).

## The Idempotency Crisis in Agent Memory

In a live enterprise CRM, sales notes are not static. Account executives edit call summaries, update meeting participant lists, and adjust deal stages retroactively.

If an agent ingests a call note, waits three days, and the user fixes a typo in that note, a naive ingestion pipeline appends a new vector embedding alongside the old one. Over weeks of negotiations across multiple team members, the vector store becomes filled with near-duplicate fragments. When the model attempts to retrieve the latest state, it finds multiple versions of the truth.

To prevent this, every memory retained in Hindsight must possess a deterministic, immutable document ID.

## Designing the Deterministic ID Schema

In DealMemory, we implemented strict ID normalization in `src/lib/validation/schemas.ts`:

```typescript
export function buildInteractionDocumentId(dealId: string, interactionId: string): string {
  const cleanDeal = dealId.replace(/^deal[:_]/i, "").toLowerCase();
  const cleanInt = interactionId.replace(/^int[:_]/i, "").toLowerCase();
  return `deal:${cleanDeal}:interaction:${cleanInt}`;
}

export function buildOutcomeDocumentId(dealId: string, interactionId: string): string {
  return `${buildInteractionDocumentId(dealId, interactionId)}:outcome`;
}
```

This pattern ensures that regardless of how many times an interaction is updated or re-ingested during testing and production, Hindsight upserts the exact same document rather than fragmenting the bank.

Furthermore, by appending `:outcome` to the interaction's document ID, outcomes maintain an explicit 1:1 parent-child relationship with the action that generated them.

## Memory Hierarchy: Facts, Experiences, and Observations

We categorize retained knowledge into four distinct tiers:

1. **World Facts**: Durable account context that rarely fluctuates (e.g., "Acme runs on AWS us-east-1 and requires Okta SSO").
2. **Experiences**: Discrete episodic occurrences (e.g., "On Oct 24, rep offered a 15% discount; prospect disengaged").
3. **Observations**: Patterns synthesized by Hindsight over multiple related experiences (e.g., "Pricing concessions consistently stall progression for technical stakeholders at Acme").
4. **Mental Models**: Consolidated strategy documents synthesizing active deal gates, stakeholder alignments, and open blockers.

## Scoped Tag Taxonomy

Tags in Hindsight serve as high-precision retrieval filters rather than mere keyword labels. We enforce lower-case, colon-delimited taxonomy:

```typescript
export function buildDealMemoryTags(
  dealId: string,
  companyId: string,
  stage: string,
  objection?: string,
  action?: string,
  outcome?: string
): string[] {
  const tags: string[] = [
    `deal:${dealId.toLowerCase()}`,
    `company:${companyId.toLowerCase()}`,
    `stage:${stage.toLowerCase()}`,
  ];
  if (objection) tags.push(`objection:${objection.toLowerCase().replace(/\s+/g, "-")}`);
  if (action) tags.push(`action:${action.toLowerCase().replace(/\s+/g, "-")}`);
  if (outcome) tags.push(`outcome:${outcome.toLowerCase()}`);
  return tags;
}
```

When an account executive queries: *"What objections were raised during technical validation?"*, the memory provider doesn't scan the entire company history. It scopes the recall request directly using `tags: ["deal:acme-001", "stage:technical-validation"]`.

## Handling Contradictory Data Across Time

One of the most dangerous behaviors in LLM agents is averaging numbers when stakeholders disagree. In our flagship test dataset for Acme Corp, the VP of Engineering stated a budget of $100,000 in Call #001. In Call #005, the CFO stated a firm cap of $85,000.

A traditional prompt blindly blends these into an average of $92,500. With deterministic temporal memory, DealMemory surfaces the discrepancy:

```typescript
if (budgetMatches.length >= 2) {
  const values = Array.from(new Set(budgetMatches.map(m => m[0])));
  if (values.length > 1) {
    conflicts.push({
      id: `conflict_budget_${deal.id}`,
      field: "Budget Ceiling",
      description: `Inconsistent budget figures detected across calls: ${values.join(" vs ")}.`,
      resolution: "Validate the exact spending cap with CFO Elena Rostova before issuing contract terms.",
    });
  }
}
```

## Retrieval Scoping: Recall vs. Reflect in Production

A key lesson from our backend integration was establishing clear separation between factual recall and reflective reasoning. 

When an account executive opens the timeline view, they are performing a factual audit: *What did the CTO say about SSO?* For this, calling Hindsight's `recall()` with explicit tags yields fast, deterministic results without LLM synthesis latency.

Conversely, when assembling the preparation brief, the system calls `reflect()`. In this mode, Hindsight synthesizes across the full web of retained observations, taking into account the skepticism disposition:

```typescript
const reflection = await client.reflect(bankId, query, {
  budget: "mid",
  context: "Preparing strategic recommendation for upcoming deal interaction",
  tags: [`deal:${dealId}`],
  includeFacts: true,
});
```

By keeping factual retrieval separate from strategic reflection, we minimize LLM token consumption while maintaining sub-second response times for standard timeline navigation.

## Lessons Learned and Architectural Trade-Offs

During initial testing, we experimented with embedding broad metadata payloads inside the text body of the memory item. This caused retrieval pollution—the embedding model began over-indexing on repetitive metadata keys instead of the actual conversational content.

We resolved this by cleanly separating document content from metadata attributes, passing structured context directly into Hindsight's `context` parameter while reserving `tags` strictly for coarse filtering.

For further exploration of agent memory patterns and APIs, refer to the [Hindsight documentation](https://hindsight.vectorize.io/), inspect the [Hindsight GitHub repository](https://github.com/vectorize-io/hindsight), or review Vectorize's conceptual guide on [what is agent memory](https://vectorize.io/what-is-agent-memory).

By structuring agent memory with deterministic IDs and disciplined tagging, teams can build AI systems that provide reliable, auditable intelligence across complex enterprise workflows.
