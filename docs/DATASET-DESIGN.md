# Synthetic Dataset Specification

DealMemory ships with a realistic, production-grade B2B sales dataset located in `src/lib/domain/fixtures.ts`.

## 1. Overview
The seed dataset includes:
- **3 Companies**: Acme Corp (Enterprise SaaS), TechFlow Solutions (Fintech), and CyberShield Networks (Security Infrastructure).
- **7 Stakeholders**: Covering CTOs, VPs of Engineering, CFOs, and Security Directors.
- **3 Deals**: Across Discovery, Technical Validation, and Solution Design stages.
- **12 Interactions**: Realistic, non-trivial enterprise sales dialogues with recorded objections, actions, and outcomes.

## 2. Flagship Narrative: Acme Corp (`deal_acme_001`)

The flagship Acme Corp narrative intentionally embeds specific learning moments:

1. **Interaction #001 (Oct 18)**: Discovery call with VP Eng Marcus Vance. Stated implementation risk and an informal $100k budget.
2. **Interaction #002 (Oct 24)**: Rep offers a 15% discount to address onboarding hesitation.
   - **Action**: Discount concession.
   - **Outcome**: `STALLED`. Prospect disengages; clarifies that price isn't the issue.
3. **Interaction #003 (Oct 28)**: Technical deep dive with CTO Sarah Jenkins. Reasserts migration risk.
4. **Interaction #004 (Nov 02)**: Rep introduces a 30-day dual-run migration roadmap with a dedicated TAM.
   - **Action**: Engineering migration plan.
   - **Outcome**: `PROGRESSED`. Sarah approves advancing to sandbox validation.
5. **Interaction #005 (Nov 08)**: CFO Elena Rostova introduces a hard $85k budget cap (Contradiction with Call #001).
6. **Interaction #006 (Nov 14)**: Security review with David Park; flags requirement for SOC2 Type II bridge letter.
7. **Interaction #007 (Nov 20)**: Comprehensive sync evaluating sandbox architecture.

This dataset provides deterministic proof that Hindsight learns from what worked (migration roadmap) vs. what failed (discounting), while detecting real-world budget contradictions.
