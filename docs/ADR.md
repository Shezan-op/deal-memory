# Architecture Decision Records (ADRs) — DealMemory

This document records the architectural and design decisions made for DealMemory, explaining the context, decision rationale, and consequences for each.

---

## Index of Decisions
1. [ADR-001: Hindsight as the Primary Memory Engine](#adr-001-hindsight-as-the-primary-memory-engine)
2. [ADR-002: Bank-Level Multi-Tenant Isolation](#adr-002-bank-level-multi-tenant-isolation)
3. [ADR-003: Outcome-Linked Memory Feedback Loop](#adr-003-outcome-linked-memory-feedback-loop)
4. [ADR-004: Evidence-First Recommendations](#adr-004-evidence-first-recommendations)
5. [ADR-005: In-Memory Domain Fixtures for Hackathon MVP](#adr-005-in-memory-domain-fixtures-for-hackathon-mvp)
6. [ADR-006: Tight Product Scope: One Persona, One Workflow](#adr-006-tight-product-scope-one-persona-one-workflow)
7. [ADR-007: Memory ON vs. OFF Contrast Mechanism](#adr-007-memory-on-vs-off-contrast-mechanism)
8. [ADR-008: Coherent Synthetic Dataset Design](#adr-008-coherent-synthetic-dataset-design)

---

## ADR-001: Hindsight as the Primary Memory Engine

### Status
Accepted

### Context
Sales intelligence requires durable organizational memory across months-long enterprise deals. Traditional RAG systems rely on naive vector chunk similarity, which cannot model episodic experience, temporal sequences, or outcome feedback loops.

### Decision
Adopt [Hindsight](https://github.com/vectorize-io/hindsight) as the core memory layer via `@vectorize-io/hindsight-client`. Use Hindsight's `retain()`, `recall()`, and `reflect()` capabilities to manage the full memory lifecycle.

### Consequences
- **Positive**: Native support for observations, mental models, and skeptical reflection without building custom vector orchestration pipelines.
- **Negative**: Adds a dependency on the Hindsight service or local container.

---

## ADR-002: Bank-Level Multi-Tenant Isolation

### Status
Accepted

### Context
Commercial deal transcripts contain sensitive enterprise pricing, customer vulnerabilities, and confidential architectures. Cross-tenant leakage would be catastrophic.

### Decision
Enforce tenant isolation at the Hindsight bank boundary: each customer organization receives a dedicated memory bank.

### Consequences
- **Positive**: Hard boundary at the engine level; zero risk of one tenant's queries matching another tenant's vector embeddings.
- **Negative**: Cross-organization pattern recognition requires federated cross-bank operations in future versions.

---

## ADR-003: Outcome-Linked Memory Feedback Loop

### Status
Accepted

### Context
Standard conversation notes capture what was said, but not what happened as a result of actions attempted during the call. Without outcomes, an AI cannot evaluate whether a tactic was beneficial or detrimental.

### Decision
Retain outcomes as explicit secondary documents linked to the original interaction document ID (`deal:{id}:interaction:{id}:outcome`), tagged with `outcome:progressed`, `outcome:stalled`, or `outcome:lost`.

### Consequences
- **Positive**: Enables Hindsight's `reflect()` engine to distinguish successful objection resolutions from failed attempts.
- **Negative**: Requires sales reps to log or confirm outcomes following key milestones.

---

## ADR-004: Evidence-First Recommendations

### Status
Accepted

### Context
Sales representatives distrust generic AI recommendations that cannot be substantiated with proof. Unfounded advice leads to lost deals and user churn.

### Decision
Mandate that every recommendation generated in a `DealPreparationBrief` must cite specific historical document IDs, expose known patterns, and list explicit uncertainties or conflicting evidence.

### Consequences
- **Positive**: Complete auditability; reps can inspect the exact call transcript where an objection or outcome occurred.
- **Negative**: The agent must gracefully decline to make authoritative claims when historical evidence is insufficient.

---

## ADR-005: In-Memory Domain Fixtures for Hackathon MVP

### Status
Accepted

### Context
Deploying an external relational database (e.g. Postgres or Supabase) alongside Hindsight increases setup friction and risks deployment failures during evaluation.

### Decision
Maintain domain state (deals, companies, stakeholders) using in-memory TypeScript fixtures backed by a repository abstraction (`DealRepository`), while treating Hindsight as the sole durable intelligence and memory layer.

### Consequences
- **Positive**: Zero-config evaluation; instant seeding; idempotent resets.
- **Negative**: Domain records reset on server restart, though Hindsight retains memory permanently.

---

## ADR-006: Tight Product Scope: One Persona, One Workflow

### Status
Accepted

### Context
Attempting to build a multi-role CRM (sales, marketing, customer success, revops) fragments the product focus and dilutes the core memory narrative.

### Decision
Focus exclusively on one persona (B2B Account Executive) and one primary workflow: preparing for the next deal interaction.

### Consequences
- **Positive**: Razor-sharp demonstration; zero distraction from extraneous features.
- **Negative**: Marketing and CS workflows deferred to post-hackathon roadmap.

---

## ADR-007: Memory ON vs. OFF Contrast Mechanism

### Status
Accepted

### Context
Judges and technical evaluators need an immediate, visceral understanding of why memory matters, rather than taking claims on faith.

### Decision
Provide an explicit toggle on the preparation screen allowing the user to switch between Memory OFF (stateless prompt baseline) and Memory ON (Hindsight-backed reflection).

### Consequences
- **Positive**: Directly demonstrates the failure of stateless prompts (recommending a failed discount) vs. Hindsight's evidence-backed strategy.
- **Negative**: Requires maintaining a parallel baseline prompt simulation.

---

## ADR-008: Coherent Synthetic Dataset Design

### Status
Accepted

### Context
Random lorem-ipsum transcripts fail to demonstrate intelligent memory retrieval or contradiction detection.

### Decision
Hand-craft a realistic B2B sales dataset across 3 companies and 12 interactions featuring real enterprise friction: implementation blockers, discount failures, migration roadmap successes, and budget discrepancies ($100k vs $85k).

### Consequences
- **Positive**: Provides reproducible, deterministic evaluation scenarios.
- **Negative**: Requires ongoing maintenance if schema definitions expand.
