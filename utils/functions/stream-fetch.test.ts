import { describe, expect, it } from "vitest";
import { parseStreamEvent } from "./stream-fetch";

describe("parseStreamEvent", () => {
  it("accepts only the supported, typed stream events", () => {
    expect(parseStreamEvent('{"t":"chunk","v":"hello"}')).toEqual({
      t: "chunk",
      v: "hello",
    });
    expect(parseStreamEvent('{"t":"done"}')).toEqual({ t: "done" });
    expect(parseStreamEvent('{"t":"error","v":"busy","code":429}')).toEqual({
      t: "error",
      v: "busy",
      code: 429,
    });
  });

  it("rejects malformed or incorrectly typed events", () => {
    expect(parseStreamEvent("not-json")).toBeNull();
    expect(parseStreamEvent('{"t":"chunk","v":42}')).toBeNull();
    expect(parseStreamEvent('{"t":"unknown","v":"hello"}')).toBeNull();
  });
});
