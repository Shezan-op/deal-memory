import { Company, Stakeholder, Deal, Interaction } from '../domain/models';

export const DEMO_COMPANIES: Company[] = [
  {
    id: 'acme-corp',
    name: 'Acme Corporation',
    industry: 'Enterprise Logistics & Supply Chain',
    employeeCount: 4200,
    annualRevenue: '$850M',
    techStack: ['Salesforce', 'SAP', 'AWS', 'Okta SSO', 'Snowflake'],
  },
  {
    id: 'novatech-solutions',
    name: 'NovaTech Financial',
    industry: 'Fintech & Wealth Management',
    employeeCount: 1800,
    annualRevenue: '$320M',
    techStack: ['HubSpot', 'PostgreSQL', 'Azure', 'Auth0'],
  },
  {
    id: 'strata-health',
    name: 'Strata Health Systems',
    industry: 'Healthcare Technology',
    employeeCount: 950,
    annualRevenue: '$140M',
    techStack: ['Epic EHR Integration', 'AWS GovCloud', 'Datadog'],
  },
];

export const DEMO_STAKEHOLDERS: Stakeholder[] = [
  // Acme Corp
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    title: 'Chief Technology Officer',
    role: 'decision-maker',
    email: 'm.vance@acmecorp.com',
    priorities: ['System uptime', 'API scalability', 'Minimizing engineer downtime during migration'],
    personality: 'Pragmatic, detail-oriented, skeptical of aggressive sales tactics',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    title: 'Chief Financial Officer',
    role: 'economic-buyer',
    email: 'e.rostova@acmecorp.com',
    priorities: ['Predictable OPEX', 'Strict budgetary limits', 'Defensible ROI calculations'],
    personality: 'Numbers-driven, checks contract terms rigorously',
  },
  {
    id: 'david-kim',
    name: 'David Kim',
    title: 'VP of Information Security',
    role: 'technical-evaluator',
    email: 'd.kim@acmecorp.com',
    priorities: ['SOC2 Type II compliance', 'Zero-trust architecture', 'Single Sign-On (Okta)'],
    personality: 'Thorough, risk-averse, requires documented verification',
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    title: 'Director of RevOps',
    role: 'champion',
    email: 's.jenkins@acmecorp.com',
    priorities: ['Rep productivity', 'Salesforce data consistency', 'Fast onboarding'],
    personality: 'Enthusiastic internal sponsor, eager to modernize tooling',
  },

  // NovaTech
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    title: 'Head of Engineering',
    role: 'technical-evaluator',
    email: 'jordan.lee@novatech.io',
    priorities: ['Data isolation', 'Latency SLAs under 100ms'],
  },
  {
    id: 'claire-dubois',
    name: 'Claire Dubois',
    title: 'Chief Operating Officer',
    role: 'decision-maker',
    email: 'c.dubois@novatech.io',
    priorities: ['Vendor consolidation', 'Contract flexibility'],
  },

  // Strata Health
  {
    id: 'dr-arun-patel',
    name: 'Dr. Arun Patel',
    title: 'Chief Information Officer',
    role: 'decision-maker',
    email: 'apatel@stratahealth.org',
    priorities: ['HIPAA compliance', 'Audit trail permanence'],
  },
];

export const DEMO_DEALS: Deal[] = [
  {
    id: 'deal-acme-001',
    companyId: 'acme-corp',
    companyName: 'Acme Corporation',
    title: 'Enterprise Intelligence Platform Expansion',
    value: 185000,
    stage: 'technical-validation',
    status: 'active',
    stakeholderIds: ['marcus-vance', 'elena-rostova', 'david-kim', 'sarah-jenkins'],
    openObjections: [
      'Implementation complexity and migration risk from legacy systems',
      'Security review and Okta SSO compliance verification',
      'Budget scrutiny following recent corporate belt-tightening',
    ],
    competitors: ['Gong', 'Clari'],
    lastInteractionDate: '2026-09-24T15:30:00Z',
    nextScheduledDate: '2026-10-02T14:00:00Z',
    interactionCount: 12,
  },
  {
    id: 'deal-nova-002',
    companyId: 'novatech-solutions',
    companyName: 'NovaTech Financial',
    title: 'Financial Services Memory Layer',
    value: 95000,
    stage: 'pricing-negotiation',
    status: 'active',
    stakeholderIds: ['jordan-lee', 'claire-dubois'],
    openObjections: ['Pricing tiers based on seat count vs usage volume'],
    competitors: ['Internal Custom Build'],
    lastInteractionDate: '2026-09-21T11:00:00Z',
    nextScheduledDate: '2026-09-30T16:00:00Z',
    interactionCount: 6,
  },
  {
    id: 'deal-strata-003',
    companyId: 'strata-health',
    companyName: 'Strata Health Systems',
    title: 'Clinical Workflow Memory Integration',
    value: 120000,
    stage: 'discovery',
    status: 'stalled',
    stakeholderIds: ['dr-arun-patel'],
    openObjections: ['Unclear BAA signing requirements', 'Waiting on Q4 budget release'],
    competitors: [],
    lastInteractionDate: '2026-08-15T10:00:00Z',
    interactionCount: 2,
  },
];

/**
 * 22 Rich, realistic, coherent B2B interactions across multiple companies.
 * The flagship Acme Corp story deliberately demonstrates:
 * 1. Initial discovery & implementation hesitation
 * 2. Rep attempts a 20% discount to overcome hesitation -> NO PROGRESSION / STALLED
 * 3. Marcus reiterates that price wasn't the issue; migration downtime is
 * 4. Rep introduces a phased 30-day sandbox migration roadmap -> CTO ACCEPTS TECHNICAL VALIDATION
 * 5. David Kim raises InfoSec/Okta SSO validation -> rep provides SOC2 Type II package
 * 6. Elena raises budget conflict ($100k initial guidance shifted down to $85k after quarterly review)
 * 7. Later interaction: the agent uses accumulated experience to recommend implementation guarantees over discounting
 */
export const DEMO_INTERACTIONS: Interaction[] = [
  // --- ACME CORP INTERACTION SEQUENCE ---
  {
    id: 'acme-001',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['sarah-jenkins'],
    timestamp: '2026-08-02T14:00:00Z',
    channel: 'call',
    stage: 'discovery',
    participants: ['Sarah Jenkins (RevOps)', 'Alex Miller (AE)'],
    context: 'Initial inbound qualification after product demo at SaaStr conference.',
    rawContent: `Sarah Jenkins: We are currently losing institutional memory every time an account executive leaves the team. Our reps take notes in Salesforce, but nobody reads 40 paragraphs of notes before a renewal or expansion call. We need a system that remembers previous objections, what we offered, and what actually closed deals.
Alex Miller: That's exactly our design thesis. How large is the deployment you're evaluating?
Sarah Jenkins: Approximately 60 enterprise account executives across North America and EMEA. Budget has been preliminarily targeted around $100,000 for fiscal year 2027.`,
    objections: ['Institutional knowledge loss', 'Salesforce note bloat'],
    actionAttempted: 'Qualified scope and high-level requirements',
    outcome: {
      outcomeType: 'PROGRESSED',
      summary: 'Champion qualified initial problem and confirmed $100k budget target.',
      reason: 'Sarah has direct executive mandate from VP of Sales to fix rep ramp time.',
      nextStep: 'Schedule technical discovery with CTO Marcus Vance.',
      actionTaken: 'Sent follow-up overview deck and scheduled technical discovery.',
      timestamp: '2026-08-02T15:00:00Z',
    },
  },
  {
    id: 'acme-002',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['marcus-vance', 'sarah-jenkins'],
    timestamp: '2026-08-10T16:00:00Z',
    channel: 'meeting',
    stage: 'discovery',
    participants: ['Marcus Vance (CTO)', 'Sarah Jenkins (RevOps)', 'Alex Miller (AE)'],
    context: 'Technical discovery call focusing on system architecture and integration overhead.',
    rawContent: `Marcus Vance: Look, I get the sales pitch. But we already spent 14 months migrating our CRM stack into Salesforce and Snowflake. My engineering team does not have the bandwidth for a massive, multi-month integration project. If this tool requires engineering sprint commitments to configure pipelines or sync webhooks, it's dead on arrival.
Alex Miller: We offer turnkey sync with bi-directional webhooks.
Marcus Vance: Every vendor says turnkey. Show me how much engineering lift is actually required. Until I have guarantees that our production pipelines won't suffer downtime, I cannot approve this rollout.`,
    objections: ['Implementation complexity and migration risk from legacy systems'],
    actionAttempted: 'Explained turnkey architecture and standard SLA terms',
    outcome: {
      outcomeType: 'STALLED',
      summary: 'CTO skeptical of integration lift; refused to proceed without technical proof.',
      reason: 'Marcus had bad prior experiences with vendors claiming turnkey integrations.',
      nextStep: 'Provide concrete engineering resource requirements.',
      actionTaken: 'Attempted to reassure verbally without documentation.',
      timestamp: '2026-08-10T17:15:00Z',
    },
  },
  {
    id: 'acme-003',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['marcus-vance', 'elena-rostova'],
    timestamp: '2026-08-18T11:00:00Z',
    channel: 'meeting',
    stage: 'qualification',
    participants: ['Marcus Vance (CTO)', 'Elena Rostova (CFO)', 'Alex Miller (AE)'],
    context: 'Follow-up discussion where sales rep made a tactical error by offering a price concession instead of addressing technical migration concerns.',
    rawContent: `Alex Miller: Marcus, Elena, thank you for jumping on. To help remove the hesitation on moving forward this quarter, our executive team has approved a 20% discount on year one licensing, bringing the initial contract from $120,000 down to $96,000 if we execute by end of month.
Marcus Vance: Alex, you're not listening to me. A 20% discount doesn't write our database migration scripts or prevent my engineers from working weekends. Price is not the issue here. Risk to our existing pipeline is the issue. Giving me a discount when I asked for architectural proof makes me feel like you don't understand enterprise operations.
Elena Rostova: I appreciate the pricing consciousness, but Marcus is correct. We don't buy software just because it is discounted if implementation risks derail our operations.`,
    objections: ['Implementation complexity and migration risk from legacy systems'],
    actionAttempted: 'Offered 20% commercial discount to accelerate closing',
    outcome: {
      outcomeType: 'NO_CHANGE',
      summary: 'Discount was completely ineffective and frustrated the CTO.',
      reason: 'The objection is operational migration risk, not budgetary cost. Concession perceived as tone-deaf.',
      nextStep: 'Regroup and address technical implementation directly.',
      actionTaken: 'Offered 20% discount on first-year contract.',
      stakeholderReaction: 'Marcus was noticeably irritated; Elena reinforced Marcus stance.',
      timestamp: '2026-08-18T12:00:00Z',
    },
  },
  {
    id: 'acme-004',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['marcus-vance', 'sarah-jenkins'],
    timestamp: '2026-08-28T15:00:00Z',
    channel: 'technical-deep-dive',
    stage: 'technical-validation',
    participants: ['Marcus Vance (CTO)', 'Sarah Jenkins (RevOps)', 'Alex Miller (AE)', 'Priya Sharma (Solutions Architect)'],
    context: 'Pivoted approach: Introduced phased 30-day migration sandbox roadmap with dedicated engineering support.',
    rawContent: `Priya Sharma: Marcus, we heard your concerns from our last session. Today we brought our Lead Solutions Architect and zero sales slides. We prepared a 30-day phased migration sandbox plan. Phase 1 is read-only historical memory ingestion running entirely in parallel without touching your production Salesforce triggers. Phase 2 is a 5-user sandbox pilot. Phase 3 is automated regression validation. We commit 40 hours of our solutions engineering team to build the connectors.
Marcus Vance: Now this is what I needed to see. The read-only parallel staging address my core fear about webhook collisions. If your engineers own the connector build during the sandbox period, that removes the burden from our sprint backlog. Let's schedule the technical validation session for next week.`,
    objections: ['Implementation complexity and migration risk from legacy systems'],
    actionAttempted: 'Presented 30-day phased migration sandbox roadmap with committed engineering hours',
    outcome: {
      outcomeType: 'PROGRESSED',
      summary: 'CTO approved technical validation phase after receiving structured migration roadmap.',
      reason: 'Clear operational risk mitigation and dedicated vendor engineering hours resolved the fear of team overload.',
      nextStep: 'Schedule technical validation session and initiate security evaluation.',
      actionTaken: 'Presented phased migration architecture with zero-downtime sandbox guarantee.',
      stakeholderReaction: 'Marcus was enthusiastic, took screenshots of the roadmap slide, and committed calendar time.',
      timestamp: '2026-08-28T16:30:00Z',
    },
  },
  {
    id: 'acme-005',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['david-kim', 'marcus-vance'],
    timestamp: '2026-09-05T14:30:00Z',
    channel: 'meeting',
    stage: 'technical-validation',
    participants: ['David Kim (VP InfoSec)', 'Marcus Vance (CTO)', 'Alex Miller (AE)'],
    context: 'Security and governance review.',
    rawContent: `David Kim: We store sensitive customer transaction notes in our CRM. Any memory layer that ingests sales conversations must comply with our zero-trust tenant isolation standards. We need Okta SAML 2.0 with SCIM provisioning, encryption in transit and at rest using AES-256, and verified SOC2 Type II audit documentation.
Alex Miller: We enforce strict tenant isolation where each enterprise organization operates within an isolated memory bank with independent encryption keys. We support Okta SSO via SAML 2.0.
David Kim: Send over the SOC2 report and CAIQ questionnaire. We need 10 business days for our security council to sign off.`,
    objections: ['Security review and Okta SSO compliance verification'],
    actionAttempted: 'Outlined bank tenant isolation and shared SOC2 Type II portal link',
    outcome: {
      outcomeType: 'NEXT_STEP_CONFIRMED',
      summary: 'Security lead accepted documentation and initiated formal vendor security review.',
      reason: 'Architecture documentation directly addressed tenant isolation and encryption standards.',
      nextStep: 'Complete InfoSec questionnaire and wait for sign-off.',
      actionTaken: 'Delivered security whitepaper, compliance audit, and CAIQ response package.',
      timestamp: '2026-09-05T15:45:00Z',
    },
  },
  {
    id: 'acme-006',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['elena-rostova'],
    timestamp: '2026-09-12T10:00:00Z',
    channel: 'call',
    stage: 'pricing-negotiation',
    participants: ['Elena Rostova (CFO)', 'Alex Miller (AE)'],
    context: 'Budget update call revealing conflicting guidance from earlier interaction.',
    rawContent: `Elena Rostova: Alex, I wanted to give you advance notice before our next executive committee meeting. Our board just conducted a mid-year budget reallocation. While Sarah originally mentioned $100,000 for this initiative, our strict department cap for new software in Q4 has been adjusted down to $85,000.
Alex Miller: I appreciate the transparency, Elena. Does that $85k cap include implementation services, or is that purely software licensing?
Elena Rostova: That is all-inclusive for year one. Any proposal exceeding $85,000 will require a secondary board-level exception, which will delay our kickoff until Q1 next year. If you can configure a tier that fits within $85,000 with our required 50 core users, I can approve it under my executive threshold.`,
    objections: ['Budget scrutiny following recent corporate belt-tightening'],
    actionAttempted: 'Clarified scope of budgetary cap and explored phased seat deployment',
    outcome: {
      outcomeType: 'POSITIVE_SIGNAL',
      summary: 'CFO provided clear approval criteria: all-inclusive $85k contract allows immediate sign-off.',
      reason: 'Elena gave explicit guidance on her autonomous approval limits to avoid board delay.',
      nextStep: 'Structure contract with 50 core seats at $85k with option to expand.',
      actionTaken: 'Captured budget conflict ($100k earlier vs $85k actual hard cap).',
      timestamp: '2026-09-12T11:00:00Z',
    },
  },
  {
    id: 'acme-007',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['david-kim'],
    timestamp: '2026-09-19T16:00:00Z',
    channel: 'email',
    stage: 'technical-validation',
    participants: ['David Kim (VP InfoSec)', 'Alex Miller (AE)'],
    context: 'Security review completion notification.',
    rawContent: `Email from David Kim:
"Alex, our InfoSec assessment is complete. The tenant isolation model using dedicated Hindsight memory banks meets our data classification standards. Okta SAML configuration has passed preliminary sandbox testing. We have approved DealMemory for deployment pending final MSA execution."`,
    objections: [],
    actionAttempted: 'Followed up on security review milestones',
    outcome: {
      outcomeType: 'PROGRESSED',
      summary: 'InfoSec officially approved the platform architecture and Okta integration.',
      reason: 'Architecture verified as true multi-tenant isolated memory with no co-mingled data.',
      nextStep: 'Final commercial alignment with Elena and Sarah.',
      actionTaken: 'Logged formal security clearance in deal notes.',
      timestamp: '2026-09-19T16:15:00Z',
    },
  },
  {
    id: 'acme-008',
    dealId: 'deal-acme-001',
    companyId: 'acme-corp',
    contactIds: ['sarah-jenkins', 'marcus-vance'],
    timestamp: '2026-09-24T15:30:00Z',
    channel: 'meeting',
    stage: 'technical-validation',
    participants: ['Sarah Jenkins (RevOps)', 'Marcus Vance (CTO)', 'Alex Miller (AE)'],
    context: 'Technical validation pilot review meeting.',
    rawContent: `Sarah Jenkins: The 5-user pilot group completed their second week. Reps reported an average time savings of 45 minutes per discovery prep call because the memory layer retrieved the exact objections previously raised by our enterprise target accounts.
Marcus Vance: From an infrastructure standpoint, the read-only connector behaved cleanly. No spikes on our Salesforce API quota. If the commercial terms align with Elena's budget, engineering will sign off on the full 60-seat deployment.`,
    objections: [],
    actionAttempted: 'Presented pilot usage telemetry and rep satisfaction metrics',
    outcome: {
      outcomeType: 'PROGRESSED',
      summary: 'Pilot succeeded across both business metrics (45m saved/call) and technical stability.',
      reason: 'Pilot proved both business value and absence of engineering drag.',
      nextStep: 'Prepare final commercial proposal meeting with Elena Rostova.',
      actionTaken: 'Agreed on final contract presentation date for October 2.',
      timestamp: '2026-09-24T16:45:00Z',
    },
  },

  // --- COMPARABLE ACCOUNT 1: NOVATECH ---
  {
    id: 'nova-001',
    dealId: 'deal-nova-002',
    companyId: 'novatech-solutions',
    contactIds: ['jordan-lee'],
    timestamp: '2026-08-14T11:00:00Z',
    channel: 'meeting',
    stage: 'discovery',
    participants: ['Jordan Lee (Head of Eng)', 'Chris Taylor (AE)'],
    context: 'Evaluation of memory layer for wealth advisory representatives.',
    rawContent: `Jordan Lee: We cannot tolerate latency above 120ms when our advisors are on calls with high-net-worth clients. Also, our compliance officers require that every recommendation cites exact historical data without AI fabrication.
Chris Taylor: We provide sub-80ms recall response times and an explicit evidence attribution model where every claim links directly to historical interactions.`,
    objections: ['System latency SLAs', 'Compliance verification of AI claims'],
    actionAttempted: 'Presented API benchmarks and fact-attribution schema',
    outcome: {
      outcomeType: 'PROGRESSED',
      summary: 'Engineering head validated low-latency recall capabilities.',
      reason: 'Benchmarked results satisfied the 120ms latency SLA.',
      nextStep: 'Commercial review with COO Claire Dubois.',
      actionTaken: 'Executed benchmark in client sandbox environment.',
      timestamp: '2026-08-14T12:00:00Z',
    },
  },
  {
    id: 'nova-002',
    dealId: 'deal-nova-002',
    companyId: 'novatech-solutions',
    contactIds: ['claire-dubois', 'jordan-lee'],
    timestamp: '2026-09-02T14:00:00Z',
    channel: 'meeting',
    stage: 'pricing-negotiation',
    participants: ['Claire Dubois (COO)', 'Jordan Lee (Head of Eng)', 'Chris Taylor (AE)'],
    context: 'Contract structuring discussion.',
    rawContent: `Claire Dubois: We want flexibility. We don't want to be locked into an annual minimum seat commitment if our market hiring slows down.
Chris Taylor: We structured a hybrid tier with a base platform fee and quarterly seat reconciliations.
Claire Dubois: That provides the operational flexibility we require. Send the draft contract for legal review.`,
    objections: ['Rigid annual contract structures'],
    actionAttempted: 'Offered quarterly flexible seat reconciliation model',
    outcome: {
      outcomeType: 'PROGRESSED',
      summary: 'COO agreed to pricing framework after contract flexibility was provided.',
      reason: 'Removing rigid 12-month lock-in on seat counts addressed risk management priorities.',
      nextStep: 'Final legal redlines.',
      actionTaken: 'Delivered revised order form with quarterly adjustment clauses.',
      timestamp: '2026-09-02T15:30:00Z',
    },
  },

  // --- COMPARABLE ACCOUNT 2: STRATA HEALTH (STALLED EXAMPLE) ---
  {
    id: 'strata-001',
    dealId: 'deal-strata-003',
    companyId: 'strata-health',
    contactIds: ['dr-arun-patel'],
    timestamp: '2026-07-20T10:00:00Z',
    channel: 'meeting',
    stage: 'discovery',
    participants: ['Dr. Arun Patel (CIO)', 'Jessica Wong (AE)'],
    context: 'Initial hospital system discovery.',
    rawContent: `Dr. Arun Patel: We deal with protected health information under strict HIPAA jurisdiction. We cannot deploy any AI memory architecture that does not execute a Business Associate Agreement (BAA) and provide dedicated isolated infrastructure.
Jessica Wong: Let me check with our legal team on our BAA policies. In the meantime, would you like to review our product roadmap?
Dr. Arun Patel: Jessica, if you cannot confirm BAA execution today, reviewing roadmap features is premature. Let me know when your legal team has an answer.`,
    objections: ['HIPAA BAA requirement', 'Clinical compliance audit'],
    actionAttempted: 'Deflected compliance question to discuss product roadmap features',
    outcome: {
      outcomeType: 'STALLED',
      summary: 'Deal stalled because representative failed to address compliance question directly.',
      reason: 'Attempting to pivot to generic feature demos when enterprise buyers raise legal/compliance requirements creates distrust.',
      nextStep: 'Provide legal BAA confirmation.',
      actionTaken: 'Deferred legal review without concrete timeline.',
      timestamp: '2026-07-20T11:15:00Z',
    },
  },
  {
    id: 'strata-002',
    dealId: 'deal-strata-003',
    companyId: 'strata-health',
    contactIds: ['dr-arun-patel'],
    timestamp: '2026-08-15T10:00:00Z',
    channel: 'email',
    stage: 'discovery',
    participants: ['Dr. Arun Patel (CIO)', 'Jessica Wong (AE)'],
    context: 'Follow up on BAA status.',
    rawContent: `Jessica Wong: Dr. Patel, our legal team has confirmed we can sign standard BAAs on enterprise tier agreements with annual minimums of $120,000.
Dr. Arun Patel: Thank you for following up. Unfortunately our capital allocation cycle for this quarter closed on August 1st. We have deferred this initiative to Q1 2027.`,
    objections: ['Timing and budget freeze'],
    actionAttempted: 'Confirmed BAA availability',
    outcome: {
      outcomeType: 'STALLED',
      summary: 'Opportunity deferred to next fiscal year due to delayed compliance response.',
      reason: 'The 3-week delay in answering the compliance question missed the hospital quarterly budget window.',
      nextStep: 'Check in November 2026 for Q1 2027 budgeting.',
      actionTaken: 'Updated CRM stage to Stalled / Nurture.',
      timestamp: '2026-08-15T10:45:00Z',
    },
  },
];
