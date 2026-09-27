# DealMemory Security Exceptions & Residual Risk Register

## Overview
This document registers known architectural boundaries, accepted residual risks, and transition plans for DealMemory.

---

## Registered Exceptions

### EXC-001: In-Memory Sliding-Window Rate Limiter
- **Severity**: LOW
- **Category**: Availability / Denial of Service
- **Description**: The current rate limiter (`InMemoryRateLimiter`) stores token bucket counters in Node.js server memory.
- **Accepted Context**: Suitable for single-instance container deployments, demo showcases, and staging environments.
- **Residual Risk**: In a multi-node, horizontally auto-scaled deployment behind a load balancer without sticky sessions, rate quotas would be calculated per node rather than globally across the cluster.
- **Remediation / Target**: When deploying to multi-region Kubernetes or serverless clusters, replace in-memory storage with an external Redis or Upstash distributed rate limiter via the same `RateLimiter` interface.

### EXC-002: CSP `unsafe-inline` / `unsafe-eval` Directives in Next.js
- **Severity**: LOW
- **Category**: Defense-in-Depth / Cross-Site Scripting
- **Description**: Next.js App Router and React hydration scripts require `'unsafe-inline'` and development fast-refresh requires `'unsafe-eval'`.
- **Accepted Context**: Standard requirement for Next.js client hydration and style injection.
- **Mitigating Controls**:
  - `dangerouslySetInnerHTML` is strictly prohibited throughout the application.
  - All user inputs are sanitized and rendered as inert React text nodes.
  - `frame-ancestors 'none'` and `X-Frame-Options: DENY` eliminate clickjacking.
- **Target**: Implement nonce-based CSP generation via Edge Middleware in enterprise production environments.

### EXC-003: In-Memory Deal Repository
- **Severity**: INFO
- **Category**: Data Persistence
- **Description**: Deal and interaction records are managed in an in-memory repository alongside Hindsight (which maintains durable memory).
- **Accepted Context**: Designed for hackathon demonstration speed, deterministic test repeatability, and instant zero-setup onboarding.
- **Target**: Production enterprise connector connecting to PostgreSQL or Salesforce CRM APIs via the existing `DealRepository` interface.
