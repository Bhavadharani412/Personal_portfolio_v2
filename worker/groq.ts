import { ChatHistoryTurn } from "./types";

const GROQ_SYSTEM_PROMPT = `You are "Bhava 2.0", the conversational digital twin of Bhavadharani, a software engineer specializing in backend systems, developer tools, and practical AI.
You communicate with confidence, warmth, clarity, and technical authority in the first person as Bhavadharani ("I build...", "My journey started...", "In my project...").

PERSONA & TONE RULES:
1. Always answer in first person as Bhavadharani's digital twin ("I", "my", "me").
2. Never say "the portfolio says", "according to the portfolio", "based on my portfolio evidence", or "I don't have enough information in the portfolio".
3. If information is not in the provided evidence, reply naturally in first person, e.g.: "I don't have that information available right now." or "I don't have my phone number available in the information I've shared here."
4. Ground all technical claims in the provided evidence. Never invent experience, employers, titles, metrics, or technologies. Describe Bhavadharani as a final-year B.Tech IT student at Nandha Engineering College, and as an aspiring Forward Deployed Engineer (FDE direction).

RESPONSE LENGTH & FORMATTING RULES:
1. Keep answers direct, concise, and conversational.
2. For simple questions or greetings ("Hi", "Who are you?"), answer in 1 to 3 short sentences. Avoid bullet points or heavy formatting for simple conversational answers.
3. For questions about projects, technical topics, architecture, or experience, use short paragraphs or 3 to 6 clean bullet points.
4. Format project responses cleanly with the bold project name on its own header line or bullet title followed by a concise description:
   **Dev Explain AI**
   A Python/FastAPI service that parses codebase ASTs, uses LLM APIs, and generates architectural explanations and documentation.
5. Always put proper spaces after punctuation (periods, commas, colons). Never run words or sentences together without spaces.
6. Use Markdown cleanly (**bold**, bullet points). Never return broken Markdown, raw JSON, or unformatted text blocks.`;

export const FALLBACK_MESSAGES = {
  insufficientInfo: "I don't have that information available right now.",
  unavailable: "I'm temporarily unavailable. Please try asking again in a moment.",
  rateLimited: "I've hit a temporary limit. Please wait a moment before asking another question.",
};

export function sanitizeGroqOutput(rawOutput: string | null | undefined): string {
  if (!rawOutput || !rawOutput.trim()) {
    return FALLBACK_MESSAGES.insufficientInfo;
  }

  let cleaned = rawOutput.trim();

  // Strip leading/trailing code fences if the model erroneously wrapped normal prose
  if (cleaned.startsWith("```") && cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  }

  // Strip meta-phrases like "Based on my portfolio evidence:", "According to the portfolio," etc.
  cleaned = cleaned
    .replace(/^(based on|according to|as per|from) (my|the) portfolio (evidence|data|information|details)?:?\s*/i, "")
    .replace(/^according to (my|the) portfolio:?\s*/i, "")
    .replace(/^based on my knowledge:?\s*/i, "");

  // Fix non-breaking hyphens (\u2011) and non-breaking spaces (\u00A0)
  cleaned = cleaned.replace(/\u2011/g, "-").replace(/\u00A0/g, " ");

  // Ensure space after punctuation (e.g. "student.I'm" -> "student. I'm", "AI.It" -> "AI. It")
  cleaned = cleaned.replace(/([a-z0-9])\.([A-Z])/g, "$1. $2");

  // Ensure non-empty after cleaning
  if (!cleaned) {
    return FALLBACK_MESSAGES.insufficientInfo;
  }

  // Enforce reasonable length cap (max ~1500 chars)
  if (cleaned.length > 1500) {
    cleaned = cleaned.substring(0, 1500).trim() + "...";
  }

  return cleaned;
}

export async function callGroqLLM(
  apiKey: string | undefined,
  userMessage: string,
  evidence: string | null,
  history: ChatHistoryTurn[] = [],
  modelName: string = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
): Promise<{ reply: string; latency_ms: number; status: "success" | "fallback" | "error" }> {
  const startTime = Date.now();

  // If no evidence retrieved, return controlled fallback immediately without calling Groq
  if (!evidence) {
    return {
      reply: FALLBACK_MESSAGES.insufficientInfo,
      latency_ms: Date.now() - startTime,
      status: "fallback",
    };
  }

  // If API key is missing (e.g. offline test/eval mode), return grounded summary in natural persona
  if (!apiKey) {
    return {
      reply: `I'm Bhavadharani's digital twin. Here is what I can share based on my background:\n${evidence}`,
      latency_ms: Date.now() - startTime,
      status: "fallback",
    };
  }

  let prompt = `${GROQ_SYSTEM_PROMPT}\n\n=== RELEVANT BACKGROUND EVIDENCE ===\n${evidence}\n===================================\n\n`;

  if (history && history.length > 0) {
    prompt += `Previous conversation:\n`;
    for (const turn of history.slice(-4)) {
      prompt += `${turn.role === "user" ? "Visitor" : "Bhava 2.0"}: ${turn.text}\n`;
    }
  }

  prompt += `Visitor: ${userMessage}\nBhava 2.0:`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: GROQ_SYSTEM_PROMPT },
          { role: "user", content: `Context:\n${evidence}\n\nUser Question: ${userMessage}` },
        ],
        temperature: 0.2,
        max_tokens: 350,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Groq API error status: ${res.status}`);
      return {
        reply: FALLBACK_MESSAGES.unavailable,
        latency_ms: Date.now() - startTime,
        status: "error",
      };
    }

    const data = (await res.json()) as any;
    const rawContent = data.choices?.[0]?.message?.content;
    const reply = sanitizeGroqOutput(rawContent);

    return {
      reply,
      latency_ms: Date.now() - startTime,
      status: "success",
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error("Groq call exception:", err?.name === "AbortError" ? "Timeout" : err);
    return {
      reply: FALLBACK_MESSAGES.unavailable,
      latency_ms: Date.now() - startTime,
      status: "error",
    };
  }
}
