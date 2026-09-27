# Technical Article Generation Prompt

Instructions for an AI coding agent to inspect this repository and draft a technical developer article.

## Instructions
1. Inspect `src/lib/hindsight/`, `src/lib/domain/`, and `src/app/api/deals/[dealId]/prepare/route.ts` to ground all technical details in actual code.
2. Adopt a direct, experienced engineering voice (first-person singular or plural).
3. Frame the article around the central architectural shift: moving from generic summarization (RAG) to an outcome-learning loop (Action → Outcome → Memory → Next Action).
4. Strictly enforce the word count constraint: between 800 and 1,500 words.
5. Include 2–4 verified code snippets directly from the codebase.
6. Contrast stateless LLM behavior (Memory OFF) with Hindsight's evidence-backed reflection (Memory ON).
7. Discuss at least one authentic engineering failure, dead end, or trade-off (e.g., read-after-write asynchronous indexing vs. deterministic document IDs, or naive vector similarity vs. temporal causality).
8. Never include the word "hackathon", "competition", or "judges".
9. Ensure valid links to Hindsight GitHub, Hindsight Docs, and Vectorize Agent Memory are embedded.
