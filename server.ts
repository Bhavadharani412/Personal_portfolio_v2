import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import worker from "./worker/index";
import { Env } from "./worker/types";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST =
  process.env.HOST ||
  (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");

app.use("/api/*", express.text({ type: "*/*", limit: "1mb" }));

const workerEnv: Env = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS ||
    `http://localhost:${PORT},http://127.0.0.1:${PORT},http://localhost:5173`,
  RATE_LIMIT_PER_MINUTE: process.env.RATE_LIMIT_PER_MINUTE || "10",
  DAILY_CHAT_BUDGET: process.env.DAILY_CHAT_BUDGET || "200",
  CHAT_ENABLED: process.env.CHAT_ENABLED || "true",
};

// Delegate API requests to Cloudflare Worker Handler for 1:1 parity
app.all("/api/*", async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const requestHeaders = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => requestHeaders.append(key, v));
      } else {
        requestHeaders.set(key, value);
      }
    }
  }

  const rawBody =
    ["POST", "PUT", "PATCH"].includes(req.method) && typeof req.body === "string"
      ? req.body
      : undefined;

  const workerReq = new Request(fullUrl, {
    method: req.method,
    headers: requestHeaders,
    body: rawBody,
  });

  const workerRes = await worker.fetch(workerReq, workerEnv);

  res.status(workerRes.status);
  workerRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const bodyText = await workerRes.text();
  res.send(bodyText);
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, host: HOST },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    const displayHost = HOST === "127.0.0.1" ? "localhost" : HOST;
    console.log(`Server listening on http://${displayHost}:${PORT}`);
  });
}

start();
