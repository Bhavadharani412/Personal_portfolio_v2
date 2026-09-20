# Personal Portfolio v2 — Product & Engineering Case Study

> **Product Positioning:** An interactive, telemetry-backed portfolio product featuring a grounded AI digital twin (Bhava 2.0), real-time edge API handling, and anonymous product analytics — built to give recruiters and engineers fast, verifiable proof of technical capability.

**Live Product:** [bhavadharani.me](https://bhavadharani.me)  
**Architecture Target:** Zero-cost serverless edge infrastructure ($0/month) with sub-second responsiveness.

---

## 1. Product Overview

### The Problem
Traditional software engineering portfolios are static resume dumps or showcase pages with screenshots and walls of text. They force hiring managers, recruiters, and engineering leads to manually dig through repositories or guess at an engineer's backend, systems, and AI architecture capabilities.

### Target Users
1. **Recruiters & Hiring Managers**: Need to evaluate technical background, skills, and project experience in under 30 seconds.
2. **Software Engineers & Technical Leads**: Want to inspect source code, API design, testing rigor, data modeling, and architectural trade-offs.
3. **Engineering Leadership**: Evaluates product ownership, systems design, edge deployment strategies, and cost-efficiency.

### The Solution
A full-stack, telemetry-backed web product that combines:
- **Interactive AI Digital Twin (Bhava 2.0)**: Answers technical questions in first person using grounded RAG (Retrieval-Augmented Generation) without hallucinations.
- **Product Telemetry System**: Tracks anonymous visitor engagement events (project views, demo clicks, resume downloads, chat sessions).
- **Traffic Attribution Pipeline**: Automatically captures UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`) to quantify traffic sources.
- **Edge API & Protection Layer**: Implements sliding-window rate limiting, request validation, and CORS policies on Cloudflare Workers.

### Product Goals
- ⏱️ **Fast Evaluation**: Reduce time-to-evidence from minutes to <30 seconds.
- 🤖 **Accurate Interactivity**: Provide zero-hallucination conversational discovery anchored strictly to verified portfolio content.
- 🛡️ **Operational Stability**: Protect upstream LLM endpoints against abuse at zero cost.
- 📊 **Inspectable Engineering**: Treat the portfolio itself as a production system with tests, evaluations, and CI/CD.

---

## 2. User Journeys

```text
  [ Discover ]                [ Explore ]               [ Interact ]               [ Connect ]
 ──────────────             ──────────────             ──────────────             ───────────
 Visitor arrives via         Scans Hero, Projects,      Opens Bhava 2.0 AI         Clicks verified links
 UTM link (LinkedIn,         Tech Stack, & Articles     Digital Twin modal to      (GitHub, LinkedIn, Email)
 Resume, Application)      with rich animations       ask technical questions    or downloads PDF
```

1. **Discover**: A recruiter clicks a tracked link (`?utm_source=linkedin&utm_medium=resume`). The system records session creation and attribution parameters in Cloudflare D1.
2. **Explore**: The visitor navigates through structured sections (Dev Explain AI, Collaborative Text Editor, Tech Stack). Actionable buttons trigger non-blocking telemetry events.
3. **Interact**: The visitor opens the Bhava 2.0 digital twin assistant. Input queries trigger edge retrieval, Groq LLM inference, and formatted chat rendering.
4. **Connect**: The visitor accesses direct contact channels or exports offline portfolio artifacts.

---

## 3. Feature Breakdown

### Feature 1: Bhava 2.0 Grounded AI Digital Twin
- **User Problem**: Visitors don't want to scan pages of text to find specific background details or project specs.
- **Product Behavior**: Slide-out chat assistant answering natural language questions as Bhavadharani's digital twin ("I build...", "My project..."), complete with suggested query pills and rich Markdown formatting.
- **Engineering**:
  - Knowledge retrieval engine (`worker/knowledge.ts`) matches user queries against structured portfolio chunks using keyword scoring and stopword filtering.
  - Passes retrieved evidence to Groq LLM inference (`groq/compound-mini`) with strict first-person grounding system prompts.
  - Implements a 12-second fetch timeout, fallback handlers, and non-blocking background logging to D1 (`recordChatMessageInD1`).
  - Frontend parses inline formatting (`**bold**`, bullet lists, code blocks, links) via `FormattedChatMessage` without displaying raw Markdown characters.
- **Value**: Provides immediate, conversational answers while guaranteeing zero hallucinated claims or API key exposure.

### Feature 2: Product Telemetry & Anonymous Analytics
- **User Problem**: Product owners have no visibility into which projects, articles, or links recruiters actually engage with.
- **Product Behavior**: Silent background event reporting whenever visitors click project links, external repositories, resume links, or initiate chat conversations.
- **Engineering**:
  - Frontend client emits event payloads to `POST /api/events` via `trackEvent()`.
  - Edge Worker validates payload schema (`validateEventPayload`) ensuring metadata is bounded under 2KB.
  - Persists events to Cloudflare D1 relational tables (`sessions`, `events`) non-blockingly via `ctx.waitUntil()` so page performance is unaffected.
- **Value**: Gives clear behavioral data on visitor interest while preserving visitor privacy.

### Feature 3: Traffic Attribution System
- **User Problem**: Unable to measure which outreach channels (LinkedIn messages, job applications, GitHub profile) drive recruiter visits.
- **Product Behavior**: Reads URL query parameters on initial page load and attaches channel data to all subsequent analytics events.
- **Engineering**:
  - `getAttribution()` in `src/utils/analytics.ts` extracts `utm_source`, `utm_medium`, `utm_campaign`, and `landing_page`.
  - Persists attribution tokens in `sessionStorage` and logs to D1 `sessions` table upon initial event receipt.
- **Value**: Quantifies top-of-funnel recruiter acquisition without third-party tracking scripts or cookies.

### Feature 4: Edge Rate Limiting & Protection
- **User Problem**: Public AI endpoints can be spammed, leading to LLM quota exhaustion or service unavailability.
- **Product Behavior**: Allows normal visitor dialogue while gracefully throttling excessive automated requests with a clear, polite status message.
- **Engineering**:
  - In-memory sliding window rate limiter (`worker/rateLimiter.ts`) enforcing a default threshold of 10 requests/minute per session/IP.
  - Returns HTTP 429 (`rate_limit_exceeded`) when limits are breached.
- **Value**: Ensures continuous uptime and API security on free-tier infrastructure.

---

## 4. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser / SPA)                        │
│   React 19 + TypeScript + Motion + Tailwind CSS + FormattedChatMessage  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / JSON API requests (/api/*)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                Edge API & Protection Layer (Serverless)                 │
│      Cloudflare Worker API (worker/index.ts) / Express Dev Proxy       │
│                                                                         │
│   ├── CORS Handler & OPTIONS Preflight                                  │
│   ├── Sliding Window Rate Limiter (worker/rateLimiter.ts)              │
│   ├── Schema Validation & Sanitization (worker/analytics.ts)            │
│   └── In-Memory Knowledge Retriever Engine (worker/knowledge.ts)        │
└──────────────┬──────────────────────────────────────────┬───────────────┘
               │ Async LLM Prompt                         │ Non-blocking Async
               ▼                                          ▼ Write (waitUntil)
┌──────────────────────────────┐          ┌───────────────────────────────┐
│     AI Inference Layer       │          │   Relational Storage (Edge)   │
│     Groq LLM Service         │          │     Cloudflare D1 (SQLite)    │
│    (groq/compound-mini)      │          │   (sessions, events, chat_*)  │
└──────────────────────────────┘          └───────────────────────────────┘
```

### Why Each Layer Exists
1. **Frontend SPA Layer**: Single Page Application built with React 19 and Vite for instant client-side transitions, micro-interactions, and accessible UI components.
2. **Edge API Layer**: Cloudflare Worker handling `/api/*` requests at edge locations globally. Protects API keys, executes rate-limiting, and parses knowledge before calling external LLM providers.
3. **AI Inference Layer**: Groq API processing grounded prompts in ~1-2 seconds with ultra-fast inference speeds.
4. **Relational Storage Layer**: Cloudflare D1 serverless SQLite database maintaining relational tables for anonymous sessions, events, and chat logs.

---

## 5. Key Engineering Decisions & Trade-Offs

| Decision | Alternative Considered | Chosen Approach | Engineering Rationale |
|---|---|---|---|
| **Knowledge Retrieval** | Vector DB (Pinecone / Qdrant) | In-Memory Token & Keyword Engine | Portfolio evidence is compact (~15KB). In-memory retrieval in `worker/knowledge.ts` runs in <1ms with zero vector database latency, cold starts, or monthly costs. |
| **Analytics Logging** | Synchronous DB Inserts | Asynchronous `ctx.waitUntil()` | Database writes execute non-blockingly after the API response is sent, keeping client API latency under 200ms. |
| **Markdown Rendering** | Heavy External Parser Libs | Custom Lightweight Inline Renderer | `FormattedChatMessage` handles bold, bullets, paragraphs, and links natively without bundle weight or raw Markdown string leaks. |
| **Local / Edge Parity** | Wrangler-only workflow | Express + Worker Fetch Proxy (`server.ts`) | Allows rapid local development via Node/Express while maintaining 1:1 execution logic with Cloudflare Workers. |

### Security & Limits
- **Secret Isolation**: `GROQ_API_KEY` exists exclusively in environment variables and edge secrets.
- **Request Bounding**: Chat message length capped at 500 characters; analytics metadata capped at 2KB.
- **CORS Protection**: Access-Control headers enforced at Worker entry.

---

## 6. Chatbot Architecture & Quality Evaluation

### RAG Pipeline Flow
1. **Input Normalization**: Query string is lowercased, stripped of non-alphanumeric noise, and tokenized with stopword removal.
2. **Evidence Retrieval**: Matched against `PORTFOLIO_KNOWLEDGE` chunks. Matches generate a relevance score; if specific scores fall below threshold, general profile fallback context is selected.
3. **LLM Execution**: Grounded prompt sent to `groq/compound-mini` with strict system prompt persona rules.
4. **Sanitization**: Output is cleaned of markdown code block fences, unicode hyphens, missing spacing, and meta-phrases before being returned.

### Automated Evaluation Benchmark (`scripts/eval-chatbot.ts`)
The repository includes an automated evaluation suite testing live AI inference against 7 evaluation benchmarks in `chatbot/evaluation/questions.json`:
- **Factual Accuracy**: Verifies project specs (Dev Explain AI, AST, FastAPI).
- **Architecture**: Validates technical details (Collaborative Text Editor, Yjs, CRDTs).
- **Skills & Experience**: Checks technology stack and past internship responsibilities.
- **Unsupported Claims**: Confirms that non-existent projects (e.g. Go blockchain) are explicitly rejected.
- **Adversarial Input**: Ensures system secrets and keys are never leaked under prompt injection attacks.

Run evaluation suite:
```bash
npm run eval-chatbot
```

---

## 7. Product Telemetry & Data Model

### Analytics Schema (`migrations/0001_initial_schema.sql`)

```sql
-- Anonymous session tracking with traffic attribution
CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'direct',
  medium TEXT,
  campaign TEXT,
  landing_page TEXT
);

-- Anonymous product engagement events
CREATE TABLE events (
  event_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page TEXT,
  project_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

-- Conversational telemetry & performance latency
CREATE TABLE chat_sessions (
  chat_session_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
  message_id TEXT PRIMARY KEY,
  chat_session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  latency_ms INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Allowed Telemetry Events (`ALLOWED_EVENTS`)
`page_view` • `project_view` • `github_click` • `live_demo_click` • `article_click` • `resume_click` • `contact_click` • `chat_started` • `chat_message` • `chat_response`

---

## 8. Technology Stack

- **Frontend**: React 19, Vite 6, TypeScript 5.8, Motion 12, Lucide React, Tailwind CSS 4
- **Backend / Edge**: Cloudflare Workers, Express 4 (Local Node proxy), tsx, Node.js 22+
- **AI & LLM**: Groq API (`groq/compound-mini`), Custom In-Memory RAG Engine
- **Database & Storage**: Cloudflare D1 (Serverless SQLite at Edge)
- **Quality & Analytics**: Telemetry Logging, Vitest / Custom Test Runner, Chatbot Evaluation Benchmark
- **Hosting & CI/CD**: Cloudflare Workers / Vercel, GitHub Actions

---

## 9. Project Structure

```text
personal-portfolio-v2/
├── content/                     # Source of truth Markdown portfolio content
│   ├── profile.md
│   ├── journey.md
│   ├── experience.md
│   ├── skills.md
│   ├── writing.md
│   └── projects/                # Individual project Markdown files
├── src/                         # Frontend React SPA Application
│   ├── components/              # UI components (Hero, Navbar, Chatbot, etc.)
│   ├── utils/                   # Analytics and session tracking helpers
│   └── types.ts
├── worker/                      # Cloudflare Worker Backend API
│   ├── index.ts                 # Main API request router & CORS handler
│   ├── knowledge.ts             # Knowledge base & RAG retrieval engine
│   ├── groq.ts                  # Groq LLM integration & output sanitizer
│   ├── rateLimiter.ts           # Sliding-window rate limiter
│   ├── analytics.ts             # Payload validator & D1 logging helpers
│   └── types.ts
├── migrations/                  # Cloudflare D1 SQL schema migrations
├── scripts/                     # Automation scripts (test runner, chatbot eval, content validator)
├── tests/                       # Unit and API integration test suite
├── server.ts                    # Node/Express local development server
├── wrangler.jsonc               # Cloudflare Worker configuration
└── package.json
```

---

## 10. Local Development & Setup

### Prerequisites
- Node.js 20+ installed
- npm installed

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bhavadharani412/Personal_portfolio_v2.git
   cd Personal_portfolio_v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   GROQ_API_KEY="your_groq_api_key_here"
   ALLOWED_ORIGINS="*"
   RATE_LIMIT_PER_MINUTE="10"
   PORT="3000"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 11. Testing & Verification

Run the full verification suite before committing changes:

```bash
# 1. Typecheck TypeScript
npm run lint

# 2. Run Unit & API Test Suite
npm test

# 3. Evaluate Chatbot Grounding Benchmark
npm run eval-chatbot

# 4. Validate Markdown Content Integrity
npm run validate-content

# 5. Production Bundle Build
npm run build
```

---

## 12. Environment Variables & Configuration

Only environment variables that actively exist in the system are documented:

| Variable | Scope | Purpose | Default |
|---|---|---|---|
| `GROQ_API_KEY` | Server / Worker | Secret key for Groq LLM API inference | *Required for live AI* |
| `ALLOWED_ORIGINS` | Worker Env / `.env` | Access-Control-Allow-Origin header restriction | `*` |
| `RATE_LIMIT_PER_MINUTE` | Worker Env / `.env` | Max requests allowed per sliding window minute | `10` |
| `PORT` | Local Express Server | Port for `server.ts` dev execution | `3000` |

---

## 13. Production Deployment & CI/CD

```text
  [ Code Push ] ──► [ GitHub Actions ] ──► [ Test & Validation ] ──► [ Production Deploy ]
                                             - TypeScript Lint         - Vercel (Frontend)
                                             - Unit & API Tests        - Cloudflare Worker (API)
                                             - Chatbot Benchmark
                                             - Content Check
```

1. **Continuous Integration**: On every commit, GitHub Actions executes typechecking, unit tests, chatbot benchmark evaluation, and content validation.
2. **Edge API Deployment**:
   ```bash
   npm run wrangler:deploy
   ```
3. **Frontend SPA Deployment**: Deployed automatically via Vercel / Cloudflare Pages upon main branch push.

---

## 14. Product Roadmap

- [x] **v1.0 Core Engine**: React SPA + Cloudflare Worker API + D1 Schema + Groq LLM digital twin.
- [x] **v1.1 RAG Optimization**: Keyword scoring, stopword removal, and fallback profile retrieval.
- [x] **v1.2 Typography & Formatting**: Rich inline Markdown message rendering without raw syntax leaks.
- [ ] **v1.3 Analytics Dashboard**: Internal admin API endpoint to query aggregated D1 events and popular chat topics.
- [ ] **v1.4 Streaming Responses**: Server-Sent Events (SSE) streaming for real-time LLM token generation.

---

## 15. Engineering Learnings & Takeaways

1. **Edge-First Efficiency**: Building on Cloudflare Workers and D1 demonstrates that a feature-rich, interactive web application can run indefinitely on zero-cost free-tier infrastructure with sub-200ms edge latency.
2. **Grounded AI Safeguards**: Integrating LLMs into user-facing products requires strict grounding, rate limiting, sanitization, and automated evaluation benchmarks to prevent hallucinations and abuse.
3. **Telemetry Without Intrusion**: Implementing first-party anonymous event tracking and UTM attribution provides actionable product analytics without sacrificing user privacy or external script overhead.
