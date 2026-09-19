# Bhavadharani K — Software Engineering Portfolio

> A production-minded portfolio that combines software engineering, AI, security, measurable product behavior, and automated delivery.

**Live:** `https://bhavadharani.me`

---

## What this is

This is not intended to be only a collection of project screenshots.

The portfolio itself is an engineering project:

- Next.js / React frontend
- Cloudflare Worker API layer
- Cloudflare D1 relational data store
- Groq-powered grounded chatbot
- Anonymous event analytics
- UTM-based traffic attribution
- Request-level operational signals
- Automated testing and CI/CD
- Generated Tech Journey PDF
- Free-tier-first infrastructure

The goal is to make the engineering behind the portfolio inspectable.

---

## Architecture

```text
Visitor
   |
   v
Vercel / Next.js
   |
   v
Cloudflare Worker
   |-- Chat API
   |-- Analytics API
   |-- Attribution
   |-- Validation
   |-- Rate limiting
   `-- Observability
        |
        +--> Cloudflare D1
        `--> Groq
```

Portfolio content is maintained as Markdown:

```text
Markdown
   |---> Website
   |---> Chatbot knowledge
   `---> Tech Journey PDF
```

The PDF is generated output, not the chatbot's source of truth.

See [`docs/architecture.md`](docs/architecture.md) for the complete system design.

---

## Engineering Highlights

### Grounded portfolio chatbot

The chatbot retrieves relevant portfolio evidence before asking Groq to generate an answer.

It is designed to:

- use maintained portfolio facts
- avoid unsupported claims
- handle insufficient information explicitly
- protect the LLM API key
- enforce request limits
- evaluate expected behavior in CI

### Product analytics

The portfolio records useful anonymous events such as:

```text
project_view
github_click
live_demo_click
resume_click
chat_started
chat_message
```

This makes it possible to understand which parts of the portfolio actually receive engagement.

### Attribution

Traffic can be distinguished with links such as:

```text
?utm_source=linkedin
?utm_source=github
?utm_source=resume
?utm_source=application
```

Attribution is intentionally treated as contextual traffic information, not identity tracking.

### Observability

The Worker can record structured operational information such as:

- request IDs
- request status
- latency
- chatbot latency
- provider failures
- rate-limit events

The implementation avoids claiming enterprise observability where it does not exist.

---

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | Next.js / React |
| Frontend hosting | Vercel |
| API | Cloudflare Workers |
| Database | Cloudflare D1 |
| AI inference | Groq |
| Source control | GitHub |
| CI/CD | GitHub Actions |
| Content | Markdown |
| Document artifact | Generated PDF |

The architecture intentionally avoids unnecessary infrastructure such as a vector database, Redis, or a separate backend server.

---

## Repository

```text
portfolio/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── engineering.md
│   ├── chatbot-analytics.md
│   └── deployment-operations.md
├── content/
├── app/
├── worker/
├── chatbot/
├── migrations/
└── .github/
    └── workflows/
```

---

## Development

Typical local workflow:

```bash
git clone <repository>
cd <repository>

# install dependencies
# configure local environment
# run frontend
# run Worker locally
# run tests
```

Production secrets are never committed to the repository.

See [`docs/engineering.md`](docs/engineering.md) for development, testing, security, API, data, and engineering conventions.

---

## Verification

Changes are intended to pass:

```text
lint
unit tests
UI/API tests
chatbot evaluation
content validation
production build
```

Critical user journeys are covered by end-to-end testing.

---

## Deployment

```text
GitHub
   |
   v
GitHub Actions
   |
   +--> tests
   +--> chatbot evaluation
   +--> content validation
   `--> build
          |
          +--> Vercel
          `--> Cloudflare Worker
```

See [`docs/deployment-operations.md`](docs/deployment-operations.md).

---

## Free-Tier Strategy

The initial infrastructure target is **$0**.

The system uses:

```text
Vercel
Cloudflare Workers
Cloudflare D1
Groq
GitHub Actions
Existing domain
```

Free-tier limits are treated as engineering constraints.

The application therefore uses bounded requests, rate limiting, lightweight analytics, and graceful degradation.

Current provider limits should always be verified against provider documentation before relying on them operationally.

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | System architecture and design decisions |
| [`docs/engineering.md`](docs/engineering.md) | API, data, security, testing, CI/CD and engineering practices |
| [`docs/chatbot-analytics.md`](docs/chatbot-analytics.md) | Chatbot grounding, evaluation, analytics and attribution |
| [`docs/deployment-operations.md`](docs/deployment-operations.md) | Deployment, production operations, limits, rollback and launch checks |

The project intentionally keeps documentation to these four technical documents plus this README.

---

## Portfolio Content

The maintained content is used to build the public portfolio and related artifacts.

Important rule:

```text
Edit Markdown
     |
     +--> website updates
     +--> chatbot knowledge updates
     `--> PDF can be regenerated
```

This avoids maintaining the same facts separately in a website, chatbot prompt, and PDF.

---

## Privacy

Analytics are designed to be anonymous by default.

The system should avoid collecting unnecessary personal information and should never claim to identify a visitor or recruiter from ordinary traffic data.

Raw chatbot questions are treated as user-provided data and should have limited retention.

---

## Selected Work

The portfolio itself contains the current project list, technical writing, experience, skills, and contact information.

For project-specific evidence, use the live portfolio and the project source repositories rather than treating this README as a replacement for them.

---

## Contact

**Bhavadharani K**

- Portfolio: `https://bhavadharani.me`
- GitHub: available from the portfolio
- LinkedIn: available from the portfolio
- Resume: available from the portfolio
- Email: available from the portfolio

---

## Status

This repository is actively developed.

Architecture and operational decisions are documented so that the portfolio can evolve without turning into an unnecessarily complex platform.
