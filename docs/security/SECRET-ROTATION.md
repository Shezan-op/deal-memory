# DealMemory Secret Rotation Runbook

## Overview
This runbook details zero-downtime secret rotation procedures for all credentials used across DealMemory development, staging, and production environments.

> **CRITICAL DIRECTIVE**: Never commit real secrets, API keys, or private tokens to this document or any file in the repository.

---

## 1. Secrets Inventory

| Secret Identifier | Environment Variable | Usage Scope | Rotation Cadence |
| :--- | :--- | :--- | :--- |
| **Hindsight API Key** | `HINDSIGHT_API_KEY` | Server-side bearer authentication with Vectorize Hindsight cloud | Every 90 days or immediately upon suspected breach |
| **Demo Admin Key** | `DEMO_ADMIN_KEY` | Guard for `/api/demo/reset` and administrative actions | Every 180 days |
| **LLM Provider Key** | `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | Optional upstream foundation model inference | Every 90 days |

---

## 2. Step-by-Step Rotation Procedures

### Procedure 1: Rotating `HINDSIGHT_API_KEY`
1. **Generate Secondary Key**: Log into the Vectorize.io / Hindsight portal. Under Project Settings → API Keys, generate a new secondary key labeled `dealmemory-prod-rotation-[DATE]`.
2. **Deploy to Hosting Provider**:
   - In the hosting management console (e.g. Vercel / Cloudflare), update the `HINDSIGHT_API_KEY` environment variable with the newly generated secondary key.
   - Trigger a rolling deployment of the latest production commit.
3. **Verify Health**:
   - Execute health check verification:
     ```bash
     curl -s https://[YOUR_DOMAIN]/api/health
     ```
   - Confirm Hindsight reports `connected: true`.
4. **Revoke Primary Key**: Once production traffic is successfully serving requests using the new key, return to the Hindsight portal and revoke the old primary key.

### Procedure 2: Rotating `DEMO_ADMIN_KEY`
1. **Generate Cryptographically Secure Token**:
   Generate a high-entropy 256-bit token locally:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **Update Environment Variable**:
   Set `DEMO_ADMIN_KEY` in deployment configuration.
3. **Validate Authorized Access**:
   Test the reset endpoint with the new key:
   ```bash
   curl -X POST https://[YOUR_DOMAIN]/api/demo/reset \
     -H "x-demo-admin-key: [NEW_GENERATED_KEY]"
   ```
   Confirm HTTP 200 response with `{ "success": true }`.
