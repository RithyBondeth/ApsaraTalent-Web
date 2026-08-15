import type { TPixelGlyph } from "./glyphs";

export interface IPixelIconProps {
  /** Which glyph to draw. See PIXEL_GLYPHS for the set. */
  name: TPixelGlyph;
  /**
   * Rendered size in px. Best at multiples of 9 (18, 27, 36, 45, 72) — the
   * grid is 9 cells, so anything else lands cell edges on fractional pixels
   * and the shape softens, which is the one thing a pixel icon must not do.
   */
  size?: number;
  /**
   * Accessible name. Omit when the icon sits next to text that already says
   * the same thing — it then renders aria-hidden rather than making a screen
   * reader announce the label twice.
   */
  label?: string;
  className?: string;
}
