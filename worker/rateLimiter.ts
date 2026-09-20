const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { isAllowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const newResetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime: newResetTime });
    return {
      isAllowed: true,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      isAllowed: false,
      remaining: 0,
      resetMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    isAllowed: true,
    remaining: limit - record.count,
    resetMs: Math.max(0, record.resetTime - now),
  };
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
