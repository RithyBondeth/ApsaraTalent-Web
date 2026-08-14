import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./get-error-message";

describe("getErrorMessage", () => {
  it("extracts direct and array messages", () => {
    expect(getErrorMessage({ type: "required", message: "Required" })).toBe(
      "Required",
    );
    expect(
      getErrorMessage([
        undefined,
        { type: "validate", message: "Second error" },
      ]),
    ).toBe("Second error");
  });

  it("ignores missing and non-string messages", () => {
    expect(getErrorMessage(undefined)).toBeUndefined();
    expect(getErrorMessage({ type: "required" })).toBeUndefined();
    expect(
      getErrorMessage({ type: "required", message: 12 } as never),
    ).toBeUndefined();
    expect(getErrorMessage([undefined])).toBeUndefined();
  });
});
