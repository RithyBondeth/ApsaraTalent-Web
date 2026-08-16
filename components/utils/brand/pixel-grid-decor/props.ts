export interface IPixelGridDecorProps {
  /**
   * What this decoration belongs to — a page key or an eyebrow. The same seed
   * always produces the same lit cells and the same object placement, so every
   * page keeps its own arrangement and it does not reshuffle between renders
   * or between the server pass and hydration.
   */
  seed: string;
  /** How many cells to light. Kept low — this is trim, not a mosaic. */
  cells?: number;
  /**
   * Columns across the container. They divide it with `1fr`, so the cells are
   * always identical and the last one meets the right edge exactly — which a
   * fixed-size background lattice can never do.
   */
  columns?: number;
  /**
   * Rows to draw. Cells are square — the row height equals the column
   * width — so this only needs to overflow the tallest banner; the container
   * clips the remainder.
   */
  rows?: number;
  className?: string;
}
