const base = (process.argv[2] || "").replace(/\/$/, "");
const origin = process.argv[3] || "https://bhavadharani.me";

if (!base) {
  console.error("Usage: npm run smoke -- <api-base-url> [allowed-origin]");
  process.exit(1);
}

const fail = (m) => {
  console.error("FAIL:", m);
  process.exit(1);
};

const post = (path, body, headers = {}) =>
  fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

const health = await fetch(`${base}/api/health`);
if (health.status !== 200) fail(`health ${health.status}`);

const stats = await fetch(`${base}/api/public-stats`);
if (stats.status !== 200) fail(`public-stats ${stats.status}`);

const noOrigin = await post("/api/chat", { message: "hi" });
if (noOrigin.status !== 403) fail(`no-origin chat should be 403, got ${noOrigin.status}`);

const tooLong = await post(
  "/api/chat",
  { message: "x".repeat(501), session_id: "smoke" },
  { Origin: origin }
);
if (tooLong.status !== 400) fail(`long message should be 400, got ${tooLong.status}`);

const badEvent = await post(
  "/api/events",
  { session_id: "smoke", event_type: "not_real" },
  { Origin: origin }
);
if (badEvent.status !== 400) fail(`bad event should be 400, got ${badEvent.status}`);

console.log("smoke ok");
