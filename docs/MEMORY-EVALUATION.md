# Memory Evaluation Scenarios

This document outlines deterministic verification scenarios used to validate memory accuracy.

## Scenario 1: Discount Failure Detection
- **Input**: Deal preparation request for Acme Corp (`deal_acme_001`).
- **Expected Outcome**: Brief warns specifically against offering pricing concessions.
- **Evidence Requirement**: Must cite document `deal:acme-001:interaction:002`.
- **Pass Criteria**: `brief.whatDidNotWork` contains reference to the 15% discount attempt.

## Scenario 2: Successful Progression Pattern
- **Input**: Query for what unlocked progression at Acme Corp.
- **Expected Outcome**: Identifies the 30-day dual-run migration roadmap.
- **Evidence Requirement**: Must cite document `deal:acme-001:interaction:004`.
- **Pass Criteria**: `brief.whatWorked` mentions migration roadmap and TAM support.

## Scenario 3: Stakeholder Budget Conflict Detection
- **Input**: Analysis of Acme Corp financial constraints.
- **Expected Outcome**: Flags conflict between Call #001 ($100k) and Call #005 ($85k).
- **Pass Criteria**: `brief.conflicts` has length >= 1 with field "Budget Ceiling".

## Scenario 4: Contrast Test (Memory OFF vs ON)
- **Input**: Identical deal ID passed with `memoryMode: "off"` then `memoryMode: "on"`.
- **Expected Outcome**: OFF outputs generic discount advice; ON outputs evidence-grounded migration roadmap strategy.
- **Pass Criteria**: Responses differ semantically in both tactics and risk warnings.
