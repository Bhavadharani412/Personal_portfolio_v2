export type AllowedEventType =
  | "page_view"
  | "project_view"
  | "github_click"
  | "live_demo_click"
  | "article_click"
  | "resume_click"
  | "contact_click"
  | "chat_started"
  | "chat_message"
  | "chat_response";

export type AttributionSource = "linkedin" | "github" | "resume" | "application" | "direct";

const SESSION_KEY = "portfolio_session_id";
const ATTRIBUTION_KEY = "portfolio_attribution";

interface AttributionData {
  source: AttributionSource;
  medium?: string;
  campaign?: string;
  landing_page?: string;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr_session";

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getAttributionData(): AttributionData {
  if (typeof window === "undefined") return { source: "direct" };

  const stored = localStorage.getItem(ATTRIBUTION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }

  // Parse URL search params on initial landing
  const params = new URLSearchParams(window.location.search);
  const rawSource = params.get("utm_source")?.toLowerCase();

  let source: AttributionSource = "direct";
  if (rawSource && ["linkedin", "github", "resume", "application"].includes(rawSource)) {
    source = rawSource as AttributionSource;
  }

  const attribution: AttributionData = {
    source,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    landing_page: window.location.pathname || "/",
  };

  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return attribution;
}

export async function trackEvent(
  eventType: AllowedEventType,
  metadata?: Record<string, unknown>,
  projectId?: string
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const sessionId = getOrCreateSessionId();
    const attribution = getAttributionData();

    const payload = {
      session_id: sessionId,
      event_type: eventType,
      page: window.location.pathname,
      project_id: projectId,
      metadata,
      attribution,
    };

    // Best-effort fire-and-forget fetch
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently ignore analytics network failures
    });
  } catch (err) {
    // Non-blocking catch
    console.debug("Analytics dispatch error (ignored):", err);
  }
}
