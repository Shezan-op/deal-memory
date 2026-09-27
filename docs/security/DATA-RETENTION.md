# DealMemory Data Retention & Deletion Policy

## 1. Data Classification & Storage Matrix

| Data Asset | Storage Location | Retention Period | Access Scope | Deletion Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Sales Transcripts & Notes** | Hindsight Memory Bank & In-Memory Repo | Active lifetime of customer deal + 90 days post-close | Authorized tenant users assigned to deal | Document deletion via Hindsight Client API |
| **Interaction Outcomes** | Hindsight Memory Bank (`:outcome` docs) | Permanent during active contract lifecycle | Authorized tenant account executive & leadership | Soft-delete in repository; tombstone in memory bank |
| **Derived Mental Models** | Hindsight Bank Mental Models | Refreshed dynamically upon outcome recording | Tenant organization | Delete mental model endpoint via Hindsight API |
| **Preparation Briefs** | Transient server memory (ephemeral) | 0 seconds (generated dynamically per request) | Requesting user only | Discarded after HTTP response completion |
| **Diagnostic & Security Logs** | Application runtime stdout / logging service | 30 days rolling retention | System Administrators & Security Engineers | Automated rolling log rotation |
| **Demo Fixture Records** | In-memory repository & Demo Bank | Re-created upon seed or demo reset | Public demo users | Reset API endpoint (`/api/demo/reset`) |

---

## 2. Deletion Semantics & Cascade Rules

### Interaction Deletion
When an interaction is removed:
1. The repository removes the `Interaction` object from active deal timelines.
2. The associated document ID `deal:{dealId}:interaction:{interactionId}` is deleted from the tenant's Hindsight memory bank.
3. *Derived Observations*: Facts extracted into Hindsight's knowledge graph undergo consolidation during the next bank observation cycle. If an outcome is removed, related mental models are refreshed via `refreshMentalModel()`.

### Deal Deletion & Tenant De-Provisioning
1. When a deal is deleted, all tagged memories (`deal:{dealId}`) are deleted from Hindsight.
2. When a tenant organization account is terminated, the entire dedicated bank (e.g. `deal-memory-alpha`) is deleted from Hindsight using bank deletion APIs.

---

## 3. Demo Reset Governance
1. The demo reset endpoint (`POST /api/demo/reset`) operates exclusively on the demo bank (`deal-memory-demo`).
2. Demo reset is strictly **disabled** in production environments unless explicitly authorized via `DEMO_RESET_ALLOWED=true` and verified with `x-demo-admin-key`.
3. In tests, isolated synthetic tenants (`tenant-alpha-corp`, `tenant-nexa-enterprises`) are used to ensure demo data never contaminates production or test memory banks.
