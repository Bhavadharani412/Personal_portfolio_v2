import { validateEventPayload } from "../../worker/analytics";

export function testAnalyticsValidation() {
  const valid = validateEventPayload({
    session_id: "sess_123",
    event_type: "page_view",
    page: "/",
  });
  if (!valid.isValid) throw new Error("Expected valid payload");

  const invalid = validateEventPayload({
    session_id: "sess_123",
    event_type: "invalid_event_type_name",
  });
  if (invalid.isValid) throw new Error("Expected invalid payload");

  const missingSess = validateEventPayload({
    event_type: "page_view",
  });
  if (missingSess.isValid) throw new Error("Expected missing session_id to fail");

  const hugeString = "a".repeat(2500);
  const oversized = validateEventPayload({
    session_id: "sess_123",
    event_type: "project_view",
    metadata: { blob: hugeString },
  });
  if (oversized.isValid) throw new Error("Expected metadata >2KB to fail");
}
