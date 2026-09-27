# ADR-007: Memory ON vs. OFF Contrast Mechanism

## Status
Accepted

## Context
Judges and technical evaluators need an immediate, visceral understanding of why memory matters, rather than taking claims on faith.

## Decision
Provide an explicit toggle on the preparation screen allowing the user to switch between Memory OFF (stateless prompt baseline) and Memory ON (Hindsight-backed reflection).

## Consequences
- **Positive**: Directly demonstrates the failure of stateless prompts (recommending a failed discount) vs. Hindsight's evidence-backed strategy.
- **Negative**: Requires maintaining a parallel baseline prompt simulation.
