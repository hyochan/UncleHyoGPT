type SessionInfo = {
  lastResetTime: number;
  callCount: number;
};

export const sessionLimits: Record<string, SessionInfo> = {};
export const MAX_CALLS_PER_PERIOD = 100;
export const PERIOD_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

export function isSessionCallLimited(request: Request): boolean {
  const sessionId = request.headers.get("X-Session-Id") || "defaultSession";
  const now = Date.now();

  if (!sessionLimits[sessionId]) {
    // Reset the session info if it doesn't exist
    sessionLimits[sessionId] = {
      lastResetTime: now,
      callCount: 0,
    };
  }

  const sessionInfo = sessionLimits[sessionId];

  // Reset the call count every 4 hours
  if (now - sessionInfo.lastResetTime > PERIOD_DURATION_MS) {
    sessionInfo.lastResetTime = now;
    sessionInfo.callCount = 0;
  }

  // Return a 429 response if the call count exceeds the limit
  if (sessionInfo.callCount >= MAX_CALLS_PER_PERIOD) {
    return true;
  }

  // Increase the call count
  sessionInfo.callCount++;

  return false;
}
