import { apiUrl } from "./api";

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
  | "chat_response"
  | "chat_feedback";

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

  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    const uuid =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    id = `sess_${uuid}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function detectSource(): AttributionSource {
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source")?.toLowerCase();
  if (utm && ["linkedin", "github", "resume", "application"].includes(utm)) {
    return utm as AttributionSource;
  }

  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    /* ignore */
  }

  if (host.endsWith("linkedin.com") || host === "lnkd.in") return "linkedin";
  if (host.endsWith("github.com")) return "github";
  return "direct";
}

export function getAttributionData(): AttributionData {
  if (typeof window === "undefined") return { source: "direct" };

  const params = new URLSearchParams(window.location.search);
  const hasUtmSource = params.has("utm_source");

  if (!hasUtmSource) {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback to recomputing
      }
    }
  }

  const attribution: AttributionData = {
    source: detectSource(),
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    landing_page: window.location.pathname || "/",
  };

  sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
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

    // Best-effort fire-and-forget fetch with keepalive so navigation doesn't drop events
    fetch(apiUrl("/api/events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Silently ignore analytics network failures
    });
  } catch (err) {
    // Non-blocking catch
    console.debug("Analytics dispatch error (ignored):", err);
  }
}
