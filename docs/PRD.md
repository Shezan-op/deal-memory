# Product Requirements Document (PRD) — DealMemory

## 1. Executive Summary
**DealMemory** is an outcome-learning deal intelligence system powered by [Hindsight](https://github.com/vectorize-io/hindsight). It solves the fundamental limitation of traditional sales AI: treating every meeting as an isolated summarization task without accumulating experience from past actions and their results.

## 2. Product Thesis
- **Traditional AI**: Conversation → Summary → Static CRM Note
- **DealMemory**: Conversation → Retained Memory → Action → Outcome → Consolidation → Better Future Action

## 3. Primary User Persona
- **Role**: B2B Enterprise Account Executive / Sales Representative
- **Primary Job-to-be-Done**: Prepare for an upcoming deal interaction with actionable, evidence-backed strategy rather than generic advice.

## 4. Key Workflows
1. **Deal Inbox**: Rep scans active accounts, noticing stages, values, and open objections.
2. **Deal Overview & Timeline**: Rep inspects chronological touchpoints, attendee roles, and progression signals.
3. **Generate Next Interaction Brief**: Rep clicks "Prepare Next Interaction". The system queries Hindsight, retrieves past experiences, reconciles conflicts, and renders a structured brief.
4. **Memory Contrast (ON vs. OFF)**: Rep toggles between stateless baseline LLM and Hindsight-backed reflection to visibly confirm the impact of memory.
5. **Log Action & Outcome**: Rep records meeting results (e.g., "Offered migration plan" -> PROGRESSED), which immediately ingests into Hindsight to inform future briefs.

## 5. Non-Functional Requirements
- **Evidence-First**: No recommendation may be presented without citations to historical document IDs.
- **Contradiction Resilient**: Inconsistent budget figures or stakeholder stances must be flagged as conflicts rather than averaged.
- **Strict Tenant Isolation**: Each organization tenant maps to an isolated Hindsight memory bank.
