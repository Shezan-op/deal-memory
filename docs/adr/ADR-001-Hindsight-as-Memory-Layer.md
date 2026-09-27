# ADR-001: Hindsight as the Primary Memory Engine

## Status
Accepted

## Context
Sales intelligence requires durable organizational memory across months-long enterprise deals. Traditional RAG systems rely on naive vector chunk similarity, which cannot model episodic experience, temporal sequences, or outcome feedback loops.

## Decision
Adopt Hindsight as the core memory layer via `@vectorize-io/hindsight-client`. Use Hindsight's `retain()`, `recall()`, and `reflect()` capabilities to manage the full memory lifecycle.

## Consequences
- **Positive**: Native support for observations, mental models, and skeptical reflection without building custom vector orchestration pipelines.
- **Negative**: Adds a dependency on the Hindsight service or local container.
