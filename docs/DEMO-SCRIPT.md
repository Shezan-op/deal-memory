# Demo Presentation Script (60–120 Seconds)

## Timing & Structure

### [0:00 - 0:20] Hook: The Memory Flaw in Sales AI
"Every sales team uses AI to summarize calls. But summaries don't prevent reps from repeating mistakes. If offering a discount stalled your deal two weeks ago, a standard LLM will recommend another discount today because it has no memory of outcomes. We built DealMemory on Hindsight to fix this."

### [0:20 - 0:45] The Contrast: Memory OFF vs. Memory ON
"Here is Acme Corp ($120k ARR). With Memory OFF, the assistant tells us: *'Offer a 15% discount if they hesitate on onboarding.'* 
Now watch what happens with Memory ON: the advice flips. *'Do NOT offer a discount. On October 24, a discount stalled the deal. Progression was only unlocked when we provided a 30-day migration roadmap.'*"

### [0:45 - 1:10] Evidence & Traceability
"Notice the evidence trail. The system cites exact Hindsight document IDs: `deal:acme-001:interaction:002` for the discount failure and `004` for the migration success. It also catches conflicting budget figures ($100k vs $85k) between the VP of Eng and CFO."

### [1:10 - 1:40] Live Ingestion & Learning
"Now we simulate today's meeting. We delivered the SOC2 bridge letter to InfoSec; they accepted and approved the sandbox. We log the outcome as NEXT_STEP_CONFIRMED. Hindsight retains this live, updating the deal's mental model in real time."

### [1:40 - 2:00] Conclusion
"DealMemory proves that agent memory shouldn't just summarize what happened—it must remember what was tried, what happened after, and use that experience to win the next conversation."
