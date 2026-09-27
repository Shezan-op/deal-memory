# REST API Specification — DealMemory

This document provides the complete API specification for all DealMemory server endpoints hosted under the Next.js App Router (`/api/*`).

---

## 1. Global Standards & Conventions

### 1.1 Headers
| Header | Type | Description |
| :--- | :--- | :--- |
| `Content-Type` | String | `application/json` (Required on all `POST` requests). |
| `x-forwarded-for` | String | Client IP used by the rate limiter and audit logger. |
| `x-demo-admin-key` | String | Required for `/api/demo/reset` when `DEMO_ADMIN_KEY` is configured in production. |

### 1.2 Rate Limiting (OWASP ASVS V13)
All endpoints enforce sliding-window token bucket rate limits:
- Standard reads: **60 requests/minute** per IP.
- AI Preparation briefs (`/prepare`): **20 requests/minute** per IP.
- Responses on limit breach: `429 Too Many Requests` with a `Retry-After: <seconds>` header.

### 1.3 Error Format
```json
{
  "error": "Human readable error message",
  "code": "BAD_REQUEST",
  "timestamp": "2026-09-28T02:00:00.000Z"
}
```

---

## 2. Deal Management Endpoints

### 2.1 List All Deals
`GET /api/deals`
Returns all deals in the organization with summaries, stages, values, and open objections.

**Response `200 OK`**:
```json
[
  {
    "id": "deal-acme-001",
    "name": "Enterprise Intelligence Platform Expansion",
    "companyId": "comp-acme",
    "companyName": "Acme Corporation",
    "stage": "technical-validation",
    "value": 120000,
    "lastInteractionDate": "2026-03-24T14:30:00.000Z",
    "openObjections": [
      "Implementation complexity and migration risk from legacy systems",
      "Security review and Okta SSO compliance verification",
      "Budget scrutiny following recent corporate belt-tightening"
    ]
  }
]
```

### 2.2 Get Deal Details
`GET /api/deals/:dealId`
Returns complete account metadata, stage history, and stakeholder directory.

**Response `200 OK`**:
```json
{
  "id": "deal-acme-001",
  "name": "Enterprise Intelligence Platform Expansion",
  "company": {
    "id": "comp-acme",
    "name": "Acme Corporation",
    "industry": "Enterprise SaaS",
    "size": "5,000+ employees"
  },
  "stakeholders": [
    {
      "id": "stk-001",
      "name": "Sarah Chen",
      "role": "VP of Engineering",
      "stance": "Champion",
      "concerns": ["Security & SOC 2"]
    }
  ]
}
```

### 2.3 Get Interaction Timeline
`GET /api/deals/:dealId/timeline`
Returns chronological interaction touchpoints, attempted actions, notes, and outcome statuses.

**Response `200 OK`**:
```json
[
  {
    "id": "int-004",
    "dealId": "deal-acme-001",
    "date": "2026-03-24T14:30:00.000Z",
    "channel": "video-call",
    "summary": "Technical architecture validation with Sarah Chen and Dave Miller.",
    "attemptedAction": "Presented phased migration roadmap and Okta SSO architecture.",
    "outcome": "progressed",
    "notes": "Pilot scope confirmed for Q2."
  }
]
```

### 2.4 Inspect Deal Memory
`GET /api/deals/:dealId/memory`
Retrieves retained observations, mental models, and raw memories directly from the Hindsight bank.

**Response `200 OK`**:
```json
{
  "dealId": "deal-acme-001",
  "bankId": "deal-memory-demo",
  "retainedDocumentCount": 8,
  "memoryUnits": [
    {
      "documentId": "deal:acme-001:interaction:int-004",
      "type": "interaction",
      "summary": "Technical architecture review",
      "tags": ["stage:technical-validation", "outcome:progressed"]
    }
  ]
}
```

---

## 3. Deal Intelligence Endpoints

### 3.1 Generate Next Meeting Preparation Brief
`POST /api/deals/:dealId/prepare`
Queries Hindsight, recalls past interactions, analyzes what worked vs stalled, detects budget/scope conflicts, and synthesizes an actionable preparation brief.

**Request Body**:
```json
{
  "memoryMode": "on",
  "representativeGoal": "Advance deal to contract negotiation"
}
```

**Response `200 OK`**:
```json
{
  "dealId": "deal-acme-001",
  "dealName": "Enterprise Intelligence Platform Expansion",
  "companyName": "Acme Corporation",
  "stage": "technical-validation",
  "memoryMode": "on",
  "recommendedStrategy": "Focus on the phased migration roadmap and concrete Okta SSO deployment schedule. Avoid proposing additional discounts, as previous 15% discount stall the deal.",
  "whatWorked": [
    "Presenting an phased architectural migration roadmap",
    "Providing technical sandbox environment with Okta integration"
  ],
  "whatStalled": [
    "Offering a 15% pricing discount before technical validation was confirmed"
  ],
  "questionsToAsk": [
    "Has InfoSec completed review of the SOC 2 Type II report provided on March 24?",
    "Can we confirm the Q2 pilot timeline with Sarah Chen?"
  ],
  "conflicts": [
    {
      "topic": "Budget Variance",
      "description": "Sarah Chen quoted $100,000 budget, while Dave Miller cited an $85,000 corporate cap.",
      "severity": "medium"
    }
  ],
  "evidenceCitations": [
    {
      "documentId": "deal:acme-001:interaction:int-002",
      "snippet": "Offered 15% discount; prospect responded that price is not the issue, migration risk is."
    },
    {
      "documentId": "deal:acme-001:interaction:int-004",
      "snippet": "Demonstrated Okta SSO architecture; team approved moving forward with pilot."
    }
  ]
}
```

---

## 4. Ingestion & Operational Endpoints

### 4.1 Ingest New Interaction
`POST /api/interactions`
Ingests a new sales interaction into the repository and retains it into Hindsight.

**Request Body**:
```json
{
  "dealId": "deal-acme-001",
  "channel": "video-call",
  "summary": "Follow-up discussion on pilot timelines",
  "attendees": ["Sarah Chen", "Dave Miller"],
  "notes": "Discussed phased onboarding and security checkpoints."
}
```

### 4.2 Log Interaction Outcome
`POST /api/outcomes`
Records the outcome of an attempted sales action, creating an outcome memory link in Hindsight.

**Request Body**:
```json
{
  "dealId": "deal-acme-001",
  "interactionId": "int-004",
  "outcome": "progressed",
  "actionAttempted": "Proposed phased 2-week pilot with Okta SSO",
  "notes": "Client accepted the pilot proposal."
}
```

### 4.3 Reset Demo State
`POST /api/demo/reset`
Restores domain fixtures and demo memory state to factory default.

**Headers**:
- `x-demo-admin-key`: Required in production if `DEMO_ADMIN_KEY` is set.
- Blocked in production if `DEMO_RESET_ALLOWED !== "true"`.
