# DealMemory

> **Outcome-Learning Deal Intelligence via Vectorize Hindsight**  
> *“Every sales conversation becomes experience the next conversation can learn from.”*

---

## What is DealMemory?

DealMemory is an AI-powered deal intelligence application for enterprise sales teams. In long, multi-stakeholder sales cycles, deals often stall because valuable context—such as objections, stakeholder priorities, and past commitments—gets forgotten between calls.

Standard sales AI tools treat every conversation in isolation. DealMemory fixes this by linking attempted sales actions directly to downstream deal outcomes (`PROGRESSED`, `STALLED`, `LOST`, `WON`). Powered by **Vectorize Hindsight**, DealMemory builds persistent organizational memory that equips sales reps before every meeting with evidence-backed strategy briefs grounded in verified historical outcomes.

---

## Why Does It Exist?

Enterprise B2B sales cycles span 3 to 12 months across dozens of meetings. Stateless AI assistants frequently recommend generic tactics (e.g. *"Offer a 15–20% discount if the prospect expresses hesitation"*), unaware that the prospect's CTO already explicitly rejected discounts because engineering migration bandwidth was the real blocker.

DealMemory ensures that:
1. Past objections and stakeholder concerns are never forgotten.
2. The AI actively warns reps against repeating tactics that previously stalled the deal.
3. Successful sales plays are remembered and transferred across the entire sales team.

---

## What Does It Do?

- **Pre-Meeting Intelligence Briefs**: Generates structured preparation briefs citing specific historical interaction IDs.
- **Memory ON vs. Memory OFF Comparison**: An interactive toggle demonstrating the stark difference between stateless LLM amnesia and persistent Hindsight memory.
- **Outcome Feedback Loop**: Directly connects actions taken on calls to downstream deal velocity (`PROGRESSED` vs. `STALLED`).
- **Cross-Deal Knowledge Transfer**: Automatically recalls successful strategies from completed deals when similar objections arise on new opportunities.
- **Chronological Deal Timeline**: Visualizes meetings, notes, objections, and logged outcomes in a single audit trail.

---

## How Hindsight Fits In

Vectorize Hindsight serves as DealMemory's external cognitive memory layer:
- **Retain (`POST /banks/{id}/documents`)**: Ingests meeting transcripts, stakeholder roles, objections, and verified outcome signals using deterministic document IDs.
- **Recall (`POST /banks/{id}/recall`)**: Retrieves tag-scoped prior experiences relevant to the current deal stage and open objections.
- **Reflect (`POST /banks/{id}/reflect`)**: Synthesizes causal patterns across multiple interactions to evaluate what moves the needle versus what stalls the deal.

---

## Key Documentation & Interactive Demos

| Resource | Description |
| :--- | :--- |
| 🏗️ **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | **System Architecture & Design**: Hindsight memory integration, sequence diagrams, 3-tier memory taxonomy, and dataset design. |
| 🔌 **[docs/API.md](./docs/API.md)** | **REST API Reference**: Complete endpoint contracts, request/response JSON schemas, rate limits, and error handling. |
| 📜 **[docs/ADR.md](./docs/ADR.md)** | **Architecture Decision Records**: Consolidated ADR-001 through ADR-008 documenting core design choices. |
| 🎯 **[docs/DEMO-GUIDE.md](./docs/DEMO-GUIDE.md)** | **Demo Walkthrough & Evaluation**: Step-by-step presentation script, pre-flight checklist, and Memory ON/OFF benchmarks. |
| 🛡️ **[docs/SECURITY-MANUAL.md](./docs/SECURITY-MANUAL.md)** | **Enterprise Security Standard**: OWASP ASVS v4.0.3 matrix, STRIDE threat model, prompt injection defense, and incident response. |
| 🛠️ **[internal-setup-guide.md](./internal-setup-guide.md)** | **Operational Runbook**: Installation, environment configuration, testing workflows, deployment procedures, and troubleshooting. |
| 🎮 **[gamified.html](./gamified.html)** | **Interactive Sales Simulation**: Single-file, zero-dependency visual walkthrough showing DealMemory in action during a live enterprise deal. |

---

## Tech Stack

- **Framework**: Next.js 16.3.6 (App Router, Turbopack, React Server Components)
- **UI & Styling**: React 19.2.8, Tailwind CSS v4
- **Language**: TypeScript 5.x (Strict mode)
- **Memory Engine**: Vectorize Hindsight Client (`@vectorize-io/hindsight-client` v0.10.1)
- **Validation**: Zod v3.25.76
- **Test Suite**: Vitest v5.0.2 (57 passing tests)

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Shezan-op/deal-memory.git
cd deal-memory
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- To run the **Interactive Guided Demo**, navigate to `http://localhost:3000/demo`.
- To open the **Single-File Simulation**, open `gamified.html` in any browser or visit `http://localhost:3000/gamified.html`.

### 4. Run Automated Verification
```bash
npm run test         # Run 57 automated Vitest unit & security tests
npm run typecheck    # Validate strict TypeScript compilation
npm run docs:check   # Verify documentation integrity
```

---

## Project Structure

```text
dealmemory/
├── DEALMEMORY-SOURCE-OF-TRUTH.md  # Master architectural source of truth
├── README.md                      # Public introduction and quick start
├── internal-setup-guide.md        # Operations, deployment, and runbook manual
├── gamified.html                  # Standalone interactive sales simulation
├── public/                        # Static assets and public simulation mirror
├── src/
│   ├── app/                       # Next.js App Router (pages and /api routes)
│   ├── components/                # Reusable UI components
│   └── lib/                       # Domain logic, Hindsight provider, in-memory store
├── tests/                         # Vitest test suites (security, chaos, domain)
└── docs/                          # Architecture decision records & security matrices
```

---

## License

Apache-2.0 License. See [LICENSE](./LICENSE) for details.
