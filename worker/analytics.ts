import { AllowedEventType, D1Database, EventRequest } from "./types";

export const ALLOWED_EVENTS: Set<AllowedEventType> = new Set([
  "page_view",
  "project_view",
  "github_click",
  "live_demo_click",
  "article_click",
  "resume_click",
  "contact_click",
  "chat_started",
  "chat_message",
  "chat_response",
]);

export const ALLOWED_SOURCES = new Set([
  "linkedin",
  "github",
  "resume",
  "application",
  "direct",
]);

export function validateEventPayload(payload: any): { isValid: boolean; error?: string } {
  if (!payload || typeof payload !== "object") {
    return { isValid: false, error: "Payload must be an object." };
  }

  if (!payload.session_id || typeof payload.session_id !== "string" || !payload.session_id.trim()) {
    return { isValid: false, error: "Missing or invalid session_id." };
  }

  if (!payload.event_type || !ALLOWED_EVENTS.has(payload.event_type as AllowedEventType)) {
    return { isValid: false, error: `Invalid event_type. Allowed: ${Array.from(ALLOWED_EVENTS).join(", ")}` };
  }

  if (payload.metadata) {
    const metaStr = JSON.stringify(payload.metadata);
    if (metaStr.length > 2048) {
      return { isValid: false, error: "Metadata exceeds maximum allowed size of 2KB." };
    }
  }

  return { isValid: true };
}

export async function recordEventInD1(db: D1Database | undefined, eventData: EventRequest): Promise<boolean> {
  if (!db) {
    // If D1 is not bound (e.g. dev mock), soft succeed without error
    return true;
  }

  try {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const metadataStr = eventData.metadata ? JSON.stringify(eventData.metadata) : null;
    const source = eventData.attribution?.source && ALLOWED_SOURCES.has(eventData.attribution.source)
      ? eventData.attribution.source
      : "direct";

    // Ensure session exists in `sessions` table
    await db.prepare(
      `INSERT INTO sessions (session_id, source, medium, campaign, landing_page)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(session_id) DO NOTHING`
    ).bind(
      eventData.session_id,
      source,
      eventData.attribution?.medium || null,
      eventData.attribution?.campaign || null,
      eventData.attribution?.landing_page || eventData.page || "/"
    ).run();

    // Insert event
    await db.prepare(
      `INSERT INTO events (event_id, session_id, event_type, page, project_id, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      eventId,
      eventData.session_id,
      eventData.event_type,
      eventData.page || null,
      eventData.project_id || null,
      metadataStr
    ).run();

    return true;
  } catch (err) {
    console.error("D1 recordEvent failed (non-blocking):", err);
    return false;
  }
}

export async function recordChatMessageInD1(
  db: D1Database | undefined,
  sessionId: string,
  chatSessionId: string,
  role: "user" | "assistant",
  content: string,
  latencyMs: number,
  status: string
): Promise<boolean> {
  if (!db) return true;

  try {
    // Ensure chat_session exists
    await db.prepare(
      `INSERT INTO chat_sessions (chat_session_id, session_id)
       VALUES (?, ?)
       ON CONFLICT(chat_session_id) DO NOTHING`
    ).bind(chatSessionId, sessionId).run();

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.prepare(
      `INSERT INTO chat_messages (message_id, chat_session_id, role, content, latency_ms, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(messageId, chatSessionId, role, content.substring(0, 1000), latencyMs, status).run();

    return true;
  } catch (err) {
    console.error("D1 recordChatMessage failed (non-blocking):", err);
    return false;
  }
}
