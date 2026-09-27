# ADR-003: Outcome-Linked Memory Feedback Loop

## Status
Accepted

## Context
Standard conversation notes capture what was said, but not what happened as a result of actions attempted during the call. Without outcomes, an AI cannot evaluate whether a tactic was beneficial or detrimental.

## Decision
Retain outcomes as explicit secondary documents linked to the original interaction document ID (`deal:{id}:interaction:{id}:outcome`), tagged with `outcome:progressed`, `outcome:stalled`, or `outcome:lost`.

## Consequences
- **Positive**: Enables Hindsight's `reflect()` engine to distinguish successful objection resolutions from failed attempts.
- **Negative**: Requires sales reps to log or confirm outcomes following key milestones.
