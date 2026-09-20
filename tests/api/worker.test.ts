import worker from "../../worker/index";
import { resetRateLimitStore } from "../../worker/rateLimiter";

export async function testWorkerAPI() {
  resetRateLimitStore();
  const env = { ALLOWED_ORIGINS: "*", RATE_LIMIT_PER_MINUTE: "3" };

  // GET /api/health
  const healthReq = new Request("http://localhost/api/health", { method: "GET" });
  const healthRes = await worker.fetch(healthReq, env);
  if (healthRes.status !== 200) throw new Error("Expected health endpoint 200");

  const healthBody = (await healthRes.json()) as any;
  if (healthBody.status !== "ok" || healthBody.engineer !== "Bhavadharani") {
    throw new Error("Invalid health response body");
  }

  // POST /api/events
  const eventReq = new Request("http://localhost/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: "s_test_123", event_type: "page_view" }),
  });
  const eventRes = await worker.fetch(eventReq, env);
  if (eventRes.status !== 200) throw new Error("Expected event POST 200");

  // POST /api/chat rate limit
  const makeChat = () =>
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Dev Explain AI details", session_id: "s_rate_limit_test" }),
    });

  const c1 = await worker.fetch(makeChat(), env);
  if (c1.status !== 200) throw new Error("Chat 1 should pass");

  await worker.fetch(makeChat(), env);
  await worker.fetch(makeChat(), env);

  const c4 = await worker.fetch(makeChat(), env);
  if (c4.status !== 429) throw new Error("Chat 4 should be 429 rate limited");
}
