# Reddit Post Template

**Target Subreddits**:
- r/llmdevs
- r/aiagents
- r/sideproject
- r/aimemory

---

### Post Title
We replaced RAG with an outcome-learning memory loop for enterprise sales conversations (built on Hindsight)

---

### Post Body (Markdown)

Most AI implementations in sales follow the same pattern: transcribe call -> summarize transcript -> paste bullet points into CRM notes.

The issue is that summarization is stateless. If your rep offered a discount in call #2 and it caused the prospect to disengage (because their issue was actually engineering capacity), a typical prompt in call #5 will happily recommend another discount.

We built an open-source project called **DealMemory** to explore closing this loop:
`Sales Action -> Retain -> Outcome Observed -> Retain Outcome -> Consolidated Mental Model -> Evidence-Backed Preparation`

Instead of generic vector search, we used Hindsight as a dedicated memory engine with deterministic document IDs (`deal:{id}:interaction:{id}`) and tagged outcome documents (`:outcome`). When preparing for an upcoming call, the agent cites past interaction documents explaining why previous tactics failed or succeeded, and flags contradictory data (like different budget ceilings stated by the CTO vs. CFO).

Detailed writeup with code snippets and before/after comparisons:  
[Link to published technical article]

GitHub repository with full Next.js/Hindsight implementation:  
https://github.com/Shezan-op/deal-memory

Curious to hear how others are handling outcome feedback loops in agent architectures.
