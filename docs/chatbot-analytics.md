# Portfolio Platform — Chatbot & Analytics

## 1. Purpose

The chatbot and analytics layer turns the portfolio from a static showcase into a measurable software product.

It has two separate concerns:

- **Chatbot:** help visitors understand the portfolio using grounded information.
- **Analytics:** understand how visitors interact with the portfolio and chatbot.

They share the same Worker/D1 infrastructure but must remain logically independent.

---

## 2. Chatbot Product Goal

The chatbot is a **portfolio-specific assistant**, not a general AI assistant.

It should answer questions such as:

- What projects has Bhavadharani built?
- How was the collaborative editor designed?
- What technologies were used?
- What security practices were considered?
- What testing approach was used?
- What experience is relevant to an SDE role?
- Can you explain a particular project?
- Where can I find the source code or live demo?

It should not invent information outside the maintained portfolio knowledge.

---

## 3. Knowledge Architecture

The source of truth is repository Markdown.

```text
content/
├── profile.md
├── journey.md
├── experience.md
├── skills.md
├── writing.md
└── projects/
```

Flow:

```text
Markdown
   |
   +--> Website
   |
   +--> Chatbot knowledge
   |
   `--> Tech Journey PDF
```

The PDF is generated output.

Do not paste the complete PDF into every chatbot request.

---

## 4. Retrieval Strategy

### Initial approach

Use structured retrieval.

Each content item should have enough metadata to identify its topic, for example:

```text
type: project
id: collaborative-text-editor
topics:
  - architecture
  - react
  - node
  - yjs
  - collaboration
```

A question is mapped to relevant content and only the required evidence is sent to the LLM.

### Why not vector search?

The initial portfolio knowledge base is small.

A vector database would introduce:

- another service
- embeddings
- indexing
- synchronization
- additional failure modes
- additional cost/limits

without a demonstrated need.

If the knowledge base becomes substantially larger, vector retrieval can be introduced behind the same retrieval interface.

---

## 5. Chat Request Flow

```text
Visitor
   |
   v
Chat UI
   |
   | POST /api/chat
   v
Cloudflare Worker
   |
   +--> validate input
   |
   +--> rate limit
   |
   +--> identify relevant content
   |
   +--> build grounded prompt
   |
   +--> call Groq
   |
   +--> record metadata
   |
   v
Response
```

The Worker is responsible for protecting the LLM provider.

---

## 6. Grounding Rules

The system prompt should establish rules such as:

1. Use only supplied portfolio evidence.
2. Do not invent facts.
3. Do not infer employment, achievements, or technologies that are not present.
4. Prefer specific evidence over vague claims.
5. If the evidence is insufficient, say so.
6. Never expose private configuration or secrets.
7. Keep answers useful and concise.

Example:

```text
Question:
"Did she deploy this project with Kubernetes?"

If Kubernetes is not present in the retrieved evidence:

"I don't have information in the portfolio confirming Kubernetes
deployment for that project."
```

This is preferable to hallucinating a technology.

---

## 7. Suggested Questions

Suggested questions should guide visitors toward high-value portfolio evidence.

Examples:

```text
What are the strongest software engineering projects?

How was the collaborative text editor built?

What engineering decisions went into Study System 101?

How does the portfolio chatbot work?

What testing practices are used?

What security practices have been applied?

What projects are most relevant to an SDE role?

Where can I see the source code?
```

Suggestions should be generated from actual portfolio content rather than generic AI prompts.

---

## 8. Chatbot Evaluation

Maintain a version-controlled evaluation set:

```text
chatbot/
└── evaluation/
    └── questions.json
```

Example structure:

```json
{
  "question": "How was the collaborative editor built?",
  "expected_information": [
    "React",
    "Node",
    "Yjs"
  ],
  "source": "projects/collaborative-text-editor.md",
  "must_not_contain": [
    "Kubernetes"
  ]
}
```

Evaluation categories:

- factual project questions
- architecture questions
- technology questions
- experience questions
- security questions
- testing questions
- unsupported questions
- adversarial/hallucination checks

The evaluation runs in CI when chatbot behavior or knowledge changes.

---

## 9. Chatbot Failure Modes

### Groq unavailable

Return a controlled message:

```text
The portfolio assistant is temporarily unavailable.
Please explore the projects directly or try again later.
```

### Retrieval finds no evidence

Do not call the model with an empty or misleading context. Return an appropriate limited answer.

### Invalid request

Reject before calling Groq.

### Rate limit

Return a controlled rate-limit response.

### Model returns unsupported claims

Evaluation and prompt constraints should reduce this risk. Critical claims should remain traceable to portfolio source content.

---

# Analytics

## 10. Analytics Goal

Analytics should answer practical questions:

- Where are visitors coming from?
- What do they view?
- Which projects attract attention?
- Do visitors open GitHub or live demos?
- How many visitors try the chatbot?
- What kinds of questions are asked?
- Which questions fail to produce useful answers?
- How does traffic from LinkedIn differ from direct traffic?

Analytics should not become surveillance.

---

## 11. Event Model

Initial event vocabulary:

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

Each event should contain only information needed for analysis.

Conceptually:

```text
event_id
session_id
event_type
page
project_id
timestamp
metadata
```

---

## 12. Anonymous Sessions

A session identifier connects events without requiring an account.

Example:

```text
session_abc123
```

A session can produce:

```text
session_abc123
   |
   +-- page_view
   +-- project_view
   +-- github_click
   +-- chat_started
   +-- chat_message
   `-- resume_click
```

Do not turn the session ID into a person's identity.

---

## 13. Attribution

Supported traffic sources:

```text
linkedin
github
resume
application
direct
```

Links can use:

```text
/?utm_source=linkedin
/?utm_source=github
/?utm_source=resume
/?utm_source=application
```

Capture the original attribution when the session starts.

Useful funnel:

```text
Source
  ↓
Landing page
  ↓
Project view
  ↓
GitHub/live demo
  ↓
Chatbot
  ↓
Resume/contact
```

Attribution has limits. A manually typed URL, copied link, privacy tool, or lost referrer can prevent reliable source detection.

Never claim exact recruiter identity from analytics.

---

## 14. Chat Analytics

For each chatbot interaction, useful measurements include:

```text
chat session
question
timestamp
response status
response latency
```

Potential derived metrics:

- chatbot adoption rate
- messages per chat session
- most common topics
- unanswered/insufficient-information questions
- average response latency
- error rate
- rate-limit events

Raw question content should have a limited retention policy.

---

## 15. Privacy Model

Default:

```text
Anonymous session
      |
      +--> attribution
      +--> page events
      +--> project events
      `--> chatbot interaction
```

Avoid collecting:

- passwords
- credentials
- unnecessary personal information
- hidden identity information
- unsupported employer identity
- sensitive personal data

Analytics exists to improve the portfolio and understand product behavior.

---

## 16. Analytics Failure Isolation

Analytics must never be a dependency for rendering the portfolio.

```text
Portfolio request
      |
      +--> content delivery
      |
      `--> analytics (best effort)
```

If analytics storage fails:

```text
Visitor experience = continues
Analytics event    = may be lost
```

This is an intentional trade-off.

---

## 17. Monitoring

The system should distinguish product analytics from operational monitoring.

### Product analytics

```text
visitors
sources
projects
clicks
chat usage
questions
```

### Operational monitoring

```text
API requests
errors
latency
Groq failures
D1 failures
rate limits
```

The combination provides enough information to identify both user behavior and system problems.

---

## 18. Privacy-Conscious Retention

Recommended approach:

- Keep aggregate metrics longer.
- Keep raw event records only as long as useful.
- Keep raw chatbot questions for a limited period.
- Do not retain data merely because it is technically possible.
- Revisit retention as actual usage grows.

Retention periods should be configured explicitly before production launch.

---

## 19. Dashboard Requirements

The private analytics view should eventually provide:

### Overview

```text
Sessions
Chat sessions
Project views
GitHub clicks
Resume clicks
Contact clicks
```

### Traffic

```text
Source
Sessions
Project engagement
Chatbot engagement
```

### Projects

```text
Project
Views
GitHub clicks
Live demo clicks
```

### Chatbot

```text
Chat sessions
Questions
Top topics
Failures
Latency
Weak/unanswered questions
```

### System health

```text
API errors
Rate limits
Groq latency/failures
D1 write failures
```

The dashboard is an operational tool, not part of the public portfolio.

---

## 20. Design Principle

The chatbot answers:

> "What can visitors learn?"

Analytics answers:

> "What are visitors actually doing?"

Monitoring answers:

> "Is the system working?"

Keeping these questions separate prevents the analytics system from becoming unnecessarily complicated.
