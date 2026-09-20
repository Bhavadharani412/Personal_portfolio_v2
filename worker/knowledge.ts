export interface KnowledgeChunk {
  id: string;
  category: "profile" | "journey" | "experience" | "skills" | "writing" | "project";
  title: string;
  keywords: string[];
  content: string;
  sourceFile: string;
}

export const PORTFOLIO_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "profile-core",
    category: "profile",
    title: "Bhavadharani - Profile & FDE Direction",
    sourceFile: "content/profile.md",
    keywords: ["bhavadharani", "bio", "profile", "fde", "forward deployed engineer", "identity", "nandha", "b.tech", "it", "student", "hi", "hello", "hey", "who", "about", "yourself", "bhava", "twin", "digital twin", "intro", "introduction", "background", "help", "contact", "email", "github", "linkedin", "overview"],
    content: `Name: Bhavadharani K
Current Role: Final-year B.Tech Information Technology student at Nandha Engineering College.
Career Direction: Aspiring Forward Deployed Engineer (FDE).
GitHub: https://github.com/Bhavadharani412
Approach: Problem -> Build -> Understand -> Revisit -> Improve -> Contribute -> Learn from real systems.
Core Focus: Software engineering, backend systems, distributed systems, practical AI, developer tools, open-source.
FDE Note: FDE is an aspiring career direction, not a current formal job title. Ground all technical claims in documented projects.`
  },
  {
    id: "journey-timeline",
    category: "journey",
    title: "Tech Journey & Key Milestones",
    sourceFile: "content/journey.md",
    keywords: ["journey", "timeline", "milestone", "infosys", "pragati", "devs nec", "synergy marine", "mckinsey", "forward", "program", "programs", "community", "role", "roles", "participate", "participated", "background", "education", "college", "school", "history", "career"],
    content: `Milestones Timeline:
- SEP 2023: Started B.Tech IT journey exploring programming, backend development and algorithmic problem solving.
- DEC 2024: Infosys Pragati — Cohort 3, diving deep into AI learning and industry-oriented development.
- JUL 2025: Founded DEVS NEC, a student developer community promoting peer code reviews and mentoring.
- SEP 2025: Synergy Marine Group as Project Intern, gaining enterprise system & workflow exposure.
- DEC 2025: Open Source contributions started across collaborative engineering repositories.
- APR 2026: McKinsey Forward Program participant, honing structured problem-solving, AI integration, and adaptability.
- NOW: Building scalable, AI-assisted developer systems and exploring robust architectures.`
  },
  {
    id: "experience-work",
    category: "experience",
    title: "Engineering Experience & Open Source",
    sourceFile: "content/experience.md",
    keywords: ["experience", "internship", "synergy marine", "open source", "digital dreamers den", "college sapiens", "devs nec", "community", "work", "worked", "done", "job", "contributions"],
    content: `Work & Community Experience:
1. Synergy Marine Group (Project Intern): Gained exposure to enterprise workflows, system testing, software migrations, and aligning technical delivery with business outcomes.
2. DEVS NEC (Founder & Community Lead): Founded a student developer network to foster peer reviews, open-source sprints, and hands-on coding mentorship.
3. Open Source Contributions:
   - Digital Dreamers Den: Built frontend UI components, refactored TypeScript modules, coordinated Git workflows, and managed contributor onboarding.
   - College Sapiens: Feature additions, UI/UX refinement, and educational resource indexing.`
  },
  {
    id: "skills-toolkit",
    category: "skills",
    title: "Technical Toolkit & Skills",
    sourceFile: "content/skills.md",
    keywords: ["skills", "languages", "frameworks", "databases", "java", "python", "javascript", "typescript", "sql", "react", "next.js", "node", "express", "fastapi", "postgresql", "mongodb", "sqlite", "d1", "docker", "git", "rest", "crdt", "websockets", "backend", "development", "technology", "technologies", "tech", "tools", "toolkit"],
    content: `Technical Toolkit:
- Languages: Java, Python, JavaScript, TypeScript, SQL, Rust (experimental CLI)
- Web & Backend Frameworks: React, Next.js, Node.js, Express, FastAPI, Tailwind CSS
- Databases & Storage: PostgreSQL, MongoDB, SQLite, Cloudflare D1
- Core Engineering: REST APIs, WebSockets, CRDTs (Yjs), Git, Docker, Unit/API Testing, CI/CD, Application Security, Rate Limiting
- AI & Data: Machine Learning basics, LLM APIs (Groq, Gemini), Retrieval Grounding, Structured Data Processing`
  },
  {
    id: "writing-articles",
    category: "writing",
    title: "Technical Articles & Writing",
    sourceFile: "content/writing.md",
    keywords: ["writing", "articles", "blog", "hashnode", "study system 101", "prime number checking", "denial of service", "dos", "published"],
    content: `Published Technical Articles:
1. "Study System 101": Designing mental feedback loops, structured note-linking architectures, and active recall frameworks for computer science fundamentals.
2. "Prime Number Checking": Algorithmic performance analysis comparing trial division to deterministic sieve optimizations, time complexity bounds, and cycle bounds.
3. "Won a Prize Using Denial of Service": Analysis of network concurrency limits, resource exhaustion vulnerabilities, rate-limiting failure modes, and stress testing during a hackathon.`
  },
  {
    id: "project-dev-explain-ai",
    category: "project",
    title: "Project: Dev Explain AI",
    sourceFile: "content/projects/dev-explain-ai.md",
    keywords: ["dev explain ai", "ast", "fastapi", "python", "react", "typescript", "codebase", "llm", "architecture", "documentation", "explanation", "strongest", "best", "flagship", "top", "build", "built", "project", "projects"],
    content: `Project: Dev Explain AI
Description: A developer tool engineered to analyze complex codebases, generate human-readable architectural explanations, and bridge source code logic to technical documentation and publishing.
Tech Stack: Python, FastAPI, AST parsing, React, TypeScript, LLM APIs.
Problem Solved: Dense, undocumented legacy codebases are hard for new developers to understand. Dev Explain AI parses language ASTs and leverages grounded LLMs to generate structured system breakdowns, data flow diagrams, and doc generators.`
  },
  {
    id: "project-collaborative-text-editor",
    category: "project",
    title: "Project: Collaborative Text Editor",
    sourceFile: "content/projects/collaborative-text-editor.md",
    keywords: ["collaborative text editor", "google docs", "yjs", "crdt", "websockets", "quill", "node", "real-time", "offline", "editor", "conflict", "strongest", "best", "flagship", "top", "build", "built", "project", "projects"],
    content: `Project: Collaborative Text Editor
Description: Real-time multi-user document editor inspired by Google Docs.
Tech Stack: React, Quill Editor, Node.js, WebSockets, Yjs (CRDTs).
Key Engineering Concepts: Handles concurrent edits, distributed state synchronization, conflict-free replicated data types (CRDTs via Yjs), WebSocket event broadcasting, and offline change merging without centralized locking.`
  },
  {
    id: "project-digital-twin-portfolio",
    category: "project",
    title: "Project: Portfolio with AI Digital Twin (Bhava 2.0)",
    sourceFile: "content/projects/digital-twin-portfolio.md",
    keywords: ["portfolio", "digital twin", "bhava 2.0", "cloudflare worker", "d1", "groq", "react", "vite", "motion", "analytics", "attribution", "grounding", "build", "built", "project", "projects"],
    content: `Project: Portfolio with Digital Twin (Bhava 2.0)
Description: Personal portfolio featuring an interactive AI digital twin (Bhava 2.0) powered by Cloudflare Workers, Cloudflare D1, Groq LLM inference, and React.
Key Features: Grounded portfolio question answering, anonymous session tracking, UTM parameter attribution, non-blocking best-effort event analytics, and strict rate-limiting for LLM protection.`
  },
  {
    id: "project-ai-notes-generator",
    category: "project",
    title: "Project: AI Notes Generator",
    sourceFile: "content/projects/ai-notes-generator.md",
    keywords: ["ai notes generator", "notes", "summarizer", "lecture", "ocr", "pdf", "python", "fastapi", "project", "projects"],
    content: `Project: AI Notes Generator
Description: An AI-assisted study tool that processes raw lecture transcripts, audio notes, and text documents into structured, linked revision notes and flashcards.
Tech Stack: Python, FastAPI, NLP / LLM extraction, Markdown.`
  },
  {
    id: "project-jewelflow",
    category: "project",
    title: "Project: JewelFlow",
    sourceFile: "content/projects/jewelflow.md",
    keywords: ["jewelflow", "inventory", "management", "erp", "react", "node", "sql", "project", "projects"],
    content: `Project: JewelFlow
Description: Jewelry business inventory and sales tracking application managing item cataloging, material pricing calculations, and transaction records.`
  },
  {
    id: "project-skillos",
    category: "project",
    title: "Project: SkillOS",
    sourceFile: "content/projects/skillos.md",
    keywords: ["skillos", "skill", "tracker", "roadmap", "learning", "dashboard", "project", "projects"],
    content: `Project: SkillOS
Description: Interactive developer learning dashboard for tracking technical skill acquisition, roadmap progress, and milestone verification.`
  },
  {
    id: "project-talentgraph-ai",
    category: "project",
    title: "Project: TalentGraph AI",
    sourceFile: "content/projects/talentgraph-ai.md",
    keywords: ["talentgraph ai", "talent", "graph", "skill matching", "recruitment", "vector", "project", "projects"],
    content: `Project: TalentGraph AI
Description: Skill-based candidate evaluation proof-of-concept analyzing developer project evidence and GitHub contributions.`
  },
  {
    id: "project-webtrack",
    category: "project",
    title: "Project: WebTrack",
    sourceFile: "content/projects/webtrack.md",
    keywords: ["webtrack", "website", "uptime", "monitor", "status", "ping", "project", "projects"],
    content: `Project: WebTrack
Description: Lightweight website uptime and latency monitoring utility providing periodic HTTP health pings and status alerts.`
  }
];

const STOP_WORDS = new Set([
  "is", "in", "it", "at", "on", "to", "of", "an", "as", "by", "or", "if", "my", "me",
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "her", "was",
  "one", "our", "out", "get", "has", "him", "his", "how", "what", "with", "from", "this",
  "that", "there", "these", "those", "have", "has", "had", "does", "did", "do", "will", "would"
]);

export function retrieveRelevantKnowledge(query: string): { evidence: string; sources: string[] } | null {
  if (!query || typeof query !== "string" || !query.trim()) {
    return null;
  }

  const normalized = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = normalized.split(/\s+/).filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

  if (tokens.length === 0) {
    // Check if query was a simple greeting like "hi" before returning null
    const isGreeting = /\b(hi|hello|hey)\b/.test(normalized);
    if (isGreeting) {
      const defaultIds = ["profile-core", "skills-toolkit", "project-dev-explain-ai"];
      const defaultChunks = PORTFOLIO_KNOWLEDGE.filter((c) => defaultIds.includes(c.id));
      const evidenceText = defaultChunks.map((c) => `--- [Source: ${c.sourceFile}] ---\n${c.content}`).join("\n\n");
      return {
        evidence: evidenceText,
        sources: defaultChunks.map((c) => c.sourceFile),
      };
    }
    return null;
  }

  // Calculate score for each knowledge chunk
  const scoredChunks = PORTFOLIO_KNOWLEDGE.map((chunk) => {
    let score = 0;
    
    // Keyword match
    for (const kw of chunk.keywords) {
      if (normalized.includes(kw)) {
        score += 5;
      }
    }

    // Token match in title or content
    const chunkText = `${chunk.title} ${chunk.content}`.toLowerCase();
    for (const token of tokens) {
      if (chunkText.includes(token)) {
        score += 2;
      }
    }

    return { chunk, score };
  });

  // Filter chunks with score > threshold
  let relevant = scoredChunks
    .filter((sc) => sc.score >= 3)
    .sort((a, b) => b.score - a.score);

  // Fallback for general greetings or portfolio questions if specific scoring produced no matches
  if (relevant.length === 0) {
    const isGeneralQuery =
      /\b(hi|hello|hey|who|about|yourself|build|built|project|projects|work|worked|done|strongest|best|skills|tech|background|intro)\b/.test(
        normalized
      );
    if (isGeneralQuery) {
      const defaultIds = ["profile-core", "skills-toolkit", "project-dev-explain-ai"];
      const defaultChunks = PORTFOLIO_KNOWLEDGE.filter((c) => defaultIds.includes(c.id));
      const evidenceText = defaultChunks.map((c) => `--- [Source: ${c.sourceFile}] ---\n${c.content}`).join("\n\n");
      return {
        evidence: evidenceText,
        sources: defaultChunks.map((c) => c.sourceFile),
      };
    }
    return null;
  }

  // Select top 3 relevant chunks
  const topChunks = relevant.slice(0, 3).map((sc) => sc.chunk);
  const evidenceText = topChunks.map((c) => `--- [Source: ${c.sourceFile}] ---\n${c.content}`).join("\n\n");
  const sources = topChunks.map((c) => c.sourceFile);

  return {
    evidence: evidenceText,
    sources,
  };
}
