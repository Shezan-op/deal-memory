# DealMemory Demo & Screen-Recording Security Checklist

## Overview
This checklist must be verified prior to recording walkthrough videos, capturing promotional screenshots, or conducting public demonstration sessions.

---

## Pre-Recording Verification Gates

### 1. Secret & Credential Sanitization
- [ ] **No Exposed API Keys in Video/Terminal**: Ensure terminal prompt does not display `.env` values, `HINDSIGHT_API_KEY`, or `DEMO_ADMIN_KEY`.
- [ ] **Clean Browser Console**: Open DevTools before recording and confirm zero API keys or authentication headers are dumped to `console.log`.
- [ ] **Network Tab Sanitization**: Ensure sensitive authorization headers or bearer tokens are filtered or closed during screen capture.
- [ ] **Clean Shell History**: Ensure terminal history does not display raw `curl` commands with Authorization headers.

### 2. Synthetic Data Purity
- [ ] **100% Synthetic B2B Accounts**: Confirm all showcased companies are fictional:
  - `Acme Corporation` (Enterprise Logistics & Supply Chain)
  - `NovaTech Financial` (Fintech & Wealth Management)
  - `Strata Health Systems` (Healthcare Technology)
- [ ] **Synthetic Stakeholder Profiles**: Confirm all stakeholder email addresses use fictional domains (`@acmecorp.com`, `@novatech.io`, `@stratahealth.org`). Zero real customer personal data exists in seed data.

### 3. State & Reset Security
- [ ] **Demo Mode Visual Clarity**: Confirm demo banner clearly indicates whether Memory is active (Memory ON) or disabled (Memory OFF).
- [ ] **Reset Endpoint Authorization**: Verify `/api/demo/reset` is protected and does not reset arbitrary external banks.
- [ ] **Clean Initial State**: Run `npm run seed` prior to recording to ensure consistent baseline interactions and mental models.

### 4. Public Content Integrity
- [ ] Verify generated article and social drafts do not mention prohibited hackathon keywords (`npm run content:check`).
- [ ] Confirm no internal IP addresses (`10.x.x.x`, `192.168.x.x`), internal port numbers, or private staging domains are visible.
