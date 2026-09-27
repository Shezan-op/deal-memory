export type DealStage =
  | 'discovery'
  | 'qualification'
  | 'technical-validation'
  | 'pricing-negotiation'
  | 'contract-review'
  | 'closed-won'
  | 'closed-lost'
  | 'stalled';

export type OutcomeType =
  | 'PROGRESSED'
  | 'STALLED'
  | 'LOST'
  | 'NEXT_STEP_CONFIRMED'
  | 'NO_CHANGE'
  | 'POSITIVE_SIGNAL'
  | 'NEGATIVE_SIGNAL'
  | 'UNKNOWN';

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: 'decision-maker' | 'champion' | 'economic-buyer' | 'technical-evaluator' | 'influencer';
  email: string;
  phone?: string;
  priorities: string[];
  personality?: string;
}

export interface InteractionOutcome {
  outcomeType: OutcomeType;
  summary: string;
  reason: string;
  nextStep?: string;
  stakeholderReaction?: string;
  actionTaken: string;
  timestamp: string;
}

export interface Interaction {
  id: string;
  dealId: string;
  companyId: string;
  contactIds: string[];
  timestamp: string;
  channel: 'call' | 'email' | 'meeting' | 'demo' | 'technical-deep-dive';
  stage: DealStage;
  participants: string[];
  context: string;
  rawContent: string;
  objections?: string[];
  actionAttempted?: string;
  outcome?: InteractionOutcome;
  tags?: string[];
}

export interface Deal {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  value: number;
  stage: DealStage;
  status: 'active' | 'won' | 'lost' | 'stalled';
  stakeholderIds: string[];
  openObjections: string[];
  competitors: string[];
  lastInteractionDate: string;
  nextScheduledDate?: string;
  interactionCount: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  annualRevenue: string;
  techStack: string[];
}

export interface EvidenceItem {
  id: string;
  text: string;
  type: 'world' | 'experience' | 'observation';
  context?: string;
  occurredStart?: string;
  documentId?: string;
  metadata?: Record<string, string>;
  isComparableDeal?: boolean;
  dealId?: string;
  confidenceScore?: number;
}

export interface MemoryConflict {
  field: string;
  earlierValue: string;
  earlierSource: string;
  earlierDate: string;
  laterValue: string;
  laterSource: string;
  laterDate: string;
  resolutionAdvice: string;
}

export interface DealPreparationBrief {
  dealId: string;
  companyName: string;
  generatedAt: string;
  memoryEnabled: boolean;
  currentSituation: string;
  keyStakeholders: Array<{
    name: string;
    title: string;
    role: string;
    knownPriorities: string[];
  }>;
  openObjections: string[];
  whatHasBeenTried: Array<{
    action: string;
    targetObjection: string;
    outcome: OutcomeType;
    resultSummary: string;
    interactionId: string;
  }>;
  whatWorked: string[];
  whatDidNotWork: string[];
  learnedPattern: string;
  competitiveContext: string;
  recommendedApproach: string;
  questionsToAsk: string[];
  risksAndWatchouts: string[];
  supportingEvidence: EvidenceItem[];
  counterEvidence: EvidenceItem[];
  conflicts: MemoryConflict[];
  uncertainties: string[];
  isInsufficientEvidence: boolean;
}
