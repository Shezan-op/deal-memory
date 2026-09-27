# Memory Taxonomy & Document ID Specification

This document defines the tag hierarchy, document ID convention, and metadata structure for DealMemory.

## 1. Document ID Structure

All document IDs stored in Hindsight MUST follow this deterministic schema:

```
deal:<dealId>:interaction:<interactionId>
deal:<dealId>:interaction:<interactionId>:outcome
```

### Examples:
- Deal interaction: `deal:acme-001:interaction:002`
- Deal outcome: `deal:acme-001:interaction:002:outcome`

Random UUIDs are strictly prohibited for primary document retention.

## 2. Tag Taxonomy

Tags provide filtered retrieval scopes inside Hindsight:

| Tag Prefix | Example | Description |
| :--- | :--- | :--- |
| `deal:<id>` | `deal:acme-001` | Scopes memories to a specific commercial opportunity. |
| `company:<id>` | `company:comp_acme` | Scopes memories to the parent corporate account. |
| `stage:<stage>` | `stage:technical-validation` | Filters by sales pipeline stage. |
| `objection:<name>` | `objection:implementation` | Labels specific hurdles raised by prospects. |
| `action:<name>` | `action:migration-roadmap` | Identifies tactical measures taken by the sales rep. |
| `outcome:<status>` | `outcome:progressed` | Captures the commercial result of the interaction. |

## 3. Memory Hierarchy

1. **World Fact**: Objective company information (e.g., "Acme runs on AWS us-east-1 and requires SOC2 Type II").
2. **Experience**: An episodic event that took place (e.g., "On Oct 24, rep offered a 15% discount; prospect disengaged").
3. **Observation**: An inferred pattern formed after multiple experiences (e.g., "Pricing concessions do not resolve implementation objections for this account").
4. **Mental Model**: Synthesized deal strategy combining stakeholder dynamics, progression gates, and objection resolutions.
