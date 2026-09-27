/**
 * Centralized, versioned prompt definitions for Hindsight Retain, Reflect, and Mental Models.
 */

export const PROMPT_VERSIONS = {
  RETAIN_MISSION: '1.0.0',
  OBSERVATIONS_MISSION: '1.0.0',
  REFLECT_MISSION: '1.0.0',
  DEAL_PREPARATION: '1.0.0',
} as const;

/**
 * Retain mission injected into Hindsight fact-extraction prompt.
 * Configured on the memory bank to steer extraction focus.
 */
export const HINDSIGHT_RETAIN_MISSION = `Extract durable deal knowledge from B2B sales interactions.
Prioritize stakeholder roles, authority, pain points, business requirements, specific objections, competitor mentions, pricing constraints, technical validation requirements, commitments made, decisions reached, sales actions attempted, and observed outcomes.
Preserve temporal context, explicit stakeholder quotes, and causal relationships between attempted sales actions and prospect reactions.
Ignore greetings, meeting scheduling logistics, casual pleasantries, and generic filler.
Do not invent unsupported preferences, commitments, or outcomes.`;

/**
 * Observations mission injected into Hindsight consolidation engine.
 * Synthesizes repeated facts into durable patterns.
 */
export const HINDSIGHT_OBSERVATIONS_MISSION = `Synthesize recurring patterns across deal interactions into grounded observations.
Identify recurring stakeholder objections, patterns of what sales actions moved the deal forward versus what stalled it, stakeholder dynamics, and competitor positioning.
Distinguish single-interaction events from repeated organizational patterns.
Cite specific interactions and outcomes as evidence. If an action was tried and failed repeatedly, explicitly record that pattern. If a customer changed their stance over time, capture the evolution rather than overwriting.`;

/**
 * Reflect mission defining the system identity and reasoning disposition for Hindsight Reflect.
 */
export const HINDSIGHT_REFLECT_MISSION = `You are an elite B2B revenue intelligence analyst assisting an account executive to prepare for their next sales interaction.
Ground every recommendation directly in retained deal evidence, documented experiences, and accumulated observations.
Strictly distinguish between known facts, repeated observations, and speculative inferences.
Identify contradictions in customer statements (such as shifting budgets or conflicting stakeholder priorities).
When historical evidence is limited or missing, explicitly state "insufficient evidence" rather than offering generic sales advice.
Prioritize evidence from the current deal. If citing comparable deals, explicitly declare them as comparable benchmarks.
Explain what actions have been attempted previously with this account, what the resulting outcomes were, and why the recommended approach is superior based on evidence.`;

/**
 * Build a query for Reflect during deal preparation
 */
export function buildDealPrepareQuery(params: {
  dealTitle: string;
  companyName: string;
  stage: string;
  openObjections: string[];
  lastInteractionSummary?: string;
  customGoal?: string;
}): string {
  const objectionsText = params.openObjections.length > 0 ? params.openObjections.join(', ') : 'None documented';
  const goalText = params.customGoal ? `Representative Goal: ${params.customGoal}` : 'Goal: Advance deal to next validated stage';

  return `Prepare an actionable preparation brief for the next sales meeting with ${params.companyName} for deal "${params.dealTitle}".
Current Stage: ${params.stage}.
Documented Open Objections: ${objectionsText}.
Last Known Interaction Context: ${params.lastInteractionSummary || 'Discovery & initial discussions'}.
${goalText}.

Analyze all historical interactions, attempted actions, and outcomes for this deal.
Determine:
1. What was attempted previously when addressing these objections, and what were the outcomes?
2. Did discounts, technical proofs, or migration roadmaps move the needle?
3. What is the evidence-backed recommended strategy for the upcoming call?
4. What questions should the rep ask, and what risks/watchouts exist based on past stakeholder reactions?`;
}
