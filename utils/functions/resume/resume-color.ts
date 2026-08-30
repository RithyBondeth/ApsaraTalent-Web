/**
 * Color math for the custom accent feature. The user picks a single hex
 * accent; the rest of the accent family (soft tint, dark header, readable
 * header text) is derived so every combination stays coherent and legible.
 *
 * The server PDF renderer mirrors this exact math — keep both in sync
 * (apsaratalent-api .../resume-html-import/resume-html-template.util.ts).
 */

/* -------------------------------- Constants -------------------------------- */
/** Strict #RRGGBB only — this value is rendered into PDF HTML, so nothing
 *  looser (named colors, rgb(), url(...)) is ever accepted. */
export const CUSTOM_ACCENT_PATTERN = /^#[0-9A-Fa-f]{6}$/;

/* --------------------------------- Methods --------------------------------- */
export function isValidCustomAccent(value?: string): value is string {
  return Boolean(value && CUSTOM_ACCENT_PATTERN.test(value));
}

function channels(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

/** Blend `hex` toward `target` by `weight` (0 = hex, 1 = target). */
function mixHex(
  hex: string,
  target: [number, number, number],
  weight: number,
): string {
  const source = channels(hex);
  return toHex([
    source[0] * (1 - weight) + target[0] * weight,
    source[1] * (1 - weight) + target[1] * weight,
    source[2] * (1 - weight) + target[2] * weight,
  ]);
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface ICustomAccentColors {
  accent: string;
  accentSoft: string;
  header: string;
  headerText: string;
}

/** WCAG contrast ratio between two colors. */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la >= lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Derive the full accent family from a single user-picked hex color:
 * - accentSoft: 85% white tint (chip/soft-header background)
 * - header: 35% black shade (solid header background)
 * - headerText: white or near-black — whichever contrasts better on `header`
 */
export function deriveCustomAccentColors(
  customAccent: string,
): ICustomAccentColors {
  const header = mixHex(customAccent, [0, 0, 0], 0.35);
  return {
    accent: customAccent.toUpperCase(),
    accentSoft: mixHex(customAccent, [255, 255, 255], 0.85),
    header,
    headerText:
      contrastRatio(header, "#FFFFFF") >= contrastRatio(header, "#1E293B")
        ? "#FFFFFF"
        : "#1E293B",
  };
}
