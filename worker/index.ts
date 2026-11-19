import { Env, ChatRequest, EventRequest, OperationalLog } from "./types";
import { checkRateLimit } from "./rateLimiter";
import { retrieveRelevantKnowledge } from "./knowledge";
import { callGroqLLM, FALLBACK_MESSAGES } from "./groq";
import { validateEventPayload, recordEventInD1, recordChatMessageInD1 } from "./analytics";

function parseAllowed(env: Env): string[] {
  return (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getCorsHeaders(env: Env, request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Request-ID, X-Session-ID",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    Vary: "Origin",
  };
  if (origin && parseAllowed(env).includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function createJsonResponse(data: unknown, status: number, headers: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

async function readJson<T>(request: Request, maxBytes = 4096): Promise<T> {
  if (Number(request.headers.get("Content-Length") ?? 0) > maxBytes) {
    throw new Error("payload_too_large");
  }
  const text = await request.text();
  if (text.length > maxBytes) {
    throw new Error("payload_too_large");
  }
  return JSON.parse(text) as T;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx?: { waitUntil: (promise: Promise<unknown>) => void }
  ): Promise<Response> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(env, request);

    // Handle OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    let status = 200;
    let errorType: string | undefined;

    const logOperation = (logStatus: number, err?: string) => {
      const durationMs = Date.now() - startTime;
      const logRecord: OperationalLog = {
        request_id: requestId,
        route: url.pathname,
        status: logStatus,
        duration_ms: durationMs,
        error_type: err,
      };
      console.log(JSON.stringify(logRecord));
    };

    try {
      // Fail-closed origin enforcement on POST requests
      if (request.method === "POST") {
        const origin = request.headers.get("Origin");
        if (!origin || !parseAllowed(env).includes(origin)) {
          logOperation(403, "origin_not_allowed");
          return createJsonResponse({ error: "Forbidden", request_id: requestId }, 403, corsHeaders);
        }
      }

      // Route: GET /api/health
      if (request.method === "GET" && url.pathname === "/api/health") {
        logOperation(200);
        return createJsonResponse(
          {
            status: "ok",
            engineer: "Bhavadharani",
            system: "Portfolio Worker API",
            build: env.BUILD_SHA ?? "dev",
            request_id: requestId,
          },
          200,
          corsHeaders
        );
      }

      // Route: GET /api/public-stats
      if (request.method === "GET" && url.pathname === "/api/public-stats") {
        let answered = 0;
        let avgLatencyMs = 0;

        if (env.DB) {
          try {
            const row = await env.DB.prepare(
              `SELECT COUNT(*) AS answered, AVG(latency_ms) AS avg_ms FROM chat_messages WHERE role = 'assistant' AND created_at >= datetime('now','-30 days')`
            ).first<{ answered: number; avg_ms: number | null }>();
            answered = row?.answered ?? 0;
            avgLatencyMs = Math.round(row?.avg_ms ?? 0);
          } catch (err) {
            console.error("D1 public-stats query failed:", err);
          }
        }

        logOperation(200);
        return new Response(
          JSON.stringify({
            window_days: 30,
            answered,
            avg_latency_ms: avgLatencyMs,
            build: env.BUILD_SHA ?? "dev",
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=300",
            },
          }
        );
      }

      // Route: POST /api/events
      if (request.method === "POST" && url.pathname === "/api/events") {
        let body: EventRequest;
        try {
          body = await readJson<EventRequest>(request);
        } catch (err: any) {
          status = 400;
          errorType = err?.message === "payload_too_large" ? "payload_too_large" : "invalid_json";
          logOperation(status, errorType);
          return createJsonResponse(
            {
              error: errorType === "payload_too_large" ? "Request body exceeds maximum allowed size." : "Invalid JSON body",
              request_id: requestId,
            },
            400,
            corsHeaders
          );
        }

        const validation = validateEventPayload(body);
        if (!validation.isValid) {
          status = 400;
          errorType = "validation_error";
          logOperation(status, errorType);
          return createJsonResponse({ error: validation.error, request_id: requestId }, 400, corsHeaders);
        }

        // Non-blocking database execution
        const dbPromise = recordEventInD1(env.DB, body);
        if (ctx?.waitUntil) {
          ctx.waitUntil(dbPromise);
        } else {
          await dbPromise;
        }

        logOperation(200);
        return createJsonResponse({ status: "ok", request_id: requestId }, 200, corsHeaders);
      }

      // Route: POST /api/chat
      if (request.method === "POST" && url.pathname === "/api/chat") {
        let body: ChatRequest;
        try {
          body = await readJson<ChatRequest>(request);
        } catch (err: any) {
          status = 400;
          errorType = err?.message === "payload_too_large" ? "payload_too_large" : "invalid_json";
          logOperation(status, errorType);
          return createJsonResponse(
            {
              error: errorType === "payload_too_large" ? "Request body exceeds maximum allowed size." : "Invalid JSON body",
              request_id: requestId,
            },
            400,
            corsHeaders
          );
        }

        const message = body.message?.trim();
        if (!message) {
          status = 400;
          errorType = "missing_message";
          logOperation(status, errorType);
          return createJsonResponse(
            { error: "A non-empty message string is required.", request_id: requestId },
            400,
            corsHeaders
          );
        }

        if (message.length > 500) {
          status = 400;
          errorType = "message_too_long";
          logOperation(status, errorType);
          return createJsonResponse(
            { error: "Message length exceeds the 500 character limit.", request_id: requestId },
            400,
            corsHeaders
          );
        }

        const sessionId = body.session_id || request.headers.get("CF-Connecting-IP") || "anonymous_session";
        const chatSessionId = body.chat_session_id || `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // Rate limit by client IP, not client-supplied session_id
        const rateLimitConfig = parseInt(env.RATE_LIMIT_PER_MINUTE || "10", 10);
        const clientKey = request.headers.get("CF-Connecting-IP") || "unknown";
        const rateCheck = checkRateLimit(clientKey, rateLimitConfig, 60000);

        if (!rateCheck.isAllowed) {
          status = 429;
          errorType = "rate_limit_exceeded";
          logOperation(status, errorType);
          return createJsonResponse(
            {
              reply: FALLBACK_MESSAGES.rateLimited,
              error: "Rate limit exceeded. Please wait a moment before asking another question.",
              request_id: requestId,
            },
            429,
            corsHeaders
          );
        }

        // Daily budget & CHAT_ENABLED kill switch
        const dailyBudget = Number(env.DAILY_CHAT_BUDGET || "200");
        let dailyCalls = 0;
        if (env.DB) {
          const today = new Date().toISOString().slice(0, 10);
          const usage = await env.DB.prepare(
            "INSERT INTO daily_usage (day, chat_calls) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET chat_calls = chat_calls + 1 RETURNING chat_calls"
          )
            .bind(today)
            .first<{ chat_calls: number }>();
          dailyCalls = usage?.chat_calls ?? 0;
        }

        if (env.CHAT_ENABLED === "false" || dailyCalls > dailyBudget) {
          status = 429;
          errorType = "daily_budget_exceeded";
          logOperation(status, errorType);
          return createJsonResponse(
            { reply: FALLBACK_MESSAGES.rateLimited, request_id: requestId },
            429,
            corsHeaders
          );
        }

        // Retrieve structured knowledge evidence
        const retrievalResult = retrieveRelevantKnowledge(message);
        const evidence = retrievalResult?.evidence || null;

        // Call Groq safely
        const groqResult = await callGroqLLM(env.GROQ_API_KEY, message, evidence, env.GROQ_MODEL);

        // Record user query and response in D1 non-blockingly
        const recordUserMsg = recordChatMessageInD1(env.DB, sessionId, chatSessionId, "user", message, 0, "success");
        const recordBotMsg = recordChatMessageInD1(
          env.DB,
          sessionId,
          chatSessionId,
          "assistant",
          groqResult.reply,
          groqResult.latency_ms,
          groqResult.status
        );

        if (ctx?.waitUntil) {
          ctx.waitUntil(Promise.all([recordUserMsg, recordBotMsg]));
        }

        logOperation(200);
        return createJsonResponse(
          {
            reply: groqResult.reply,
            chat_session_id: chatSessionId,
            request_id: requestId,
            sources: retrievalResult?.sources || [],
          },
          200,
          corsHeaders
        );
      }

      // 404 Route Not Found
      status = 404;
      errorType = "not_found";
      logOperation(status, errorType);
      return createJsonResponse({ error: "Endpoint not found", request_id: requestId }, 404, corsHeaders);
    } catch (err: any) {
      status = 500;
      errorType = "internal_server_error";
      console.error("Unhandled Worker Exception:", err);
      logOperation(status, errorType);
      return createJsonResponse(
        { error: "An unexpected error occurred. Please try again later.", request_id: requestId },
        500,
        corsHeaders
      );
    }
  },

  async scheduled(
    _event: unknown,
    env: Env,
    ctx?: { waitUntil: (promise: Promise<unknown>) => void }
  ): Promise<void> {
    if (!env.DB) return;
    const purgePromise = env.DB.prepare(
      `UPDATE chat_messages SET content = '[purged]' WHERE created_at < datetime('now','-30 days') AND content != '[purged]'`
    ).run();
    if (ctx?.waitUntil) {
      ctx.waitUntil(purgePromise);
    } else {
      await purgePromise;
    }
  },
};
