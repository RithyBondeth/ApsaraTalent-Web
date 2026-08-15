import { cn } from "@/lib/utils";
import { PET_HEIGHT, PET_WIDTH, PIXEL_PET_SPRITES } from "./sprites";
import type { IPixelPetProps } from "./props";

/* ---------------------------------------------------------------------------
 * Neak, drawn as one <rect> per lit cell — the same construction as the mosaic
 * and the pixel field, so she is visibly the same material as the page rather
 * than an illustration dropped onto it.
 *
 * Every colour is a token, which is why she can be markup instead of the PNG a
 * mascot usually is: no second asset, no raster to re-export, and she is the
 * one thing the deleted hero illustrations could never be — themeable.
 * ------------------------------------------------------------------------- */

const PALETTE: Record<string, string> = {
  k: "hsl(var(--pixel-ink))",
  g: "hsl(var(--pixel-1))", // gold, lit
  G: "hsl(var(--pixel-2))", // gold
  o: "hsl(var(--pixel-3))", // gold, deep — the crown jewels
  r: "hsl(var(--pixel-4))", // sampot, just visible below the shoulders
  h: "hsl(var(--pet-hair))",
  H: "hsl(var(--pet-hair-lit))", // lit edge, so the hair is not a flat block
  s: "hsl(var(--pet-skin))",
  S: "hsl(var(--pet-skin-shade))",
  w: "hsl(var(--pet-cloth))",
};

export function PixelPet({
  expression = "smiling",
  height = 136,
  label,
  className,
}: IPixelPetProps) {
  const rows = PIXEL_PET_SPRITES[expression];
  const width = Math.round((height / PET_HEIGHT) * PET_WIDTH);

  const cells: Array<{ x: number; y: number; fill: string }> = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = PALETTE[row[x]];
      if (fill) cells.push({ x, y, fill });
    }
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${PET_WIDTH} ${PET_HEIGHT}`}
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    >
      {cells.map(({ x, y, fill }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
      ))}
    </svg>
  );
}
