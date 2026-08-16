import { cn } from "@/lib/utils";
import type { IPixelGridDecorProps } from "./props";

/* ---------------------------------------------------------------------------
 * The banner grid: a real grid of cells with a few restrained cells lit.
 *
 * This started as a CSS `background-size` lattice, which can never be a
 * perfect grid — a fixed 100px tile against an arbitrary container width
 * always clips mid-column, so the right edge showed a sliver and the lit cells
 * never quite lined up with the rules.
 *
 * It is `repeat(N, 1fr)` now. The columns divide the container exactly, so
 * every cell is identical and the last one meets the edge cleanly. The lit
 * cells are part of that same grid rather than absolutely positioned guesses,
 * so alignment is structural instead of arithmetic.
 *
 * Everything is seeded, so a page's arrangement is stable across renders and
 * between the server pass and hydration.
 * ------------------------------------------------------------------------- */

/* Literal strings — Tailwind cannot see `bg-pixel-${n}`. */
const RUNGS = [
  "bg-pixel-1",
  "bg-pixel-2",
  "bg-pixel-3",
  "bg-pixel-4",
  "bg-pixel-5",
] as const;

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function generator(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PixelGridDecor({
  seed,
  cells = 6,
  columns = 14,
  rows = 4,
  className,
}: IPixelGridDecorProps) {
  const random = generator(hash(seed));
  const total = columns * rows;

  // Trim lives in the right side. The wider protected area keeps colour away
  // from headings and filters, even when a title wraps onto a second line.
  const firstFreeCol = Math.ceil(columns * 0.58);

  const litIndexes = new Map<number, { rung: string; strong: boolean }>();
  for (let i = 0; i < cells; i++) {
    const col = firstFreeCol + Math.floor(random() * (columns - firstFreeCol));
    const row = Math.floor(random() * rows);
    litIndexes.set(row * columns + col, {
      rung: RUNGS[Math.floor(random() * RUNGS.length)],
      // A third carry more weight, so the arrangement has depth rather than
      // reading as one flat stipple.
      strong: random() > 0.66,
    });
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        // No explicit rows: each cell is aspect-square, so the row height
        // *equals* the column width and the cells are true squares. With
        // `repeat(rows, 1fr)` the rows divided the banner's height instead,
        // which made every cell a rectangle — and a different rectangle on
        // each page, since banners differ in height. That was the fault.
        gridAutoRows: "min-content",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const lit = litIndexes.get(i);
        return (
          <div
            key={i}
            className="relative grid aspect-square place-items-center border-b border-r border-border/45"
          >
            {lit ? (
              <span
                className={cn(
                  "absolute inset-0",
                  lit.rung,
                  lit.strong ? "opacity-[0.16]" : "opacity-[0.07]",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
