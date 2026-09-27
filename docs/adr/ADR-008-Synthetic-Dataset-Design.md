# ADR-008: Coherent Synthetic Dataset Design

## Status
Accepted

## Context
Random lorem-ipsum transcripts fail to demonstrate intelligent memory retrieval or contradiction detection.

## Decision
Hand-craft a realistic B2B sales dataset across 3 companies and 12 interactions featuring real enterprise friction: implementation blockers, discount failures, migration roadmap successes, and budget discrepancies ($100k vs $85k).

## Consequences
- **Positive**: Provides reproducible, deterministic evaluation scenarios.
- **Negative**: Requires ongoing maintenance if schema definitions expand.
