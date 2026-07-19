import { describe, expect, it } from "vitest";
import {
  CUSTOM_ACCENT_PATTERN,
  deriveCustomAccentColors,
  isValidCustomAccent,
  relativeLuminance,
} from "./resume-color";
import { resumeDesignSchema } from "./resume-draft";
import { buildTemplateBaseDesign } from "./resume-design";

describe("custom accent validation", () => {
  it("accepts strict #RRGGBB only", () => {
    expect(isValidCustomAccent("#1A2B3C")).toBe(true);
    expect(isValidCustomAccent("#abcdef")).toBe(true);
    // Everything looser is rejected — this string reaches PDF HTML.
    expect(isValidCustomAccent("#abc")).toBe(false);
    expect(isValidCustomAccent("#aabbccdd")).toBe(false);
    expect(isValidCustomAccent("red")).toBe(false);
    expect(isValidCustomAccent("rgb(1,2,3)")).toBe(false);
    expect(isValidCustomAccent("#12345g")).toBe(false);
    expect(isValidCustomAccent('#123456"><script>')).toBe(false);
    expect(isValidCustomAccent(undefined)).toBe(false);
  });

  it("is enforced by the design zod schema", () => {
    const base = buildTemplateBaseDesign("modern");
    expect(
      resumeDesignSchema.safeParse({ ...base, customAccent: "#0EA5E9" })
        .success,
    ).toBe(true);
    expect(resumeDesignSchema.safeParse(base).success).toBe(true);
    for (const bad of ["blue", "#fff", "url(x)", "#0EA5E9; color: red"]) {
      expect(
        resumeDesignSchema.safeParse({ ...base, customAccent: bad }).success,
      ).toBe(false);
    }
  });
});

describe("custom accent derivation", () => {
  it("derives a coherent accent family", () => {
    const colors = deriveCustomAccentColors("#0ea5e9");
    expect(colors.accent).toBe("#0EA5E9");
    expect(colors.accentSoft).toMatch(CUSTOM_ACCENT_PATTERN);
    expect(colors.header).toMatch(CUSTOM_ACCENT_PATTERN);
    // Soft tint is lighter, header is darker than the accent itself
    expect(relativeLuminance(colors.accentSoft)).toBeGreaterThan(
      relativeLuminance(colors.accent),
    );
    expect(relativeLuminance(colors.header)).toBeLessThan(
      relativeLuminance(colors.accent),
    );
  });

  it("keeps header text readable for light and dark picks", () => {
    // Dark pick -> dark header -> white text
    expect(deriveCustomAccentColors("#1E3A8A").headerText).toBe("#FFFFFF");
    // Very light pick -> header stays light-ish -> dark text
    expect(deriveCustomAccentColors("#FFF7AA").headerText).toBe("#1E293B");
  });

  it("is deterministic", () => {
    expect(deriveCustomAccentColors("#BE185D")).toEqual(
      deriveCustomAccentColors("#BE185D"),
    );
  });
});
