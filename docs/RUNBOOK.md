# Runbook & Operations Guide

## 1. Local Development Setup

### System Requirements
- Node.js 20.x or higher
- npm 10+
- Optional: Hindsight local instance running via Docker on port 8888

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Seed demo accounts & interactions into Hindsight
npm run seed

# 4. Run development server
npm run dev

# 5. Open browser at http://localhost:3000
```

## 2. Validation & Quality Checks
```bash
# Run Vitest test suite
npm run test

# Run TypeScript typechecker
npm run typecheck

# Verify content submissions (word counts, links, forbidden terms)
npm run content:check

# Run complete end-to-end repository audit
npm run audit
```

## 3. Production Deployment (Vercel)
1. Push repository to GitHub: `git push -u origin main`.
2. Import project into Vercel.
3. Set environment variables:
   - `HINDSIGHT_BASE_URL` (e.g. `https://api.hindsight.vectorize.io` or self-hosted endpoint)
   - `HINDSIGHT_API_KEY`
   - `HINDSIGHT_BANK_ID` (default: `deal-memory-demo`)
4. Deploy and verify `/demo` endpoint.
