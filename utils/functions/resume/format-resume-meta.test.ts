import { describe, expect, it } from "vitest";
import { getYearsExperienceSuffix } from "./format-resume-meta";

describe("getYearsExperienceSuffix", () => {
  it("avoids repeating a year unit already present in the value", () => {
    expect(getYearsExperienceSuffix("3 - 5 years", "yrs exp.")).toBe("exp.");
  });

  it("does not append a suffix when experience is already explicit", () => {
    expect(getYearsExperienceSuffix("5 years experience", "yrs exp.")).toBe(
      "",
    );
  });

  it("uses the localized default for a bare numeric value", () => {
    expect(getYearsExperienceSuffix("5", "yrs exp.")).toBe("yrs exp.");
  });
});
