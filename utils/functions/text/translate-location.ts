/**
 * Maps lowercase English province names to their i18n key in the "locations" namespace.
 * Handles any casing from the DB (e.g. "Phnom Penh", "phnom penh", "PHNOM PENH").
 */
const LOCATION_KEY_MAP: Record<string, string> = {
  "phnom penh": "phnomPenh",
  "banteay meanchey": "banteayMeanchey",
  battambang: "battambang",
  "kampong cham": "kampongCham",
  "kampong chhnang": "kampongChhnang",
  "kampong speu": "kampongSpeu",
  "kampong thom": "kampongThom",
  kampot: "kampot",
  kandal: "kandal",
  kep: "kep",
  "koh kong": "kohKong",
  kratie: "kratie",
  mondulkiri: "mondulkiri",
  "oddar meanchey": "oddarMeanchey",
  pailin: "pailin",
  "preah sihanouk": "preahSihanouk",
  sihanoukville: "preahSihanouk",
  "preah vihear": "preahVihear",
  "prey veng": "preyVeng",
  pursat: "pursat",
  ratanakiri: "ratanakiri",
  "siem reap": "siemReap",
  "stung treng": "stungTreng",
  "svay rieng": "svayRieng",
  takeo: "takeo",
  "tbong khmum": "tbongKhmum",
};

/**
 * Translates a location string using the "locations" i18n namespace.
 * Falls back to the original string if the location is not in the known list.
 *
 * @param location - Raw location string from the DB (any casing)
 * @param t        - The translator from useTranslations("locations")
 */
export function translateLocation(
  location: string | null | undefined,
  t: (key: string) => string,
): string {
  if (!location) return "";
  const key = LOCATION_KEY_MAP[location.toLowerCase()];
  if (!key) return location;
  return t(key);
}
