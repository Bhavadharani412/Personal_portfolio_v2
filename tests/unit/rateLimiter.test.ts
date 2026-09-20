import { checkRateLimit, resetRateLimitStore } from "../../worker/rateLimiter";

export function testRateLimiter() {
  resetRateLimitStore();

  const res1 = checkRateLimit("user_1", 3, 60000);
  if (!res1.isAllowed || res1.remaining !== 2) throw new Error("Expected res1 allowed");

  const res2 = checkRateLimit("user_1", 3, 60000);
  if (!res2.isAllowed || res2.remaining !== 1) throw new Error("Expected res2 allowed");

  checkRateLimit("user_limit", 2, 60000);
  checkRateLimit("user_limit", 2, 60000);
  const blocked = checkRateLimit("user_limit", 2, 60000);
  if (blocked.isAllowed) throw new Error("Expected 3rd call to be rate limited");
}
