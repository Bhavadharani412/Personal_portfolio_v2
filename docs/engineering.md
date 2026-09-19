# Portfolio Platform — Engineering

## 1. Engineering Goals

The portfolio is treated as a small production system.

Priorities:
1. Correctness before visual complexity.
2. Security at trust boundaries.
3. Automated testing.
4. Reproducible deployment.
5. Useful observability.
6. Minimal infrastructure.
7. One source of truth for portfolio content.
8. Graceful failure of optional services.

The implementation should demonstrate real engineering practice without pretending to be an enterprise platform.

## 2. Repository Structure

```text
portfolio/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── engineering.md
│   ├── chatbot-analytics.md
│   └── deployment-operations.md
├── content/
│   ├── profile.md
│   ├── journey.md
│   ├── experience.md
│   ├── skills.md
│   ├── writing.md
│   └── projects/
├── app/
├── worker/
├── chatbot/
│   └── evaluation/
├── migrations/
└── .github/
    └── workflows/
```

The exact Next.js directory structure may follow the existing repository. The important boundaries are UI, API, content, chatbot evaluation, database migrations, and CI/CD.

## 3. API Surface

Keep the Worker API small.

### `POST /api/chat`

Request:

```text
{
  message,
  chat_session_id,
  session_id
}
```

Responsibilities:
- validate body
- enforce message limits
- rate limit
- create/request correlation ID
- retrieve relevant content
- call Groq
- record useful metadata
- return a safe response

### `POST /api/events`

Request:

```text
{
  session_id,
  event_type,
  page,
  project_id,
  metadata
}
```

Responsibilities:
- validate payload
- validate event type
- enforce metadata limits
- store event
- fail non-destructively

### `GET /api/health`

Provides a lightweight health check.

It must not expose secrets, credentials, internal stack traces, or sensitive configuration.

## 4. Database Model

### `sessions`

```text
session_id
created_at
source
medium
campaign
landing_page
```

Anonymous session and attribution context.

### `events`

```text
event_id
session_id
event_type
page
project_id
timestamp
metadata
```

Portfolio interaction events.

### `chat_sessions`

```text
chat_session_id
session_id
started_at
```

Groups chatbot interactions.

### `chat_messages`

```text
message_id
chat_session_id
role
content
latency_ms
status
created_at
```

Stores information needed to understand chatbot usage and behavior.

Raw chat content should have a limited retention policy where practical.

## 5. Data Relationships

```text
sessions
   |
   +------> events
   |
   `------> chat_sessions
                |
                `------> chat_messages
```

Use foreign keys where appropriate and parameterized SQL statements.

Add indexes for demonstrated access patterns rather than indexing everything.

## 6. Content Engineering

Portfolio content lives in Markdown.

A project document should capture structured evidence such as:

```text
problem
solution
architecture
technology
engineering decisions
testing
security
results
links
```

The website and chatbot should consume this content rather than maintaining duplicate project descriptions in application code.

## 7. Chatbot Engineering

Flow:

```text
Question
   -> normalize/validate
   -> retrieve evidence
   -> build grounded prompt
   -> Groq
   -> validate response
   -> return + record metadata
```

Retrieval should initially be structured.

Example:

```text
"How was the collaborative editor built?"
        |
        v
collaborative-text-editor
        |
        +--> architecture
        +--> technologies
        `--> engineering decisions
```

Do not add embeddings/vector infrastructure until content volume or retrieval quality demonstrates the need.

## 8. Chatbot Evaluation

Maintain a version-controlled evaluation set:

```text
chatbot/
└── evaluation/
    └── questions.json
```

Each case can contain:

```text
question
expected_information
source
must_not_contain
```

Test categories:
- project architecture
- technologies
- engineering decisions
- experience
- skills
- journey
- security practices
- insufficient-information questions

Chatbot evaluation should run in CI before production deployment.

## 9. Security Engineering

Trust model:

```text
Browser = untrusted
Worker  = validation boundary
Services = protected
```

### Input validation

Validate:
- body shape
- types
- maximum lengths
- allowed event types
- metadata size

Client-side validation is not a security boundary.

### Secrets

Store secrets in platform-managed environment configuration.

Never commit:

```text
GROQ_API_KEY
database credentials
private tokens
deployment secrets
```

### CORS

Allow only required portfolio origins.

### Request limits

Bound:
- body size
- chat message length
- metadata size
- request frequency

### Safe errors

Return:

```text
Chat is temporarily unavailable. Please try again.
```

rather than internal exceptions, SQL errors, keys, or stack traces.

## 10. Rate Limiting

The chatbot is the primary resource-abuse target.

Apply conservative rate limits at the Worker boundary using an appropriate anonymous request/session identifier.

Goals:
- prevent accidental floods
- reduce automated abuse
- protect Groq usage
- preserve legitimate visitor access

Rate limiting is protection, not a promise of unlimited capacity.

## 11. Analytics Engineering

Use a controlled event vocabulary:

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

Do not record every UI interaction.

Each event should exist because it answers a useful product question.

## 12. Attribution Engineering

Supported source categories:

```text
linkedin
github
resume
application
direct
```

UTM parameters are captured at session creation.

Example:

```text
https://bhavadharani.me/?utm_source=linkedin
```

Preserve the original useful attribution rather than repeatedly overwriting it during navigation.

Attribution is contextual traffic analysis, not identity resolution.

## 13. Observability Engineering

Use structured logs.

Conceptual record:

```text
{
  request_id,
  route,
  status,
  duration_ms,
  error_type
}
```

Chatbot requests can additionally include:

```text
chat_session_id
retrieval_duration_ms
groq_duration_ms
total_duration_ms
```

Useful operational measures:
- requests
- errors
- chatbot failure rate
- provider latency
- total latency
- analytics write failures
- rate-limit events

## 14. Testing Strategy

Testing is part of feature development.

### Unit tests

Cover:
- content parsing
- event validation
- attribution parsing
- request validation
- retrieval logic
- utility functions

### UI/component tests

Use the repository's React testing setup for important behavior:
- chatbot submission
- loading/error states
- project interaction
- attribution capture

### API tests

Cover:
- valid chat requests
- invalid requests
- rate limiting
- health endpoint
- event ingestion
- safe errors

### End-to-end tests

Use Playwright for critical flows:

```text
Home
  -> Project
  -> Chatbot
  -> Response
```

Also test that the portfolio remains usable when the chatbot is unavailable.

## 15. Testing Pyramid

```text
             E2E
            /          API / UI tests
          /              Unit tests
```

Most business logic should be covered by fast unit tests. E2E tests should focus on critical user journeys.

## 16. CI/CD

Recommended pipeline:

```text
Pull Request / Push
        |
        v
Install dependencies
        |
        +--> lint
        +--> unit/API/UI tests
        +--> chatbot evaluation
        +--> content validation
        `--> production build
                 |
                 v
              deploy
                 |
                 v
          production smoke check
```

A failed validation should prevent production deployment.

## 17. Content Validation

Because Markdown is a source of truth, CI should validate:
- required fields/frontmatter
- broken internal references
- missing project metadata
- invalid links
- duplicate project identifiers
- chatbot references to missing content

This prevents content edits from silently breaking the website or chatbot.

## 18. Dependency Management

Before adding a package, ask:
1. Does the platform already provide this?
2. Can it be implemented clearly without another dependency?
3. Does it add runtime/security cost?
4. Is it required by a real requirement?

Keep the dependency graph small.

## 19. Failure Isolation

### Portfolio content failure
Show a controlled fallback.

### Chatbot failure
Keep the portfolio usable.

### Analytics failure
Do not block navigation.

### API failure
Return a safe, readable response.

Principle:

> Optional capabilities must not become single points of failure for the portfolio.

## 20. Privacy

Default analytics should be anonymous.

Prefer:
- random session ID
- timestamp
- source
- page
- event type
- project identifier
- chatbot metadata

Avoid:
- passwords
- credentials
- unnecessary personal information
- hidden identity tracking
- unsupported recruiter/company assumptions

Raw chatbot questions should be retained only as long as they are useful.

## 21. Performance

Optimize for:
- fast initial page load
- minimal client JavaScript where practical
- optimized images
- static/server-rendered content where appropriate
- non-blocking analytics
- lazy chatbot loading

The chatbot must not delay the initial portfolio experience.

## 22. Cost Engineering

The initial target is $0 infrastructure cost using available free tiers.

Primary services:

```text
Vercel
Cloudflare Workers
Cloudflare D1
Groq
GitHub Actions
Existing domain
```

Free-tier limits are treated as engineering constraints.

Use:
- rate limiting
- bounded payloads
- controlled analytics volume
- bounded chatbot usage
- no unnecessary background workloads

Provider quotas should be checked against current documentation before production launch.

## 23. Engineering Principles

### YAGNI
Do not build infrastructure for hypothetical scale.

### Explicit boundaries
Each component has one primary responsibility.

### Secure by boundary
Browser input is untrusted.

### Evidence over claims
Only claim engineering capabilities that the implementation demonstrates.

### Source once
Do not duplicate portfolio facts across website, chatbot, and PDF.

### Failure isolation
Chatbot and analytics failures must not take down the portfolio.

### Automated verification
Tests and validation run before deployment.

### Observable behavior
Important backend operations expose enough structured information to diagnose failures.

## 24. Definition of Done

A feature is complete when applicable items are satisfied:

- [ ] Requirement implemented.
- [ ] Input validation added.
- [ ] Security implications reviewed.
- [ ] Relevant tests added.
- [ ] Chatbot evaluation updated if knowledge behavior changed.
- [ ] Analytics added only when useful.
- [ ] Errors handled.
- [ ] Documentation updated.
- [ ] CI passes.
- [ ] Production build passes.
- [ ] Production smoke test passes.
