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

app.use(express.json());

const workerEnv: Env = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "*",
  RATE_LIMIT_PER_MINUTE: process.env.RATE_LIMIT_PER_MINUTE || "10",
};

// Delegate API requests to Cloudflare Worker Handler for parity
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

  const workerReq = new Request(fullUrl, {
    method: req.method,
    headers: requestHeaders,
    body: ["POST", "PUT", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
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
