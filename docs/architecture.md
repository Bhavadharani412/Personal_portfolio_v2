# Portfolio Platform — Architecture

## 1. Purpose

This portfolio is designed as a small production web platform rather than a static resume page.

Primary responsibilities:
1. Serve the portfolio reliably.
2. Provide a grounded portfolio chatbot.
3. Capture useful, privacy-conscious analytics.
4. Run through an automated deployment pipeline.

The architecture prioritizes correctness, security, measurable behavior, maintainability, and graceful failure over unnecessary infrastructure.

## 2. Architecture at a Glance

```text
Visitor
   |
   | HTTPS
   v
Vercel / Next.js
   |-- Portfolio UI
   |-- Projects / writings
   |-- Chat UI
   `-- Analytics events
          |
          | API
          v
Cloudflare Worker
   |-- validation
   |-- rate limiting
   |-- attribution
   |-- chatbot orchestration
   |-- request IDs / logs
   |
   +------------+-------------+
   |                          |
   v                          v
Cloudflare D1                Groq
analytics + chat             LLM inference

Repository Markdown
   |---> Website content
   |---> Chatbot knowledge
   `---> Generated Tech Journey PDF
```

## 3. Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js / React | Portfolio UI |
| Hosting | Vercel | Web deployment and delivery |
| API | Cloudflare Workers | Server-side API boundary |
| Database | Cloudflare D1 | Relational analytics/chat data |
| AI | Groq | LLM inference |
| Source control | GitHub | Code and content |
| CI/CD | GitHub Actions | Test, validate, deploy |
| Documents | Markdown + generated PDF | Source content and artifact |
| Domain | Existing domain | Public portfolio address |

No Redis, vector database, separate backend server, or paid analytics platform is required initially.

## 4. Component Responsibilities

### Next.js / Vercel

Responsible for rendering the portfolio, project pages, writing content, chatbot UI, attribution capture, and browser-side event collection.

It must never contain Groq keys, database credentials, or private analytics credentials.

### Cloudflare Worker

Acts as the public server-side boundary.

Responsibilities:
- validate requests
- enforce payload/message limits
- rate limit chatbot usage
- resolve attribution
- retrieve chatbot knowledge
- call Groq
- write analytics/chat data to D1
- generate request/correlation IDs
- return safe errors
- provide lightweight operational logging

### Cloudflare D1

Stores relational application data:
- anonymous sessions
- analytics events
- chat sessions
- chat messages
- useful operational metadata

### Groq

Provides LLM inference.

The browser communicates with the Worker, never directly with Groq:

```text
Browser -> Worker -> Groq
```

## 5. Source of Truth

Portfolio facts are maintained as Markdown:

```text
content/
├── profile.md
├── journey.md
├── experience.md
├── skills.md
├── writing.md
└── projects/
```

The same content feeds:

```text
Markdown
   |---> Website
   |---> Chatbot knowledge
   `---> Tech Journey PDF
```

The PDF is a generated artifact, not the primary chatbot knowledge store.

This prevents the website, chatbot, and PDF from drifting apart.

## 6. Chatbot Architecture

The chatbot is a grounded portfolio assistant, not a general-purpose AI assistant.

```text
User question
      |
      v
Frontend
      |
      v
Worker
      |
      +--> validate + rate limit
      |
      +--> retrieve relevant portfolio evidence
      |
      +--> construct grounded prompt
      |
      +--> Groq
      |
      +--> record useful metadata
      |
      v
Answer
```

Grounding rules:
- answer from portfolio knowledge
- prefer concrete project/experience evidence
- never invent technologies, employers, responsibilities, results, or achievements
- state when available information is insufficient
- avoid private information

A vector database is intentionally excluded from the first version. Structured retrieval is sufficient for a small portfolio knowledge base.

## 7. Analytics Architecture

Analytics use a small event vocabulary:

```text
page_view
project_view
github_click
live_demo_click
article_click
resume_click
contact_click
chat_started
chat_message
chat_response
```

Example visitor journey:

```text
LinkedIn
  -> landing page
  -> project view
  -> GitHub click
  -> chatbot
  -> question
  -> resume click
```

This measures behavior rather than only page views.

Analytics are anonymous by default.

## 8. Attribution

Supported source links can use UTM parameters:

```text
/?utm_source=linkedin
/?utm_source=github
/?utm_source=resume
/?utm_source=application
```

The session retains useful attribution so the system can answer questions such as:
- which source generated sessions?
- which projects did those visitors inspect?
- which sources led to chatbot usage?
- which sources led to GitHub/resume interactions?

The system must not claim to identify a person or exact employer from ordinary website traffic.

## 9. Reliability and Traffic Spikes

The portfolio must remain usable if the chatbot or analytics system fails.

```text
Portfolio
   |
   +--> normal content delivery
   |
   `--> optional chatbot
          |-- rate limited
          |-- validated
          `-- protected from provider failure
```

During traffic spikes:
1. Portfolio content continues to work.
2. Chat requests are rate limited.
3. Oversized requests are rejected.
4. Groq failures produce controlled responses.
5. Analytics failures do not block navigation.
6. Retry storms are avoided.

The goal is graceful degradation, not unlimited free capacity.

## 10. Security Boundaries

```text
Browser = untrusted
Worker  = validation/security boundary
D1/Groq = protected services
```

Rules:
- secrets remain server-side
- validate all browser input
- limit request body and message sizes
- configure CORS intentionally
- use parameterized database queries
- return safe errors
- avoid unnecessary personal information

## 11. Observability

Use lightweight structured operational signals.

A request can carry:

```text
request_id
route
status
duration_ms
error_type
```

Chat requests can additionally track:

```text
retrieval_duration_ms
groq_duration_ms
total_duration_ms
```

Useful measures:
- request count
- error count
- chatbot failures
- Groq latency
- total API latency
- analytics write failures
- rate-limit events

Definitions:

```text
Analytics     = what visitors do
Logs          = what the system does
Metrics       = how it behaves over time
Observability  = using these signals to understand behavior/failure
```

The portfolio should describe these capabilities accurately and avoid enterprise-scale claims.

## 12. Deployment

```text
Developer
   |
   v
GitHub
   |
   v
GitHub Actions
   |-- lint
   |-- tests
   |-- chatbot evaluation
   |-- content validation
   `-- production build
        |
        +--> Vercel
        `--> Cloudflare Worker
                 |--> D1
                 `--> Groq
```

Detailed operational procedures belong in `docs/deployment-operations.md`.

## 13. Failure Handling

### Groq unavailable
Return a controlled chatbot-unavailable response. The portfolio remains usable.

### D1 unavailable
Do not block normal portfolio navigation.

### Invalid request
Reject it before expensive processing.

### Rate limit exceeded
Return a controlled rate-limit response.

### Frontend/API mismatch
Detect it through API/integration tests before production.

## 14. Architectural Decisions

### Vercel + Cloudflare Workers
Keep frontend delivery and server-side API responsibilities separate.

### D1
Use a relational Worker-native database for analytics and chat data.

### No vector database initially
Avoid infrastructure that does not solve a current scale/problem.

### Git repository Markdown
Maintain portfolio facts once and reuse them across the system.

### PDF as generated artifact
Generate the Tech Journey PDF from maintained content rather than treating the PDF as application data.

## 15. Non-Goals

The first version does not provide:
- general-purpose AI chat
- enterprise distributed tracing
- user accounts
- recruiter identity tracking
- a CRM
- a vector database
- paid analytics infrastructure
- unlimited chatbot usage

## 16. Success Criteria

The architecture succeeds when:
- the portfolio works independently of the chatbot
- Groq credentials never reach the browser
- chat requests are validated and rate limited
- portfolio content has one source of truth
- traffic sources can be measured responsibly
- chatbot usage and failures can be measured
- deployment is reproducible
- normal usage fits the intended free-tier infrastructure
- engineering decisions are understandable from the repository
