import { Env, ChatRequest, EventRequest, OperationalLog } from "./types";
import { checkRateLimit } from "./rateLimiter";
import { retrieveRelevantKnowledge } from "./knowledge";
import { callGroqLLM, FALLBACK_MESSAGES } from "./groq";
import { validateEventPayload, recordEventInD1, recordChatMessageInD1 } from "./analytics";

function getCorsHeaders(env: Env, request: Request): HeadersInit {
  const allowedOrigin = env.ALLOWED_ORIGINS || "*";
  const origin = request.headers.get("Origin");
  
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-ID, X-Session-ID",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (allowedOrigin === "*" || !origin) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else {
    headers["Access-Control-Allow-Origin"] = allowedOrigin.split(",").includes(origin) ? origin : allowedOrigin;
  }

  return headers;
}

function createJsonResponse(data: any, status: number, headers: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env, ctx?: { waitUntil: (promise: Promise<any>) => void }): Promise<Response> {
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
      // Route: GET /api/health
      if (request.method === "GET" && url.pathname === "/api/health") {
        logOperation(200);
        return createJsonResponse(
          { status: "ok", engineer: "Bhavadharani", system: "Portfolio Worker API", request_id: requestId },
          200,
          corsHeaders
        );
      }

      // Route: POST /api/events
      if (request.method === "POST" && url.pathname === "/api/events") {
        let body: EventRequest;
        try {
          body = (await request.json()) as EventRequest;
        } catch {
          status = 400;
          errorType = "invalid_json";
          logOperation(status, errorType);
          return createJsonResponse({ error: "Invalid JSON body", request_id: requestId }, 400, corsHeaders);
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
          body = (await request.json()) as ChatRequest;
        } catch {
          status = 400;
          errorType = "invalid_json";
          logOperation(status, errorType);
          return createJsonResponse({ error: "Invalid JSON body", request_id: requestId }, 400, corsHeaders);
        }

        const message = body.message?.trim();
        if (!message) {
          status = 400;
          errorType = "missing_message";
          logOperation(status, errorType);
          return createJsonResponse({ error: "A non-empty message string is required.", request_id: requestId }, 400, corsHeaders);
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

        // Rate limit check
        const rateLimitConfig = parseInt(env.RATE_LIMIT_PER_MINUTE || "10", 10);
        const rateCheck = checkRateLimit(sessionId, rateLimitConfig, 60000);

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

        // Retrieve structured knowledge evidence
        const retrievalResult = retrieveRelevantKnowledge(message);
        const evidence = retrievalResult?.evidence || null;

        // Call Groq safely
        const groqResult = await callGroqLLM(env.GROQ_API_KEY, message, evidence, body.history);

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
};
