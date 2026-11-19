import worker from "../../worker/index";
import { resetRateLimitStore } from "../../worker/rateLimiter";
import { D1Database } from "../../worker/types";

export async function testWorkerAPI() {
  resetRateLimitStore();
  const ALLOWED_ORIGIN = "https://bhavadharani.me";
  const env = {
    ALLOWED_ORIGINS: `${ALLOWED_ORIGIN},http://localhost:3000`,
    RATE_LIMIT_PER_MINUTE: "3",
    DAILY_CHAT_BUDGET: "200",
    CHAT_ENABLED: "true",
    BUILD_SHA: "test_sha_123",
  };

  // 1. GET /api/health
  const healthReq = new Request("http://localhost/api/health", { method: "GET" });
  const healthRes = await worker.fetch(healthReq, env);
  if (healthRes.status !== 200) throw new Error("Expected health endpoint 200");

  const healthBody = (await healthRes.json()) as any;
  if (healthBody.status !== "ok" || healthBody.engineer !== "Bhavadharani") {
    throw new Error("Invalid health response body");
  }

  // 2. GET /api/public-stats
  const statsReq = new Request("http://localhost/api/public-stats", { method: "GET" });
  const statsRes = await worker.fetch(statsReq, env);
  if (statsRes.status !== 200) throw new Error("Expected public-stats endpoint 200");
  const statsBody = (await statsRes.json()) as any;
  if (statsBody.window_days !== 30 || statsBody.build !== "test_sha_123") {
    throw new Error("Invalid public-stats response body");
  }

  // 3. POST with no Origin header -> 403
  const noOriginReq = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello" }),
  });
  const noOriginRes = await worker.fetch(noOriginReq, env);
  if (noOriginRes.status !== 403) {
    throw new Error(`Expected POST without Origin to return 403, got ${noOriginRes.status}`);
  }

  // 4. POST with disallowed Origin -> 403
  const badOriginReq = new Request("http://localhost/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://evil.example.com",
    },
    body: JSON.stringify({ session_id: "s_test_123", event_type: "page_view" }),
  });
  const badOriginRes = await worker.fetch(badOriginReq, env);
  if (badOriginRes.status !== 403) {
    throw new Error(`Expected POST with disallowed Origin to return 403, got ${badOriginRes.status}`);
  }

  // 5. POST with oversized body (> 4096 bytes) -> 400
  const oversizedReq = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: ALLOWED_ORIGIN,
    },
    body: JSON.stringify({ message: "a".repeat(5000) }),
  });
  const oversizedRes = await worker.fetch(oversizedReq, env);
  if (oversizedRes.status !== 400) {
    throw new Error(`Expected oversized POST body to return 400, got ${oversizedRes.status}`);
  }

  // 6. POST /api/events with allowed Origin (including chat_feedback) -> 200
  const eventReq = new Request("http://localhost/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: ALLOWED_ORIGIN,
    },
    body: JSON.stringify({ session_id: "s_test_123", event_type: "chat_feedback", metadata: { rating: "up" } }),
  });
  const eventRes = await worker.fetch(eventReq, env);
  if (eventRes.status !== 200) throw new Error("Expected event POST 200");

  // 7. POST /api/chat IP-based rate limit
  const makeChat = (ip = "203.0.113.10") =>
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: ALLOWED_ORIGIN,
        "CF-Connecting-IP": ip,
      },
      body: JSON.stringify({ message: "Dev Explain AI details", session_id: `sess_${Math.random()}` }),
    });

  const c1 = await worker.fetch(makeChat(), env);
  if (c1.status !== 200) throw new Error("Chat 1 should pass");

  await worker.fetch(makeChat(), env);
  await worker.fetch(makeChat(), env);

  // Even though session_id changes on every request, same CF-Connecting-IP is rate limited on request 4
  const c4 = await worker.fetch(makeChat(), env);
  if (c4.status !== 429) throw new Error("Chat 4 from same IP should be 429 rate limited");

  // 8. Daily budget kill switch & CHAT_ENABLED="false" -> 429
  let simulatedDailyCalls = 2;
  const mockStmt: any = {
    bind: () => mockStmt,
    first: async () => {
      simulatedDailyCalls += 1;
      return { chat_calls: simulatedDailyCalls } as any;
    },
    run: async () => ({ success: true, meta: {} }),
    all: async () => ({ success: true, results: [], meta: {} }),
  };
  const mockDb: D1Database = {
    prepare: () => mockStmt,
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 }),
  };

  const budgetEnv = {
    ...env,
    DB: mockDb,
    DAILY_CHAT_BUDGET: "2",
  };

  const budgetRes = await worker.fetch(makeChat("198.51.100.77"), budgetEnv);
  if (budgetRes.status !== 429) {
    throw new Error(`Expected daily budget exceeded to return 429, got ${budgetRes.status}`);
  }

  const disabledRes = await worker.fetch(makeChat("198.51.100.88"), {
    ...env,
    CHAT_ENABLED: "false",
  });
  if (disabledRes.status !== 429) {
    throw new Error(`Expected CHAT_ENABLED=false to return 429, got ${disabledRes.status}`);
  }
}
