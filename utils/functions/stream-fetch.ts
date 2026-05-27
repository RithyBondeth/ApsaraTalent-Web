import { getCookie } from "cookies-next";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

/** SSE event shape emitted by the API gateway streaming endpoints. */
export type StreamEvent =
  | { t: "chunk"; v: string }
  | { t: "done" }
  | { t: "error"; v: string };

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
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok || !res.body) {
    onEvent({ t: "error", v: `Request failed (${res.status})` });
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
