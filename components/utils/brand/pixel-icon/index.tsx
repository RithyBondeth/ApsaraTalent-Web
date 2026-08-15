import { cn } from "@/lib/utils";
import { PIXEL_GLYPHS } from "./glyphs";
import type { IPixelIconProps } from "./props";

/* ---------------------------------------------------------------------------
 * A glyph from the 9×9 bitmap set, drawn as one <rect> per inked cell.
 *
 * Rects rather than a traced path: a path would let a renderer antialias the
 * outline, and a pixel icon with soft edges is just a small bad icon. Square
 * cells on integer coordinates stay hard at any size.
 *
 * Everything is currentColor, so an icon inherits from whatever it sits in and
 * follows the theme for free — which is exactly what the deleted empty-state
 * SVGs could not do.
 * ------------------------------------------------------------------------- */

const GRID = 9;

export function PixelIcon({
  name,
  size = 36,
  label,
  className,
}: IPixelIconProps) {
  const rows = PIXEL_GLYPHS[name];

  const cells: Array<{ x: number; y: number }> = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") cells.push({ x, y });
    }
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${GRID} ${GRID}`}
      fill="currentColor"
      // shape-rendering keeps the cell edges hard when `size` is not a clean
      // multiple of 9 — the browser snaps instead of feathering.
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    >
      {cells.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  );
}
