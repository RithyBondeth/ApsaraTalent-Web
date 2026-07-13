import { describe, expect, it } from "vitest";
import { isUuid } from "./check-uuid";

describe("isUuid", () => {
  it("accepts valid RFC 4122 UUIDs", () => {
    expect(isUuid("1d7f2db1-8c0a-4c9d-a469-c6b831aab9df")).toBe(true);
  });

  it("rejects malformed and unsupported UUID values", () => {
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("1d7f2db1-8c0a-6c9d-a469-c6b831aab9df")).toBe(false);
  });
});
