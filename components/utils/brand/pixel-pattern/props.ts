export type TPixelPatternTone = "neutral" | "ember";

export interface IPixelPatternProps {
  /**
   * What the field is a pattern *of* — a page key, a company id. The same seed
   * always lays out the same tiles, so a banner does not reshuffle on every
   * render or between a server render and its hydration.
   */
  seed: string;
  /** Tile edge in px. The field is a grid of squares this size. */
  cell?: number;
  /**
   * `neutral` tints from --foreground at very low alpha: a texture you read as
   * paper, for banners and panels behind copy. `ember` tints from the pixel
   * ramp for brand moments — louder, so only where nothing has to be read on
   * top of it.
   */
  tone?: TPixelPatternTone;
  /** Share of tiles that are tinted at all. The rest stay page-coloured. */
  density?: number;
  /** How many columns to lay out. Rows are derived to overflow the container. */
  columns?: number;
  className?: string;
}
