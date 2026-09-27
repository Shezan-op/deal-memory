# ADR-004: Evidence-First Recommendations

## Status
Accepted

## Context
Sales representatives distrust generic AI recommendations that cannot be substantiated with proof. Unfounded advice leads to lost deals and user churn.

## Decision
Mandate that every recommendation generated in a `DealPreparationBrief` must cite specific historical document IDs, expose known patterns, and list explicit uncertainties or conflicting evidence.

## Consequences
- **Positive**: Complete auditability; reps can inspect the exact call transcript where an objection or outcome occurred.
- **Negative**: The agent must gracefully decline to make authoritative claims when historical evidence is insufficient.
