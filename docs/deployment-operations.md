# Portfolio Platform — Deployment & Operations

## 1. Deployment Goal

The portfolio should be deployable from a clean repository with reproducible steps.

Target infrastructure cost:

```text
$0
```

using the selected free tiers and existing domain.

Primary services:

```text
GitHub
   |
   +--> GitHub Actions
   |
   +--> Vercel
   |
   `--> Cloudflare Workers
            |
            +--> D1
            `--> Groq
```

Free-tier limits are treated as engineering constraints and should be rechecked before launch.

---

## 2. Environments

The platform uses three explicit environments:

| Environment | Frontend | API | Database |
|---|---|---|---|
| **Local** | `npm run dev` (`http://localhost:3000`) | `server.ts` proxies `/api/*` to Worker handler | Optional / local mock |
| **Staging** | Vercel v2 project URL (`*.vercel.app`) | `portfolio-api-staging` on `workers.dev` | `portfolio-db-staging` |
| **Production** | `https://bhavadharani.me` | `https://api.bhavadharani.me` (`portfolio-api`) | `portfolio-db` |

Production credentials must never be used locally unless deliberately required.

---

## 3. Required Configuration

```text
Frontend (Vercel / .env)
- VITE_API_BASE (empty locally; staging or production Worker URL in Vercel)

Worker (wrangler.jsonc + Cloudflare Secrets / .dev.vars)
- GROQ_API_KEY (Cloudflare secret / local .dev.vars)
- DB (Cloudflare D1 binding)
- ALLOWED_ORIGINS (comma-separated allowed origins; fail-closed on POST)
- RATE_LIMIT_PER_MINUTE (default: "10")
- GROQ_MODEL (default: "openai/gpt-oss-20b")
- DAILY_CHAT_BUDGET ("50" on staging, "200" on production)
- CHAT_ENABLED ("true" or "false" instant kill switch)
- BUILD_SHA (injected at deploy time by CI)
```

Secrets belong in platform-managed secret/environment configuration. Never commit `.env` or `.dev.vars` files containing secrets.

---

## 4. Local Development

```bash
npm install
npm run dev
```

`server.ts` serves the React 19 + Vite SPA and delegates `/api/*` requests directly to `worker/index.ts`. When `VITE_API_BASE` is empty, browser requests to `/api/chat` and `/api/events` stay same-origin and hit the local proxy.

---

## 5. D1 Database Setup & Migrations

Database changes are version-controlled through `migrations/`:

```text
migrations/
├── 0001_initial_schema.sql
├── 0002_add_indexes.sql
└── 0003_daily_usage.sql
```

Staging setup:

```bash
npx wrangler d1 create portfolio-db-staging
# Paste database_id into wrangler.jsonc under env.staging.d1_databases
npx wrangler d1 migrations apply DB --env staging --remote
npx wrangler secret put GROQ_API_KEY --env staging
npx wrangler deploy --env staging
```

Production setup:

```bash
npx wrangler d1 create portfolio-db
# Paste database_id into wrangler.jsonc under top-level d1_databases
npx wrangler d1 migrations apply DB --remote
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

Never make undocumented production schema changes manually.

---

## 6. Vercel Deployment (React 19 + Vite SPA)

Vercel builds and serves the Vite static bundle (`npm run build` → `dist/`) and applies `vercel.json` SPA rewrites (`/engineering` → `/index.html`) and security headers.

1. Create a separate Vercel project for `Personal_portfolio_v2` during staging verification before cutting over `bhavadharani.me`.
2. Set `VITE_API_BASE` in Vercel Environment Variables (staging Worker URL during Phase 3; `https://api.bhavadharani.me` for production cutover). Since Vite inlines `VITE_API_BASE` at build time, redeploy after changing it.
3. The frontend remains completely functional even if the Worker or Groq API is unreachable.

---

## 7. Cloudflare Worker Deployment

The Worker contains server-side API logic.

Expected flow:

```text
Source
  |
  v
Build/validation
  |
  v
Worker deployment
  |
  +--> D1 binding
  `--> Groq secret
```

Worker configuration must distinguish local and production resources.

---

## 8. Domain

The existing portfolio domain points to the production frontend.

Production verification should confirm:

```text
HTTPS
DNS
frontend
chat API
analytics API
```

Do not expose internal Worker URLs unnecessarily if the production architecture can route API traffic through the intended public origin.

---

## 9. GitHub Actions

CI should run on pull requests and relevant pushes.

Recommended pipeline:

```text
Checkout
   |
   v
Install dependencies
   |
   +--> lint
   +--> unit tests
   +--> UI/API tests
   +--> chatbot evaluation
   +--> content validation
   `--> production build
```

Production deployment should occur only after required checks pass.

---

## 10. Deployment Gates

A production deployment should be blocked when:

- lint fails
- tests fail
- chatbot evaluation fails
- required content validation fails
- production build fails

This prevents broken code or broken knowledge from reaching the public site.

---

## 11. Production Smoke Tests

After deployment verify:

### Website

```text
Home loads
Projects load
Writing loads
Navigation works
```

### Chatbot

```text
Chat opens
Valid question works
Invalid/oversized question is rejected
Rate limiting behaves correctly
Provider failure is handled safely
```

### Analytics

```text
Session created
Page event recorded
Project event recorded
Chat event recorded
Attribution retained
```

### API

```text
/health responds
CORS behaves as expected
Errors do not expose internals
```

---

## 12. Traffic Spike Protection

The most important resource to protect is the chatbot/LLM path.

```text
Visitor
   |
   v
Worker
   |
   +--> validation
   |
   +--> rate limit
   |
   `--> Groq
```

Controls:

- message length limit
- request body limit
- rate limiting
- controlled retries
- safe error responses
- bounded analytics payloads

The portfolio content itself should not depend on Groq.

---

## 13. Free-Tier Register & Quota Behaviour

Free-tier quotas can change; verify each provider's pricing/limits page monthly and record the check date below.

| Service | Plan | Key Resource Monitored | Degraded / Overage Behaviour | Last Checked | Reference |
|---|---|---|---|---|---|
| **Cloudflare Workers** | Free | Daily requests & CPU time per invocation | Edge returns HTTP error; frontend portfolio stays 100% usable and Chatbot shows offline fallback | 2026-11-19 | https://developers.cloudflare.com/workers/platform/limits/ |
| **Cloudflare D1** | Free | Daily rows read, rows written, total storage | `recordEventInD1` and `recordChatMessageInD1` catch errors non-blockingly; daily cron purges old chat text | 2026-11-19 | https://developers.cloudflare.com/d1/platform/limits/ |
| **Groq Cloud API** | Free | Requests/min, requests/day, tokens/min (`openai/gpt-oss-20b`) | Worker enforces `DAILY_CHAT_BUDGET` (~70% of daily cap) in D1 and returns polite 429 fallback before hard quota exhaustion | 2026-11-19 | https://console.groq.com/settings/limits |
| **Vercel** | Hobby (Free) | Bandwidth, build minutes, serverless/edge limits | Static Vite SPA (`dist/`) is served from CDN cache with zero Vercel serverless function invocations | 2026-11-19 | https://vercel.com/docs/limits |
| **GitHub Actions** | Free (Public Repo) | Workflow minutes & artifact storage | Public repositories receive standard free CI runners; live Groq eval runs once nightly | 2026-11-19 | https://docs.github.com/en/billing/managing-billing-for-github-actions |

---

## 16. Rollback Runbook (Under 5 Minutes)

Rollback can be executed independently for each layer:

### A. Domain Cutover Rollback (Vercel `bhavadharani.me`)
1. Open **Vercel Dashboard → v2 project → Settings → Domains** and remove `bhavadharani.me` and `www.bhavadharani.me`.
2. Open **Vercel Dashboard → `portfolio-v1` (old project) → Settings → Domains** and re-attach `bhavadharani.me` and `www.bhavadharani.me`.
3. The Worker requires no changes during a frontend rollback.

### B. Emergency Chatbot Kill Switch (Under 1 Minute)
If Groq experiences an outage or abnormal traffic bypasses burst limits:
1. Set `"CHAT_ENABLED": "false"` in `wrangler.jsonc` (or via Cloudflare Dashboard Worker Variables) and run `npx wrangler deploy`.
2. The Worker immediately returns the polite `429` fallback message without invoking Groq.

### C. Worker Code Rollback
Run `npx wrangler rollback` (or redeploy the previous known-good Git commit SHA) and verify with:
```bash
npm run smoke -- https://api.bhavadharani.me https://bhavadharani.me
```

### D. Database Migrations
Keep all D1 migrations additive (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN`) so previous Worker versions continue operating without destructive schema rollbacks.

---

## 17. Backups and Data Recovery

Analytics data is useful but not mission-critical portfolio content.

The system should prioritize:

1. Source code and content recovery.
2. Database schema recovery.
3. Useful analytics recovery.

The Git repository remains the authoritative copy of portfolio content.

Do not treat D1 analytics as the only copy of important portfolio facts.

---

## 18. Generated Tech Journey PDF

The PDF should be generated from repository content.

```text
content/*.md
      |
      v
PDF generation
      |
      v
Tech Journey.pdf
```

The PDF can be published as a portfolio artifact and linked from the website/resume.

It should not be copied into the chatbot prompt as the primary knowledge source.

The generation process should be reproducible so a content update can produce a new PDF automatically.

---

## 19. Release Workflow

Recommended release:

```text
Create branch
   |
   v
Implement/change content
   |
   v
Run local tests
   |
   v
Open Pull Request
   |
   v
GitHub Actions
   |
   +--> tests
   +--> chatbot evaluation
   +--> content validation
   `--> build
   |
   v
Review
   |
   v
Merge
   |
   +--> Vercel deployment
   `--> Worker deployment
   |
   v
Smoke test
```

---

## 20. Operational Documentation Rule

Do not create another document every time a new operational concern appears.

Update this document unless the concern is large enough to justify changing the approved five-document structure.

Current documentation limit:

```text
README.md
docs/architecture.md
docs/engineering.md
docs/chatbot-analytics.md
docs/deployment-operations.md
```

This keeps the repository understandable.

---

## 21. Launch Checklist

### Architecture
- [ ] Frontend deployed.
- [ ] Worker deployed.
- [ ] D1 production database configured.
- [ ] Groq server-side secret configured.

### Security
- [ ] No secrets committed.
- [ ] CORS restricted.
- [ ] Input validation enabled.
- [ ] Rate limiting enabled.
- [ ] Request limits enabled.
- [ ] Safe errors verified.

### Chatbot
- [ ] Knowledge source validated.
- [ ] Suggested questions tested.
- [ ] Evaluation set passing.
- [ ] Unsupported questions handled.

### Analytics
- [ ] Sessions working.
- [ ] Events working.
- [ ] Attribution working.
- [ ] Chat analytics working.
- [ ] Privacy/retention rules configured.

### CI/CD
- [ ] Tests passing.
- [ ] Build passing.
- [ ] Content validation passing.
- [ ] Chatbot evaluation passing.
- [ ] Production deployment verified.

### Production
- [ ] Domain works.
- [ ] HTTPS works.
- [ ] Portfolio works without chatbot.
- [ ] Chatbot works.
- [ ] Analytics works.
- [ ] Failure paths tested.
- [ ] Smoke test completed.

## 22. Operating Principle

The production system should be boring in the right places:

```text
simple deployment
small API surface
few dependencies
automated verification
controlled resource usage
observable failures
safe degradation
```

The portfolio's engineering value comes from deliberate decisions and evidence, not from the number of services used.
