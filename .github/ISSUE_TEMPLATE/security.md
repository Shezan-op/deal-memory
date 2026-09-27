---
name: Security Vulnerability Report
about: Report a security finding, vulnerability, or unexpected boundary leak
title: '[SECURITY]: '
labels: security
assignees: ''
---

## Vulnerability Description
<!-- Clear and concise description of the security issue -->

## Affected Component
<!-- File path, route handler, or service component (e.g. /api/memory/recall) -->

## Severity Assessment
- [ ] Critical (Cross-tenant leak, RCE, secret exposure)
- [ ] High (Authorization bypass, prompt injection altering policy)
- [ ] Medium (Rate limiting failure, information disclosure)
- [ ] Low (Security header issue, minor configuration drift)

## Steps to Reproduce
1. Send request with payload:
   ```json
   {
     "key": "value"
   }
   ```
2. Observe response:
   ...

## Impact
<!-- What data or resource could an attacker access or corrupt? -->

## Proposed Remediation (Optional)
<!-- Suggested code fix or mitigation -->
