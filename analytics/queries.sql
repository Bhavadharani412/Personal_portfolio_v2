-- Portfolio v2 — Operational & Product Analytics Queries (Cloudflare D1)
-- Run with: npx wrangler d1 execute DB --remote --file=analytics/queries.sql

-- 1. Sessions by attribution source, last 30 days
SELECT source, COUNT(*) AS sessions
FROM sessions
WHERE created_at >= datetime('now','-30 days')
GROUP BY source
ORDER BY sessions DESC;

-- 2. Chat latency and failure rates (assistant messages, last 30 days)
SELECT status, COUNT(*) AS n, ROUND(AVG(latency_ms)) AS avg_ms
FROM chat_messages
WHERE role = 'assistant' AND created_at >= datetime('now','-30 days')
GROUP BY status;

-- 3. Most asked visitor questions (exact repeats, excluding purged records)
SELECT content, COUNT(*) AS n
FROM chat_messages
WHERE role = 'user' AND content != '[purged]'
GROUP BY content
ORDER BY n DESC
LIMIT 20;

-- 4. Which projects attract the most visitor attention
SELECT project_id, event_type, COUNT(*) AS n
FROM events
WHERE project_id IS NOT NULL
GROUP BY project_id, event_type
ORDER BY n DESC;

-- 5. Visitor answer quality ratings (thumbs up / down feedback)
SELECT metadata, COUNT(*) AS n
FROM events
WHERE event_type = 'chat_feedback' AND timestamp >= datetime('now','-30 days')
GROUP BY metadata
ORDER BY n DESC;
