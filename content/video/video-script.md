# DealMemory Walkthrough Script

**Format**: 1080p Screen Recording with Conversational Voiceover  
**Target Duration**: 2 minutes 30 seconds

---

### [0:00 - 0:25] The Problem: Why Sales AI Fails Without Memory

**[SCREEN CUE: Show Next.js Deal Inbox at `http://localhost:3000/deals` with Acme Corp, TechFlow, and CyberShield]**

**Speaker**:  
"Every B2B sales team is using some form of AI to summarize calls. But summarization alone doesn't prevent reps from repeating mistakes. If offering a 15% discount stalled your enterprise deal two weeks ago, a traditional chatbot will happily tell you to offer another discount today because it has zero concept of outcomes.

We built DealMemory to give AI agents actual experience. Powered by Hindsight, DealMemory closes the loop: Conversation to Action, Action to Outcome, and Outcome to Consolidated Memory."

---

### [0:25 - 0:55] Memory Contrast: OFF vs. ON

**[SCREEN CUE: Click Acme Corp -> Navigate to `/deals/deal_acme_001/prepare` -> Toggle Memory OFF]**

**Speaker**:  
"Let's look at Acme Corp, a $120k ARR deal in Technical Validation. 

With Memory OFF—simulating a traditional stateless prompt—the system advises: 'Highlight ROI and offer a 15-20% discount if the client pushes back on implementation.'

Now watch what happens when we toggle Memory ON with Hindsight."

**[SCREEN CUE: Flip toggle to Memory ON -> Show instant update to evidence-based recommendations]**

**Speaker**:  
"The agent's advice flips completely: 'Do NOT offer a discount. On October 24, a 15% discount caused the account to stall. Progression was only unlocked on November 2nd when we provided an engineer-led migration roadmap.'

Instead of hallucinating generic tactics, the agent warns us away from what failed and doubles down on what worked."

---

### [0:55 - 1:35] Inspecting Traceable Evidence

**[SCREEN CUE: Scroll to Evidence & Audit Trail section -> Highlight document IDs]**

**Speaker**:  
"Notice the audit trail. Every recommendation is anchored to deterministic document IDs stored in Hindsight: `deal:acme-001:interaction:002` for the discount failure, and `interaction:004` for the migration plan success.

The agent also catches conflicting data. In Call 1, the tech lead mentioned a $100k budget. In Call 5, the CFO stated an $85k cap. DealMemory flags the discrepancy so the rep can clarify it before sending terms."

---

### [1:35 - 2:10] Ingesting New Outcomes Live

**[SCREEN CUE: Navigate to Interactive Demo at `/demo` -> Advance to Step 4]**

**Speaker**:  
"Now let's simulate today's follow-up meeting with CTO Sarah Jenkins and Head of InfoSec David Park. 

We delivered the SOC2 Type II bridge letter and a 30-day technical validation plan. David signed off on security, and Sarah confirmed the sandbox kickoff for Monday.

We log the action and mark the outcome as NEXT_STEP_CONFIRMED. Hindsight retains this live into the bank."

**[SCREEN CUE: Click 'Ingest & Retain in Hindsight' -> Show success badge and Step 5]**

---

### [2:10 - 2:30] Updated Strategy & Wrap-up

**[SCREEN CUE: Step 5 showing consolidated Acme Corp Deal Progression Model]**

**Speaker**:  
"Instantly, Hindsight synthesizes this new evidence into the deal's mental model. Future preparation briefs will now reflect that security approval is resolved, focusing entirely on next week's sandbox validation.

That's the power of DealMemory: turning every sales conversation into durable experience the next conversation can learn from."
