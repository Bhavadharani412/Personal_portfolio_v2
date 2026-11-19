import React, { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Cpu, Database, Lock, AlertTriangle, Activity, ExternalLink } from "lucide-react";
import { apiUrl } from "../utils/api";

interface PublicStats {
  window_days: number;
  answered: number;
  avg_latency_ms: number;
  build: string;
}

interface EngineeringPageProps {
  onBack: () => void;
}

const DECISIONS = [
  {
    title: "1. Deterministic Keyword Retrieval over Vector Embeddings",
    chosen: "In-memory token & keyword scoring (worker/knowledge.ts)",
    alternative: "Managed Vector DB (Pinecone / Cloudflare Vectorize + Embeddings API)",
    tradeoff:
      "The entire portfolio knowledge base is ~15 KB across 13 structured chunks. In-memory scoring runs in <1 ms with zero external network calls, zero embedding costs, and deterministic explainability. Trade-off: purely semantic synonyms require explicit keyword coverage, which is enforced through the evaluation benchmark.",
  },
  {
    title: "2. Cloudflare D1 + Asynchronous ctx.waitUntil() Telemetry",
    chosen: "Edge SQLite (Cloudflare D1) written after response dispatch",
    alternative: "Third-party analytics scripts or synchronous DB inserts",
    tradeoff:
      "Using ctx.waitUntil() decouples database write latency from visitor-facing API responses, and D1 failures degrade gracefully without breaking portfolio navigation or chat replies.",
  },
  {
    title: "3. Free-Tier Quota Engineering & Daily D1 Kill Switch",
    chosen: "Atomic D1 daily_usage counter + CHAT_ENABLED kill switch",
    alternative: "Unbounded LLM calls or paid credit auto-top-up",
    tradeoff:
      "Rather than risking unexpected bills or silent upstream 429s, the Worker tracks daily Groq calls in D1 and short-circuits to a polite fallback once 70% of the daily free-tier budget is reached.",
  },
  {
    title: "4. Fail-Closed Origin Checks & IP Rate Limiting",
    chosen: "Strict ALLOWED_ORIGINS check on POST + CF-Connecting-IP sliding window",
    alternative: "Permissive CORS (*) and client-supplied session_id rate limiting",
    tradeoff:
      "Client-supplied session IDs are trivially rotated by scripts. Keying burst limits on CF-Connecting-IP and rejecting POST requests from unknown origins stops casual cross-origin abuse before hitting Groq.",
  },
  {
    title: "5. Session-Scoped Attribution & 30-Day Data Purge",
    chosen: "sessionStorage UUIDs + fresh UTM override + daily cron purge",
    alternative: "Permanent localStorage identifiers and indefinite chat retention",
    tradeoff:
      "Storing session IDs in sessionStorage avoids persistent cross-week tracking while ensuring tagged links (?utm_source=linkedin) always attribute accurately. A daily 03:00 UTC cron scrubs raw user questions older than 30 days.",
  },
];

export const EngineeringPage: React.FC<EngineeringPageProps> = ({ onBack }) => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetch(apiUrl("/api/public-stats"))
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.answered === "number") {
          setStats(data);
        }
      })
      .catch(() => {
        // Non-blocking: hide live metrics if offline
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#1F211F] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4DFD3] pb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF8] hover:bg-[#FFD66B]/40 border border-[#E4DFD3] hover:border-[#EFB323] text-xs font-bold text-[#1F211F] transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#174F91]" />
            <span>Back to Portfolio</span>
          </button>

          <a
            href="https://github.com/Bhavadharani412/Personal_portfolio_v2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#174F91] hover:underline font-semibold"
          >
            <span>Inspect Source & CI on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD66B]/40 border border-[#EFB323] font-mono text-[11px] font-bold text-[#1F211F]">
            <Cpu className="w-3.5 h-3.5 text-[#174F91]" />
            <span>SYSTEM ARCHITECTURE & TRUST LAYER · /engineering</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F211F]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            How This Portfolio Works Under the Hood
          </h1>
          <p className="text-sm sm:text-base text-[#5C5F5B] leading-relaxed max-w-2xl">
            This site is built and operated as a small, verifiable production web system running at{" "}
            <strong className="text-[#1F211F]">$0/month</strong> on React 19, Vite, Cloudflare Workers, Cloudflare D1, and Groq.
          </p>
        </header>

        {/* Live Telemetry Proof Banner */}
        <section className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-[#EFB323]/20 border border-[#EFB323] flex items-center justify-center text-[#174F91]">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#174F91]">
                Live Edge Telemetry (Last 30 Days)
              </h2>
              <p className="text-xs text-[#5C5F5B]">
                Aggregated directly from <code className="font-mono text-[11px]">GET /api/public-stats</code> (cached 5m)
              </p>
            </div>
          </div>

          {stats ? (
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-[#5C5F5B] block text-[10px]">QUESTIONS ANSWERED</span>
                <span className="text-sm font-bold text-[#1F211F]">{stats.answered}</span>
              </div>
              <div>
                <span className="text-[#5C5F5B] block text-[10px]">AVG INFERENCE LATENCY</span>
                <span className="text-sm font-bold text-[#174F91]">
                  {stats.avg_latency_ms > 0 ? `${stats.avg_latency_ms} ms` : "—"}
                </span>
              </div>
              <div>
                <span className="text-[#5C5F5B] block text-[10px]">BUILD SHA</span>
                <span className="text-xs font-bold text-[#1F211F]">{stats.build.slice(0, 7)}</span>
              </div>
            </div>
          ) : (
            <span className="font-mono text-xs text-[#5C5F5B]">
              Telemetry endpoint ready · Connect Worker to populate live D1 metrics
            </span>
          )}
        </section>

        {/* Architecture Diagram */}
        <section className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#174F91]">
            <Database className="w-4 h-4" />
            <span>Request & Data Flow Architecture</span>
          </div>
          <pre className="p-4 rounded-2xl bg-[#F8F5ED] border border-[#E4DFD3] font-mono text-[11px] sm:text-xs text-[#1F211F] overflow-x-auto leading-relaxed">
{`Visitor Browser (React 19 + Vite SPA on Vercel)
   │  ├── Renders portfolio works, timeline, writing & Bhava 2.0 UI
   │  └── Captures session-scoped UTM attribution (sessionStorage)
   │
   │  HTTPS JSON (POST /api/chat, POST /api/events, GET /api/public-stats)
   ▼
Cloudflare Worker API Boundary (worker/index.ts)
   ├── 1. Fail-closed Origin validation (ALLOWED_ORIGINS)
   ├── 2. 4 KB payload cap (readJson) & schema validation
   ├── 3. Sliding-window IP rate limiter (CF-Connecting-IP)
   ├── 4. D1 daily_usage budget check & CHAT_ENABLED kill switch
   ├── 5. Deterministic keyword retrieval (worker/knowledge.ts)
   │      └── Cites verified Markdown sources (content/*.md)
   ├── 6. Grounded Groq inference + post-generation claim verification
   └── 7. Non-blocking D1 telemetry writes via ctx.waitUntil()
          └── Daily 03:00 UTC cron purges raw questions > 30 days old`}
          </pre>
        </section>

        {/* Five Key Engineering Decisions */}
        <section className="space-y-4">
          <h2
            className="text-xl font-bold text-[#1F211F]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Five Architectural Decisions & Trade-Offs
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {DECISIONS.map((d) => (
              <div
                key={d.title}
                className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] space-y-2"
              >
                <h3 className="text-sm font-bold text-[#174F91]">{d.title}</h3>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFD66B]/45 border border-[#EFB323] text-[#1F211F] font-semibold">
                    Chosen: {d.chosen}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F8F5ED] border border-[#E4DFD3] text-[#5C5F5B]">
                    Alternative: {d.alternative}
                  </span>
                </div>
                <p className="text-xs text-[#5C5F5B] leading-relaxed">{d.tradeoff}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Threat Model & Honest Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#174F91]">
              <Lock className="w-4 h-4" />
              <span>Threat Model & Mitigations</span>
            </div>
            <ul className="space-y-2 text-xs text-[#5C5F5B] leading-relaxed list-disc pl-4">
              <li>
                <strong className="text-[#1F211F]">Quota Drain / Token Exhaustion:</strong> Mitigated by 500-char message caps, 4 KB body limits, per-IP rate limiting, and the D1 <code className="font-mono">daily_usage</code> hard cap.
              </li>
              <li>
                <strong className="text-[#1F211F]">Prompt Injection & Hallucination:</strong> System prompt enforces strict first-person grounding; adversarial prompt patterns are blocked pre-flight; ungrounded employer/tech claims are stripped post-generation.
              </li>
              <li>
                <strong className="text-[#1F211F]">Cross-Site API Abuse:</strong> <code className="font-mono">POST</code> endpoints enforce an explicit <code className="font-mono">Origin</code> allow-list and return HTTP 403 when missing or mismatched.
              </li>
              <li>
                <strong className="text-[#1F211F]">XSS via LLM Output:</strong> Chat responses are rendered as React text nodes via a bounded inline formatter—never <code className="font-mono">dangerouslySetInnerHTML</code>.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#EFB323]">
              <AlertTriangle className="w-4 h-4 text-[#174F91]" />
              <span className="text-[#174F91]">Known Limitations (Honest Assessment)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#5C5F5B] leading-relaxed list-disc pl-4">
              <li>
                <strong className="text-[#1F211F]">Per-Isolate Memory Rate Limiting:</strong> The sliding-window IP map lives in Worker isolate memory and resets across cold starts or multiple edge colos. It serves as burst control, while D1 enforces the global daily cap.
              </li>
              <li>
                <strong className="text-[#1F211F]">Single-Turn Stateless Chat:</strong> Each question is answered independently against retrieved portfolio evidence to keep token usage predictable and prevent multi-turn prompt drift.
              </li>
              <li>
                <strong className="text-[#1F211F]">Origin Header Spoofing:</strong> Non-browser scripts can forge an <code className="font-mono">Origin</code> header; defense-in-depth relies on the IP limiter and D1 daily budget cap.
              </li>
              <li>
                <strong className="text-[#1F211F]">CI Offline vs Live Eval:</strong> Pull-request CI runs deterministic offline retrieval checks; live LLM evaluation requires <code className="font-mono">GROQ_API_KEY</code> in the scheduled nightly workflow.
              </li>
            </ul>
          </section>
        </div>

        {/* Footer Privacy Assurance */}
        <section className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#E4DFD3] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#174F91] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#5C5F5B] leading-relaxed">
            <div className="font-bold text-[#1F211F]">Privacy & Data Retention Policy</div>
            <p>
              Analytics use a random per-tab <code className="font-mono">sessionStorage</code> ID with no cookies, no cross-site tracking, and no personal data collection. Chat questions are sent to Groq for inference and logged in Cloudflare D1 for quality review; raw question content is automatically replaced with <code className="font-mono">[purged]</code> after 30 days.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
