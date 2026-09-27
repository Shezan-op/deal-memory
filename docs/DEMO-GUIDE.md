# Demo Guide & Evaluator Walkthrough — DealMemory

This guide provides evaluators, judges, and developers with a complete, structured walkthrough of DealMemory, demonstrating how [Hindsight](https://github.com/vectorize-io/hindsight) transforms sales preparation from static summaries into an outcome-learning intelligence loop.

---

## 1. Pre-Flight Verification Checklist

Before starting a live demo or recording, verify the following:

- [ ] Node.js 20+ installed.
- [ ] Dependencies installed: `npm install`.
- [ ] Environment file configured: `.env.local` created from `.env.example`.
- [ ] Demo dataset seeded: `npm run seed`.
- [ ] Vitest test suite passes: `npm run test` (57/57 tests passing).
- [ ] Development server running: `npm run dev` (Available at `http://localhost:3000`).

---

## 2. Guided 6-Step Demonstration Script

### Step 1: The Deal Inbox (`/deals`)
- **Action**: Navigate to `http://localhost:3000/deals`.
- **Narrative**: "Here is the sales representative's active pipeline. We see three enterprise accounts at different stages. Notice Acme Corporation is in `technical-validation`, valued at $120,000 ARR, with 3 open blockers documented."
- **Key Observation**: Point out the open objections: implementation complexity, Okta SSO compliance, and budget scrutiny.

### Step 2: Account Timeline & Historical Context (`/deals/deal-acme-001/timeline`)
- **Action**: Click on Acme Corporation to open the timeline.
- **Narrative**: "Sales deals take 6–9 months. Over 4 meetings, different tactics were attempted. In Meeting 2, the rep offered a 15% discount when the prospect objected to complexity—and that tactic stalled the deal. In Meeting 4, the rep presented a phased migration roadmap, and the deal progressed."
- **Key Observation**: Emphasize that traditional CRMs store this as text notes, but standard AI never connects the tactic to the outcome.

### Step 3: Preparation Brief with Memory OFF (`/deals/deal-acme-001/prepare`)
- **Action**: Click "Prepare Next Interaction". Ensure the **Memory Toggle** is set to **OFF**.
- **Narrative**: "This simulates how modern AI chatbots prepare a rep without memory. The prompt only sees the current deal stage and objections."
- **The Failure**: The stateless model suggests: *"Offer a further discount or pilot pricing concession to overcome budget scrutiny."*
- **The Problem**: That discount tactic already stalled the deal in Meeting 2! Without memory, the AI makes the same mistake again.

### Step 4: Preparation Brief with Memory ON (Hindsight Reflection)
- **Action**: Toggle the **Memory Toggle** to **ON**. Click "Generate Brief".
- **Narrative**: "Now we activate Hindsight. Hindsight recalls all previous interactions, actions attempted, and linked outcomes. It performs reflective synthesis."
- **The Evidence-Backed Strategy**:
  1. **What Worked**: Cites `deal:acme-001:interaction:int-004` (Phased migration plan progressed the deal).
  2. **What Stalled**: Cites `deal:acme-001:interaction:int-002` (Discounting caused stall).
  3. **Actionable Advice**: Recommends presenting the Okta SSO validation plan and locking in pilot dates. Strongly advises *against* discounting.
  4. **Contradiction Alert**: Surfaces a conflict between Sarah Chen's $100k estimate and Dave Miller's $85k cap.

### Step 5: Real-Time Learning Loop (`/deals/deal-acme-001/timeline`)
- **Action**: Log a new interaction outcome. Select "Proposed phased 2-week pilot with Okta SSO" and mark as `PROGRESSED`.
- **Narrative**: "The meeting finishes. The rep logs the outcome. DealMemory retains this outcome into Hindsight under the deterministic document ID `deal:acme-001:interaction:int-005:outcome`."
- **Result**: The mental model is immediately updated for future preparations.

### Step 6: Memory Inspection (`/deals/deal-acme-001/memory`)
- **Action**: Open the Memory tab.
- **Narrative**: "We inspect Hindsight's internal memory bank directly. Every recommendation is traceable to verifiable observations, world facts, and linked causal outcomes."

---

## 3. Memory Evaluation Benchmarks

| Evaluation Dimension | Memory OFF (Stateless Baseline) | Memory ON (Hindsight-Backed) |
| :--- | :--- | :--- |
| **Objection Resolution Strategy** | Suggests generic 15% discount (Repeats past failure). | Suggests technical migration proof; advises against discount. |
| **Auditability & Citations** | Zero historical citations; hallucinated consensus. | 100% citations to exact interaction document IDs. |
| **Contradiction Detection** | Blind to $100k vs $85k budget conflict. | Flags high-severity budget conflict between stakeholders. |
| **Adaptability** | Repeats identical static output on subsequent calls. | Updates dynamically as new outcomes are ingested. |

---

## 4. Hackathon Evaluation Alignment

DealMemory was designed specifically to showcase the capabilities of [Vectorize Hindsight](https://github.com/vectorize-io/hindsight):
1. **Meaningful Use of Memory**: Memory is not an optional cache; it fundamentally alters the quality of the sales agent's recommendations.
2. **Causal Outcome Learning**: Distinguishes what happened after an action (`:outcome` documents) rather than just what was said.
3. **Skeptical Reflection**: Uses Hindsight's reflection engine to challenge assumptions and expose conflicts before reps walk into critical negotiations.
4. **Bank-Level Isolation**: True multi-tenant enterprise data segregation.
