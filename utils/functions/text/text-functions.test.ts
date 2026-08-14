import { describe, expect, it, vi } from "vitest";
import { capitalizeWords } from "./capitalize-words";
import { formatAvailabilityWords } from "./format-availability-words";
import { getNameInitials } from "./get-name-initials";
import { translateLocation } from "./translate-location";

describe("text functions", () => {
  it("normalizes capitalization and enum labels", () => {
    expect(capitalizeWords("hELLO woRLD")).toBe("Hello World");
    expect(formatAvailabilityWords("FULL_TIME")).toBe("Full Time");
    expect(formatAvailabilityWords("")).toBe("");
  });

  it("creates bounded uppercase initials", () => {
    expect(getNameInitials("Sok Dara")).toBe("SD");
    expect(getNameInitials("sok dara vann")).toHaveLength(2);
  });

  it("translates known locations and preserves unknown values", () => {
    const t = vi.fn((key: string) => `translated:${key}`);
    expect(translateLocation("PHNOM PENH", t)).toBe("translated:phnomPenh");
    expect(translateLocation("Sihanoukville", t)).toBe(
      "translated:preahSihanouk",
    );
    expect(translateLocation("Somewhere", t)).toBe("Somewhere");
    expect(translateLocation(null, t)).toBe("");
  });
});
