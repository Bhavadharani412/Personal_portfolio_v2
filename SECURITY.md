# Security Policy

## Scope

This security policy covers the Personal Portfolio v2 web application (`bhavadharani.me`), its `/engineering` trust layer, and its Cloudflare Worker edge API (`worker/`).

## Security Controls in Place

- **Secret Isolation**: `GROQ_API_KEY` and Cloudflare credentials are kept strictly in platform-managed secrets (`.dev.vars` locally, Cloudflare Worker secrets and GitHub Environment secrets in production).
- **Fail-Closed Origin Enforcement**: All `POST` API endpoints (`/api/chat`, `/api/events`) validate the request `Origin` against an explicit `ALLOWED_ORIGINS` list and return `403 Forbidden` when missing or disallowed.
- **Payload & Input Bounding**: Request bodies are capped at 4 KB (`readJson`), chat messages at 500 characters, and event metadata at 2 KB.
- **Multi-Layer Abuse & Quota Protection**:
  - Per-IP sliding-window burst limiter keyed on `CF-Connecting-IP` (`worker/rateLimiter.ts`).
  - Atomic daily usage counter in Cloudflare D1 (`daily_usage` table) with a configurable `DAILY_CHAT_BUDGET` and instant `CHAT_ENABLED` kill switch.
- **Safe Output Rendering**: Assistant replies are sanitized, checked for ungrounded claims, and rendered as React text elements without `dangerouslySetInnerHTML`.
- **Privacy & Retention**: Session attribution uses ephemeral `sessionStorage` IDs; raw chat messages in D1 are automatically scrubbed to `[purged]` after 30 days via a daily scheduled cron trigger.

## Reporting a Vulnerability

If you discover a security issue or unintended exposure, please report it directly via email:

- **Contact**: `mailto:bhavadharanik412@gmail.com`
- Please include steps to reproduce and the affected endpoint or component.
