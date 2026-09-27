# Evidence-First Interface Design: Replacing Chatbots with Traceable Briefs

Most enterprise AI interfaces default to an open-ended conversational chat box. You open a page, see a flashing cursor in an empty input field, and ask: "Can you help me prepare for my call?" In return, you receive three paragraphs of fluent, confident text.

In B2B sales, this interaction model is fatally flawed. Account executives managing $100k+ deals do not want to converse with a conversational avatar; they need actionable intelligence that they can verify in thirty seconds before picking up the phone. Most importantly, when an AI advises: "Do not offer a discount on this call," the rep's immediate question is: *Why? Who decided that, and when?*

When designing DealMemory—an outcome-learning deal intelligence system powered by [Hindsight](https://github.com/vectorize-io/hindsight)—we eliminated the generic chat window entirely. In its place, we built an evidence-first, scannable preparation interface grounded in deterministic document citations.

## The Flaw of Unbounded Chat in Enterprise Workflows

Conversational chat interfaces introduce three fundamental UX friction points in high-stakes workflows:

1. **High Cognitive Load**: The user must formulate a prompt from scratch. If they forget to mention that the CFO joined the deal or that security raised an objection, the model generates irrelevant advice.
2. **Zero Auditability**: A chat response provides prose without provenance. The rep cannot tell if a recommendation is grounded in an actual past call or is an LLM hallucination.
3. **Inability to Compare States**: In a chat stream, it is virtually impossible to compare what the system knows today versus what it knew last week without tedious back-and-forth prompt gymnastics.

## Designing the DealPreparationBrief

Instead of an open chat dialog, DealMemory exposes a structured document: the `DealPreparationBrief`. When a rep navigates to `/deals/[dealId]/prepare`, the backend queries Hindsight and compiles an eight-part executive brief:

1. **Current Deal Situation**: Account ARR, stage, and primary objective.
2. **Key Stakeholders**: Active participants and their documented priorities.
3. **Open Objections**: Known blockers (e.g., SOC2 verification, migration timelines).
4. **What Has Been Tried**: Explicit tactical actions attempted in previous interactions.
5. **What Worked vs. What Did Not**: Outcome-linked successes (progressed) vs. failures (stalled).
6. **Recommended Approach**: Clear tactical guidance for the upcoming meeting.
7. **Questions to Ask & Watch-Outs**: Concrete talking points grounded in stakeholder reactions.
8. **Evidence & Audit Trail**: Direct links to historical document IDs in Hindsight.

## The Contrast Mechanism: Memory ON vs. OFF

To make the value of accumulated experience unmistakable, we built an explicit contrast toggle directly into the header of the preparation view:

```typescript
// Segmented control allowing reps and evaluators to test the memory layer
<button
  onClick={() => setMemoryMode("off")}
  className={memoryMode === "off" ? "active-mode" : "inactive-mode"}
>
  Memory: OFF (Stateless Prompt)
</button>
<button
  onClick={() => setMemoryMode("on")}
  className={memoryMode === "on" ? "active-mode" : "inactive-mode"}
>
  Memory: ON (Hindsight Reflected)
</button>
```

When Memory is toggled **OFF**, the system simulates a standard stateless prompt:
> "Acme Corp is evaluating our platform. Summarize our core capabilities. Reiterate our 99.9% uptime SLA and offer a 15% discount if they express hesitation regarding onboarding complexity."

When Memory is toggled **ON**, the brief re-renders with Hindsight-backed evidence:
> "Do not lead with pricing concessions. When a 15% discount was offered on Oct 24 (`deal:acme-001:interaction:002`), the account stalled. Progress was only unlocked on Nov 02 (`deal:acme-001:interaction:004`) when we introduced a dedicated 30-day dual-run migration roadmap."

The user doesn't have to take the AI's word for it; they see the exact failure and success in the historical timeline.

## Surfacing Contradictions Instead of Smoothing Them Over

In traditional generative UI, when contradictory information is present, the language model attempts to resolve it by synthesizing an agreeable middle ground. If the VP of Engineering says the budget is $100k and the CFO later states a firm cap of $85k, naive interfaces simply say: "Budget is roughly $90k."

In DealMemory, we treat contradictions as critical operational alerts:

```typescript
{brief.conflicts.map((conflict) => (
  <div key={conflict.id} className="p-4 border border-amber-300 bg-amber-50">
    <div className="font-mono text-xs uppercase text-amber-900 font-bold">
      CONTRADICTION DETECTED: {conflict.field}
    </div>
    <p className="text-sm text-amber-950 mt-1">{conflict.description}</p>
    <div className="text-xs text-amber-800 mt-2 font-mono">
      Resolution: {conflict.resolution}
    </div>
  </div>
))}
```

Rather than hiding the ambiguity, the interface prompts the sales rep to address the gap directly on the call.

## The Power of Human-in-the-Loop Memory Confirmation

Another crucial UX decision was deciding how new outcomes get ingested into the memory bank. Fully autonomous background ingestion sounds elegant in theory, but in practice, sales representatives often need to adjust the nuance of an outcome.

For example, if a customer says: "We cannot sign this month because our legal team is backlogged," an automated classifier might mark the outcome as `STALLED` due to legal friction. But the representative knows that the customer agreed to a verbal commitment for next month.

DealMemory addresses this through an explicit, frictionless outcome confirmation drawer:

```typescript
// Explicit human-in-the-loop logging before memory retention
<div className="outcome-drawer p-5 border bg-[#fcfbf7]">
  <h4 className="font-mono text-xs uppercase text-[#7c786a]">Confirm Deal Outcome</h4>
  <select value={selectedOutcome} onChange={(e) => setSelectedOutcome(e.target.value)}>
    <option value="PROGRESSED">Progressed (Next Step Confirmed)</option>
    <option value="STALLED">Stalled (Blocker Unresolved)</option>
    <option value="LOST">Lost (Commercial Roadblock)</option>
  </select>
  <button onClick={handleIngest} className="btn-primary mt-3">
    Commit to Hindsight Memory
  </button>
</div>
```

By keeping the sales representative in the driver's seat, the data retained into Hindsight remains accurate, high-signal, and trustworthy across the entire lifecycle of the opportunity.

## Design Aesthetic: Editorial Restraint

Following the `/minimalist-ui` design philosophy, DealMemory uses a calm, warm bone and ink color palette (`#fcfbf7` background, `#ede9d8` cards, `#181817` typography). There are no gratuitous purple gradients, glowing robot avatars, or decorative charts. The design lets the evidence, typography, and outcome feedback loop take center stage.

To learn more about implementing deterministic memory systems in agent architectures, explore the [Hindsight documentation](https://hindsight.vectorize.io/), review the [Hindsight GitHub repository](https://github.com/vectorize-io/hindsight), or read Vectorize's deep dive on [what is agent memory](https://vectorize.io/what-is-agent-memory).

By replacing chat boxes with evidence-linked executive briefs, we provide enterprise sales teams with tools they can trust in high-stakes negotiations.
