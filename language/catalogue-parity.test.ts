import { describe, expect, it } from "vitest";
import en from "./en.json";
import km from "./km.json";

/* ---------------------------------------------------------------------------
 * The two catalogues have to carry the same keys.
 *
 * Nothing was checking this. A string added to en.json and forgotten in km.json
 * renders as the raw key path to a Khmer reader, and the only way to find it was
 * to switch language and read every page. The eyebrows on the search and
 * settings banners were the reverse of the same problem — hardcoded English
 * sitting where a catalogue lookup belonged, so no missing key was ever
 * reported.
 * ------------------------------------------------------------------------- */

function keyPaths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("translation catalogues", () => {
  const enKeys = keyPaths(en);
  const kmKeys = keyPaths(km);

  it("carry exactly the same keys in both languages", () => {
    const inKm = new Set(kmKeys);
    const inEn = new Set(enKeys);

    expect(enKeys.filter((k) => !inKm.has(k))).toEqual([]);
    expect(kmKeys.filter((k) => !inEn.has(k))).toEqual([]);
  });

  it("leaves no string empty in either language", () => {
    const empty = (source: Record<string, unknown>, label: string) =>
      keyPaths(source)
        .filter((path) => {
          const value = path
            .split(".")
            .reduce<unknown>(
              (acc, k) => (acc as Record<string, unknown>)?.[k],
              source,
            );
          return typeof value === "string" && value.trim() === "";
        })
        .map((path) => `${label}:${path}`);

    expect([
      ...empty(en as Record<string, unknown>, "en"),
      ...empty(km as Record<string, unknown>, "km"),
    ]).toEqual([]);
  });
});
