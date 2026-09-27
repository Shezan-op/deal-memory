# DealMemory — Internal Operations & Setup Guide

> **Operational Runbook, Environment Setup, Testing, and Deployment Manual**  
> *For conceptual architecture, data models, and product specification, refer to [DEALMEMORY-SOURCE-OF-TRUTH.md](./DEALMEMORY-SOURCE-OF-TRUTH.md).*

---

## 1. Operational Overview

This manual provides the engineering team with clear procedures for:
- Installing and configuring DealMemory locally.
- Managing environment variables and secret tokens.
- Running the local development server and production builds.
- Executing the test suite (unit, security, chaos, and mutation).
- Testing and debugging Vectorize Hindsight memory connections.
- Troubleshooting common errors and failure modes.
- Deploying to production environments (Vercel, Docker, Node.js).
- Executing administrative procedures (database resets, memory seeding).

---

## 2. Prerequisites

Ensure your host environment meets the following specifications:
- **Node.js**: `v20.x` or higher (tested and verified on Node.js `v24.5.0`).
- **Package Manager**: `npm` `v10.x` or higher.
- **Git**: Modern git client.
- **Operating System**: macOS, Linux, or Windows (PowerShell / WSL).
- **Vectorize Hindsight Instance**:
  - Local Docker container (`http://localhost:8888`), **OR**
  - Hosted Hindsight Cloud endpoint, **OR**
  - Offline mode (DealMemory automatically falls back to domain repository heuristics if Hindsight is unavailable).

---

## 3. How to Install

```bash
# 1. Clone the repository
git clone https://github.com/Shezan-op/deal-memory.git
cd deal-memory

# 2. Install all dependencies strictly from lockfile
npm ci
```

---

## 4. Environment Configuration

Copy the example environment template to create your local environment file:

```bash
cp .env.example .env.local
```

### Environment Variables Matrix

| Variable | Description | Required | Default | Notes |
| :--- | :--- | :---: | :--- | :--- |
| `HINDSIGHT_BASE_URL` | Base URL for Vectorize Hindsight API | **Yes** | `http://localhost:8888` | In production, use your Hindsight Cloud URL. |
| `HINDSIGHT_API_KEY` | Bearer authentication key for Hindsight | Optional | `test-api-key` | Required if connecting to secured Hindsight cluster. |
| `HINDSIGHT_BANK_ID` | Default memory bank identifier | **Yes** | `deal-memory-demo` | Enforces namespace isolation. |
| `DEMO_ADMIN_KEY` | Secret token to authorize demo DB resets | Optional | None | Protects `POST /api/demo/reset` against abuse. |
| `DEMO_RESET_ALLOWED` | Boolean flag enabling demo DB resets | Optional | `false` | Must be explicitly `true` in production to allow reset. |

---

## 5. How to Start the Project

### Local Development Server
```bash
# 1. Seed demo dataset into memory
npm run seed

# 2. Start Next.js development server with Turbopack
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- To access the interactive pre-call briefing: [http://localhost:3000/deals/deal-acme-001/prepare](http://localhost:3000/deals/deal-acme-001/prepare)
- To access the guided evaluation walkthrough: [http://localhost:3000/demo](http://localhost:3000/demo)
- To access the standalone simulation: [http://localhost:3000/gamified.html](http://localhost:3000/gamified.html)

---

## 6. How to Build & Run Production Locally

```bash
# 1. Compile production build with Turbopack
npm run build

# 2. Start the optimized standalone Node.js production server
npm run start
```
The server will bind to port `3000` by default.

---

## 7. How to Test

DealMemory includes an extensive automated test suite covering unit logic, access control, prompt injection, chaos engineering, rate limiting, and concurrency.

### Running Test Commands

| Command | Target / Scope |
| :--- | :--- |
| `npm run test` | Executes all 57 Vitest tests across 10 test suites. |
| `npm run test:unit` | Runs domain and repository unit tests only. |
| `npm run test:integration` | Runs security, rate-limiting, and chaos engineering tests. |
| `npm run security:smoke` | Fast pre-push security assertion check. |
| `npm run typecheck` | Validates strict TypeScript compilation (`tsc --noEmit`). |
| `npm run docs:check` | Verifies all 40 required documentation specifications exist. |
| `npm run final:audit` | Runs comprehensive repository integrity audit. |

---

## 8. How to Test Vectorize Hindsight

### Option A: Local Docker Container
Run a local Vectorize Hindsight server instance via Docker:
```bash
docker run -d \
  -p 8888:8888 \
  -e HINDSIGHT_API_KEY=test-api-key \
  --name hindsight-server \
  vectorize/hindsight:latest
```
Verify the container is healthy:
```bash
curl -I http://localhost:8888/health
```

### Option B: Hindsight Cloud
Set your cloud credentials in `.env.local`:
```env
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=vct_live_your_secret_key_here
HINDSIGHT_BANK_ID=deal-memory-production
```

### Option C: Verifying Offline Fallback
DealMemory is engineered with automatic graceful degradation:
1. Stop your local Hindsight server or set `HINDSIGHT_BASE_URL=http://localhost:9999`.
2. Navigate to `/deals/deal-acme-001/prepare`.
3. Notice that the pre-call brief generates seamlessly using local domain heuristics without crashing the server.

---

## 9. Common Commands Reference

```bash
# Seed initial demo dataset
npm run seed

# Run local development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Run test suite
npm run test

# Run documentation check
npm run docs:check

# Run dependency vulnerability audit
npm run security:deps

# Run secret scanning audit
npm run security:secrets

# Run final comprehensive repository audit
npm run final:audit
```

---

## 10. Troubleshooting & Common Errors

### 1. Port 3000 in Use
- **Error**: `EADDRINUSE: address already in use :::3000`
- **Resolution**:
  - Kill the existing process:
    - On macOS/Linux: `lsof -ti:3000 | xargs kill -9`
    - On Windows (PowerShell): `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force`
  - Or start on an alternate port: `npm run dev -- -p 3001`

### 2. Hindsight Connection Refused (`ECONNREFUSED`)
- **Error in console**: `Hindsight recall encountered error ... fetch failed`
- **Expected Behavior**: This is normal when running without a live Hindsight instance. DealMemory automatically catches the error and falls back to local domain intelligence without throwing an unhandled exception.
- **To Connect Live**: Ensure Docker is running or provide valid credentials in `.env.local`.

### 3. Missing `.env.local`
- **Error**: API requests fail with validation or configuration errors.
- **Resolution**: Run `cp .env.example .env.local` and restart the server.

### 4. Turbopack Root Warning
- **Warning**: `Next.js ignored package-lock.json in C:\Users\... because it is outside the current Git repository`
- **Resolution**: Harmless warning when developing inside a subdirectory. Can be silenced by specifying `turbopack.root` in `next.config.ts`.

---

## 11. Deployment Procedures

### Deploying to Vercel
1. Push repository to GitHub.
2. Import project into Vercel Dashboard.
3. Configure Environment Variables in Project Settings:
   - `HINDSIGHT_BASE_URL`
   - `HINDSIGHT_API_KEY`
   - `HINDSIGHT_BANK_ID`
   - `DEMO_ADMIN_KEY`
   - `DEMO_RESET_ALLOWED=true`
4. Set Build Command: `npm run build`
5. Deploy.

### Deploying via Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 12. Administrative & Reset Procedures

### Demo Database Reset
To return the in-memory repository to its pristine seed state:
```bash
# Local development (DEMO_ADMIN_KEY not required if in dev mode)
curl -X POST http://localhost:3000/api/demo/reset

# Production environment (requires x-demo-admin-key header)
curl -X POST https://your-domain.com/api/demo/reset \
  -H "x-demo-admin-key: your-configured-admin-token"
```

---

## 13. Security Maintenance & Token Rotation

1. **Hindsight API Key Rotation**: Update `HINDSIGHT_API_KEY` in `.env.local` or cloud provider environment settings. Zero application restart downtime is incurred.
2. **Demo Admin Key Rotation**: Update `DEMO_ADMIN_KEY` immediately if administrative endpoints show suspicious activity.
3. **Audit Frequency**: Run `npm run security:secrets` and `npm run security:deps` prior to every release.
