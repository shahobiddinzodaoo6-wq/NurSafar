import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

/**
 * Converts any RTK-Query or Redux error into a human-readable string.
 * Also logs the raw error object to the Metro console for debugging.
 *
 * RTK-Query error shapes:
 *   Network failure  → { status: 'FETCH_ERROR',   error: string }
 *   Parse failure    → { status: 'PARSING_ERROR', error: string, originalStatus: number }
 *   Timeout          → { status: 'TIMEOUT_ERROR', error: string }
 *   HTTP 4xx/5xx     → { status: number,          data: { message: string|string[], error: string } }
 */
export function parseRtkError(
  err: FetchBaseQueryError | SerializedError | unknown,
  context = "REQUEST"
): string {
  // Always log the raw error so developers can see it in Metro/terminal
  console.error(`[NurSafar ${context} ERROR]`, JSON.stringify(err, null, 2));

  if (!err) return "An unexpected error occurred.";

  const rtkErr = err as FetchBaseQueryError;

  // ── Network-level failures ──────────────────────────────────────────────────
  if (rtkErr.status === "FETCH_ERROR") {
    return (
      "Cannot reach the server.\n\n" +
      "Please check:\n" +
      "• .env file has your PC's real IP (not 192.168.1.X)\n" +
      "• Backend is running on port 3001\n" +
      "• Phone and PC are on the same Wi-Fi\n" +
      "• Restart Metro with:  npx expo start --clear"
    );
  }

  if (rtkErr.status === "PARSING_ERROR") {
    return "The server returned an unexpected response. Is the backend running?";
  }

  if (rtkErr.status === "TIMEOUT_ERROR") {
    return "Request timed out. Check your network connection.";
  }

  // ── HTTP errors (NestJS returns { statusCode, message, error }) ─────────────
  if (typeof rtkErr.status === "number") {
    const data = rtkErr.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    if (data?.message) {
      // NestJS ValidationPipe returns an array of field errors on 400
      return Array.isArray(data.message)
        ? data.message.join("\n")
        : data.message;
    }

    // Fallback per status code
    if (rtkErr.status === 401) return "Invalid email or password.";
    if (rtkErr.status === 403) return "Your account is not yet approved by an admin.";
    if (rtkErr.status === 409) return "An account with this email or phone already exists.";
    if (rtkErr.status === 400) return "Invalid request. Please check your inputs.";
    if (rtkErr.status >= 500) return "Server error. Please try again later.";
  }

  // ── Unexpected JS error (SerializedError) ───────────────────────────────────
  const serialized = err as SerializedError;
  if (serialized.message) return serialized.message;

  return "An unexpected error occurred. Check the Metro console for details.";
}
