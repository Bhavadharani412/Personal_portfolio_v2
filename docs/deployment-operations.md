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

At minimum:

```text
Local
Production
```

A preview environment may be provided by the frontend hosting platform for pull requests.

Production credentials must never be used locally unless deliberately required.

---

## 3. Required Configuration

Conceptually:

```text
Frontend
- public site configuration

Worker
- GROQ_API_KEY
- D1 binding
- allowed origins
- rate-limit configuration
```

Secrets belong in platform-managed secret/environment configuration.

Never commit `.env` files containing secrets.

A committed `.env.example` may document variable names without values.

---

## 4. Local Development

Expected workflow:

```text
Clone repository
      |
      v
Install dependencies
      |
      v
Configure local environment
      |
      v
Run frontend
      |
      v
Run Worker locally
      |
      v
Use local/test database configuration
```

Local development must not require production credentials when avoidable.

---

## 5. D1 Database Setup

Database changes are version-controlled through migrations.

Conceptually:

```text
migrations/
├── 0001_initial.sql
├── 0002_add_indexes.sql
└── ...
```

Deployment flow:

```text
Migration file
      |
      v
Review
      |
      v
Apply to target D1 database
      |
      v
Verify schema
```

Never make undocumented production schema changes manually.

---

## 6. Vercel Deployment

Vercel handles the Next.js application.

Expected flow:

```text
GitHub push
   |
   v
Vercel build
   |
   v
Production deployment
   |
   v
Public domain
```

The frontend should remain functional even when Worker/Groq services are unavailable.

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

## 13. Free-Tier Operations

The target is to remain inside free tiers during normal portfolio usage.

Engineering controls:

```text
bounded requests
      +
rate limiting
      +
small payloads
      +
minimal analytics
      +
no unnecessary background jobs
```

Free-tier quotas can change. Before production launch, record the current provider limits in the repository and verify them again when traffic increases.

Do not describe a provider as "unlimited" simply because the portfolio currently has low traffic.

---

## 14. Cost Monitoring

Track the resources most likely to become constrained:

```text
Groq requests/tokens
Worker requests
D1 reads/writes/storage
Vercel usage
GitHub Actions usage
```

The system should have documented fallback behavior before a free-tier limit becomes a production outage.

---

## 15. Incident Response

For a production issue:

```text
Detect
  |
  v
Identify affected component
  |
  v
Reduce impact
  |
  v
Inspect logs/metrics
  |
  v
Fix
  |
  v
Test
  |
  v
Deploy
  |
  v
Verify
```

Examples:

### Groq outage

Disable/fail the chatbot gracefully while keeping the portfolio available.

### Analytics problem

Stop or degrade event writes without blocking the site.

### Worker problem

Use frontend fallback behavior and restore the API independently.

### Bad frontend deployment

Rollback the frontend deployment through the hosting platform.

---

## 16. Rollback

Rollback should be possible independently for:

```text
Frontend
Worker
Database migration
```

Application deployments should avoid destructive schema changes without a compatible migration strategy.

For database changes:

```text
old application
      |
      v
compatible schema
      |
      v
new application
```

Prefer additive migrations before removing old fields.

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
