# ADR-002: Bank-Level Multi-Tenant Isolation

## Status
Accepted

## Context
Commercial deal transcripts contain sensitive enterprise pricing, customer vulnerabilities, and confidential architectures. Cross-tenant leakage would be catastrophic.

## Decision
Enforce tenant isolation at the Hindsight bank boundary: each customer organization receives a dedicated memory bank.

## Consequences
- **Positive**: Hard boundary at the engine level; zero risk of one tenant's queries matching another tenant's vector embeddings.
- **Negative**: Cross-organization pattern recognition requires federated cross-bank operations in future versions.
