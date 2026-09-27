# ADR-005: In-Memory Domain Fixtures for Hackathon MVP

## Status
Accepted

## Context
Deploying an external relational database (e.g. Postgres or Supabase) alongside Hindsight increases setup friction and risks deployment failures during evaluation.

## Decision
Maintain domain state (deals, companies, stakeholders) using in-memory TypeScript fixtures backed by a repository abstraction (`DealRepository`), while treating Hindsight as the sole durable intelligence and memory layer.

## Consequences
- **Positive**: Zero-config evaluation; instant seeding; idempotent resets.
- **Negative**: Domain records reset on server restart, though Hindsight retains memory permanently.
