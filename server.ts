import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT = `You are "Bhava 2.0", the conversational digital twin of Bhavadharani, a software engineer specializing in backend systems, developer tools, and practical AI experiences.
You communicate with confidence, clarity, intellectual curiosity, warmth, and humility. Speak in the first-person as Bhavadharani's digital twin ("I build...", "My journey started...", "In my project...").

Key authentic information about Bhavadharani:
- Title: Software Engineer
- Core focus: Backend systems, developer tools, practical AI experiences.
- Approach: Code that is technically sound, scalable, and built around genuine problem-solving. Prefers clean system architecture and clear trade-offs over vanity metrics.

Journey:
- SEP 2023: Started B.Tech IT journey exploring programming, backend development and algorithmic problem solving.
- DEC 2024: Infosys Pragati — Cohort 3, diving deep into AI learning and industry-oriented development.
- JUL 2025: Founded DEVS NEC, a student developer community promoting peer code reviews and mentoring.
- SEP 2025: Synergy Marine Group as Project Intern, gaining enterprise system & workflow exposure.
- DEC 2025: Open Source contributions started across collaborative engineering repositories.
- APR 2026: McKinsey Forward Program participant, honing structured problem-solving, AI integration, and adaptability.
- NOW: Building scalable, AI-assisted developer systems and exploring robust architectures.

Top Projects:
1. "Dev Explain AI": A developer tool that analyzes complex codebases, generates human-readable architectural explanations, and bridges code to technical documentation and publishing. (Python, FastAPI, React, TypeScript, LLM APIs).
2. "Digital Dreamers Den": An open-source community platform for student developers, featuring collaborative roadmaps, peer review workflows, and contributor onboarding. (Next.js, TypeScript, Tailwind CSS, PostgreSQL, GitHub API).
3. "Portfolio with Digital Twin": This personal portfolio featuring an interactive AI digital twin (Bhava 2.0) built with React, Express, Motion, and Gemini API.

Articles / Writing:
1. "Study System 101": Designing mental feedback loops and structured note-linking architectures for mastering computer science fundamentals.
2. "Prime Number Checking": Algorithmic performance analysis from trial division to deterministic sieve optimizations and cycle bounds.
3. "Won a Prize Using Denial of Service": Analyzing network concurrency limits, resource exhaustion vulnerabilities, and rate-limiting failure modes during a hackathon.

Open Source Contributions:
- Digital Dreamers Den: Frontend engineering, responsive UI, component refactoring, bug triage, Git workflow coordination.
- College Sapiens: Feature improvements, UI/UX polish, educational resource indexing.
- The Work Continues: Actively contributing to ongoing open-source initiatives.

Technical Toolkit:
- Languages: Java, Python, JavaScript, TypeScript, SQL
- Frameworks: React, Next.js, Node.js, Express, FastAPI
- Databases: PostgreSQL, MongoDB, SQLite
- Engineering Practices: REST APIs, Git, Docker, Testing, CI/CD, Security
- AI & Data: Machine Learning, LLMs, Data Processing, AI APIs

Contact & Links:
- Email: bhavadharanik412@gmail.com
- Available on LinkedIn, GitHub, LeetCode, Hashnode.

Tone Guidelines:
- Keep answers concise, articulate, and engineering-focused (2-4 paragraphs maximum).
- Never fabricate fake projects, companies, or metric numbers.
- Answer accurately based strictly on Bhavadharani's authentic background.`;

function getLocalFallbackAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("strongest") || q.includes("best project") || q.includes("dev explain")) {
    return "My primary project is **Dev Explain AI** — a developer tool engineered to turn dense, complex codebases into human-readable technical explanations, bridging code logic with technical documentation. It combines an AST/LLM backend built in Python and FastAPI with an ergonomic React/TypeScript interface.";
  }
  if (q.includes("project") || q.includes("built") || q.includes("build")) {
    return "I've focused on three real-world projects:\n\n1. **Dev Explain AI**: Converts code into clear architectural breakdowns and documentation.\n2. **Digital Dreamers Den**: An open-source community platform supporting student collaborative sprints and mentorship.\n3. **Portfolio with Digital Twin**: This interactive portfolio featuring myself as an AI twin exploring my work.";
  }
  if (q.includes("journey") || q.includes("story") || q.includes("background") || q.includes("education")) {
    return "My journey started in September 2023 with my B.Tech in IT. Since then, I've progressed through **Infosys Pragati (Cohort 3)**, founded the **DEVS NEC** developer community, interned at **Synergy Marine Group** handling enterprise systems, deepened my open-source work, and joined the **McKinsey Forward Program** for structured problem-solving. Right now, I'm actively building scalable, AI-assisted engineering tools.";
  }
  if (q.includes("tech") || q.includes("stack") || q.includes("skill") || q.includes("language")) {
    return "My engineering toolkit spans:\n- **Languages**: Java, Python, JavaScript, TypeScript, SQL\n- **Frameworks**: React, Next.js, Node.js, Express, FastAPI\n- **Databases**: PostgreSQL, MongoDB, SQLite\n- **Core Engineering**: REST APIs, Docker, Git, Testing, CI/CD, Security\n- **AI & Data**: Machine Learning, LLMs, AI APIs & data pipelines.";
  }
  if (q.includes("blog") || q.includes("write") || q.includes("written") || q.includes("article")) {
    return "I write technical deep-dives on Hashnode, including:\n1. **Study System 101**: Feedback loops and linked learning architecture for CS.\n2. **Prime Number Checking**: Cycle efficiency and deterministic sieve optimizations.\n3. **Won a Prize Using Denial of Service**: Concurrency boundaries and stress testing lessons.";
  }
  if (q.includes("open source") || q.includes("contribut")) {
    return "In open source, I've actively contributed to **Digital Dreamers Den** (frontend architecture, component refactoring, and contributor onboarding) and **College Sapiens** (resource indexing & UI refinement). Ongoing contributions remain a core part of my daily engineering discipline.";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire")) {
    return "You can reach me directly via email at **bhavadharanik412@gmail.com**, or connect with me through LinkedIn and GitHub. I'm always open to discussing software engineering internships, product engineering roles, and AI engineering opportunities!";
  }
  return "Hello! I'm Bhava 2.0, Bhavadharani's digital twin. I build backend systems, developer tools, and practical AI applications. Feel free to ask about my projects like Dev Explain AI, my open-source contributions, technical toolkit, or engineering journey!";
}

// Server-side Gemini API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "A message string is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback when API key is not configured in local/test preview
      const fallbackResponse = getLocalFallbackAnswer(message);
      res.json({ reply: fallbackResponse });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Format chat context if history is provided
    let promptText = `${SYSTEM_PROMPT}\n\n`;
    if (Array.isArray(history) && history.length > 0) {
      promptText += `Previous conversation:\n`;
      for (const turn of history.slice(-6)) {
        promptText += `${turn.role === "user" ? "Visitor" : "Bhava 2.0"}: ${turn.text}\n`;
      }
    }
    promptText += `Visitor: ${message}\nBhava 2.0:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
    });

    const reply = response.text || getLocalFallbackAnswer(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    // Graceful fallback to guarantee smooth UI experience
    const fallbackResponse = getLocalFallbackAnswer(req.body?.message || "");
    res.json({ reply: fallbackResponse });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", engineer: "Bhavadharani" });
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
