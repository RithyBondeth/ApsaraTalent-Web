/** SSE event shape emitted by the API gateway streaming endpoints. */
export type StreamEvent =
  | { t: "chunk"; v: string }
  | { t: "done" }
  | { t: "error"; v: string; code?: number };

export function parseStreamEvent(payload: string): StreamEvent | null {
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object") return null;
    const event = parsed as Record<string, unknown>;
    if (event.t === "done") return { t: "done" };
    if (event.t === "chunk" && typeof event.v === "string") {
      return { t: "chunk", v: event.v };
    }
    if (event.t === "error" && typeof event.v === "string") {
      return {
        t: "error",
        v: event.v,
        code: typeof event.code === "number" ? event.code : undefined,
      };
    }
  } catch {
    // Ignore malformed events from a broken or interrupted stream.
  }
  return null;
}

/**
 * Fetch a streaming SSE endpoint and call `onEvent` for each parsed event.
 * Supports both GET and POST (pass `body` for POST).
 * Authentication is sent through the API's httpOnly cookies.
 */
export async function streamFetch(
  url: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
    signal?: AbortSignal;
  },
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const res = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
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
  const emitLine = (line: string) => {
    if (!line.startsWith("data: ")) return;
    const event = parseStreamEvent(line.slice(6).trim());
    if (event) onEvent(event);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      buffer += decoder.decode();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep the last (possibly incomplete) line

    lines.forEach(emitLine);
  }

  buffer.split("\n").forEach(emitLine);
}
