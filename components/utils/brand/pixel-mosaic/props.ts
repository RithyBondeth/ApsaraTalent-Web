export type TPixelMosaicDensity = "sparse" | "medium" | "dense";

export interface IPixelMosaicProps {
  /**
   * What the mosaic is a portrait of — a company id, an employee name, a page
   * key. The same seed always produces the same tiles, so a mosaic works as
   * an identity mark: someone recognises their own before reading the label.
   *
   * Pass a stable value. A `Date.now()` or an array index re-rolls the mark on
   * every render and throws that away.
   */
  seed: string;
  /** Tiles per row. The grid is always square, so this is also the row count. */
  columns?: number;
  /** Share of tiles that are lit rather than left as page. */
  density?: TPixelMosaicDensity;
  /**
   * Accessible name. Omit for decoration — the mosaic then renders `aria-hidden`,
   * which is right for the common case where it sits beside the name it depicts
   * and a screen reader would otherwise read the same thing twice.
   */
  label?: string;
  className?: string;
}
