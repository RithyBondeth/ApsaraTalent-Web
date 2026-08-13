import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseStreamEvent,
  streamFetch,
  type StreamEvent,
} from "./stream-fetch";

describe("parseStreamEvent", () => {
  it("accepts valid events and rejects malformed payloads", () => {
    expect(parseStreamEvent('{"t":"chunk","v":"hello"}')).toEqual({
      t: "chunk",
      v: "hello",
    });
    expect(parseStreamEvent('{"t":"done"}')).toEqual({ t: "done" });
    expect(parseStreamEvent('{"t":"error","v":"limit","code":429}')).toEqual({
      t: "error",
      v: "limit",
      code: 429,
    });
    expect(parseStreamEvent('{"t":"error","v":"oops","code":"bad"}')).toEqual({
      t: "error",
      v: "oops",
      code: undefined,
    });
    expect(parseStreamEvent("not-json")).toBeNull();
    expect(parseStreamEvent("null")).toBeNull();
    expect(parseStreamEvent('{"t":"chunk","v":2}')).toBeNull();
  });
});

describe("streamFetch", () => {
  afterEach(() => vi.restoreAllMocks());

  it("decodes partial SSE chunks and ignores unrelated lines", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"t":"chunk","v":"hel'));
        controller.enqueue(
          encoder.encode(
            'lo"}\nevent: ping\ndata: malformed\ndata: {"t":"done"}',
          ),
        );
        controller.close();
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(body, { status: 200 })),
    );
    const events: StreamEvent[] = [];
    await streamFetch(
      "/api/stream",
      { method: "POST", body: { prompt: "Hi" } },
      (event) => events.push(event),
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/stream",
      expect.objectContaining({
        method: "POST",
        body: '{"prompt":"Hi"}',
        credentials: "include",
      }),
    );
    expect(events).toEqual([{ t: "chunk", v: "hello" }, { t: "done" }]);
  });

  it("surfaces string and array API error messages", async () => {
    const onString = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ message: "Daily limit reached" }, { status: 429 }),
      ),
    );
    await streamFetch("/api/stream", {}, onString);
    expect(onString).toHaveBeenCalledWith({
      t: "error",
      v: "Daily limit reached",
      code: 429,
    });

    const onArray = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ message: ["First", "Second"] }, { status: 400 }),
      ),
    );
    await streamFetch("/api/stream", {}, onArray);
    expect(onArray).toHaveBeenCalledWith({
      t: "error",
      v: "First, Second",
      code: 400,
    });
  });

  it("falls back to the status when the error response is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("bad gateway", { status: 502 })),
    );
    const onEvent = vi.fn();
    await streamFetch("/api/stream", {}, onEvent);
    expect(onEvent).toHaveBeenCalledWith({
      t: "error",
      v: "Request failed (502)",
      code: 502,
    });
  });
});
