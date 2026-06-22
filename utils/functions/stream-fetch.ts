import { getCookie } from "cookies-next";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

/** SSE event shape emitted by the API gateway streaming endpoints. */
export type StreamEvent =
  | { t: "chunk"; v: string }
  | { t: "done" }
  | { t: "error"; v: string; code?: number };

/**
 * Fetch a streaming SSE endpoint and call `onEvent` for each parsed event.
 * Supports both GET and POST (pass `body` for POST).
 * Automatically attaches the auth-token cookie as a Bearer header.
 */
export async function streamFetch(
  url: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
  },
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const token = getCookie(COOKIE_CONFIG.AUTH_TOKEN);

  const res = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok || !res.body) {
    // Surface the server's message (e.g. the AI rate-limit / daily-quota text
    // from a 429) instead of a bare status code. The gateway returns JSON like
    // { statusCode, error, message } for non-streaming error responses.
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.message === "string" && data.message.trim()) {
        message = data.message;
      } else if (Array.isArray(data?.message) && data.message.length > 0) {
        message = data.message.join(", ");
      }
    } catch {
      // non-JSON body — keep the status-based fallback
    }
    onEvent({ t: "error", v: message, code: res.status });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep the last (possibly incomplete) line

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload) continue;
      try {
        onEvent(JSON.parse(payload) as StreamEvent);
      } catch {
        // ignore malformed events
      }
    }
  }
}
