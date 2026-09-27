# DealMemory Logging & Redaction Specification

## Overview
DealMemory enforces strict logging controls to satisfy OWASP A09 (Security Logging & Monitoring Failures) and privacy compliance frameworks (GDPR / CCPA / SOC2).

---

## 1. Prohibited Logging Content

Under no circumstances may the following data types appear in application logs:
- **API Keys & Secrets**: `HINDSIGHT_API_KEY`, `DEMO_ADMIN_KEY`, upstream LLM tokens, or session secrets.
- **Authorization Headers**: Bearer tokens, JWT signatures, or cookie values.
- **Raw Transcripts**: Full un-sanitized sales call transcript bodies (>50 characters).
- **Customer Financial Identifiers**: Credit card numbers, bank account details, or unmasked personal identifiers.

---

## 2. Redaction Specifications & Masking Rules

The centralized application logger in [logger.ts](file:///c:/Users/techt/dealmemory/src/lib/logging/logger.ts) applies the following transformations:

| Field / Key Pattern | Transformation | Example Output |
| :--- | :--- | :--- |
| `apiKey`, `token`, `secret`, `password` | Replaced with fixed mask | `"[REDACTED_SECRET]"` |
| `email` | Partial mask | `m.v***@acmecorp.com` |
| `rawContent` / `transcript` | Truncated to preview length | `"[TRANSCRIPT_DATA: 450 chars]"` |
| `authorization`, `x-demo-admin-key` | Replaced with fixed mask | `"[REDACTED_HEADER]"` |

---

## 3. Log Injection & CRLF Defense
To prevent log forging and log injection (OWASP A03 / ASVS V5.2):
1. **JSON Serialization**: All log entries are formatted as structured JSON lines (`JSON.stringify`).
2. **Control Character Stripping**: Carriage returns (`\r`), line feeds (`\n`), and ANSI escape sequences (`\x1b[...]`) in user-controlled attributes are escaped or stripped prior to logging.
3. **Traceability**: Every log record contains a unique `timestamp`, `level` (`INFO`, `WARN`, `ERROR`), and optional `requestId` (`req-prep-172746...`).

---

## 4. Verification Check
- Log scrubbing is validated continuously during automated test execution.
- No secrets or unmasked PII appear in test runner logs or CI logs.
