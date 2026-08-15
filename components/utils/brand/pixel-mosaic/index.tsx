import { cn } from "@/lib/utils";
import type { IPixelMosaicProps, TPixelMosaicDensity } from "./props";

/* ---------------------------------------------------------------------------
 * The pixel mosaic.
 *
 * A square of tiles drawn from the --pixel-* ramp, laid out with no gap so the
 * lit cells fuse into shapes. Which cells light up and how hot each one burns
 * is derived from `seed`, so the mark is stable per subject and different
 * between subjects.
 *
 * This is what replaced the hero illustrations. The SVGs that used to sit here
 * ran 146–320 KB, preloaded with `priority`, and could not follow the theme
 * because they carried no currentColor. A mosaic is a few hundred bytes of
 * markup, resolves entirely through tokens, and — unlike a stock drawing —
 * actually says something: it is derived from the record it sits next to.
 *
 * Not a hashing function in the security sense. It only needs to spread evenly
 * and be stable across a server render and the client hydration that follows,
 * which rules out Math.random().
 * ------------------------------------------------------------------------- */

/** Fraction of tiles that are lit. The rest stay page-coloured. */
const DENSITY: Record<TPixelMosaicDensity, number> = {
  sparse: 0.32,
  medium: 0.48,
  dense: 0.66,
};

/**
 * FNV-1a, 32-bit. Chosen over a hand-rolled `charCodeAt` sum because those
 * collide on anagrams — "Ana Chan" and "Chan Ana" would draw the same mark.
 */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Mulberry32. One `hash()` alone gives 32 bits, which runs out well before a
 * 12×12 grid needs 144 independent decisions, so the seed drives a generator
 * rather than being sliced up.
 */
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

/** Literal strings — Tailwind cannot see `bg-pixel-${n}`. */
const RUNGS = [
  "bg-pixel-1",
  "bg-pixel-2",
  "bg-pixel-3",
  "bg-pixel-4",
  "bg-pixel-5",
  "bg-pixel-6",
] as const;

export function PixelMosaic({
  seed,
  columns = 8,
  density = "medium",
  label,
  className,
}: IPixelMosaicProps) {
  const random = generator(hash(seed));
  const lit = DENSITY[density];
  const total = columns * columns;

  const tiles = Array.from({ length: total }, (_, index) => {
    if (random() > lit) return null;
    // Heat rises left-to-right across the grid rather than being uniform
    // noise. Without this the mosaic is confetti; with it, it has a direction
    // and every mark in the app leans the same way.
    const column = index % columns;
    const bias = column / Math.max(columns - 1, 1);
    const rung = Math.min(
      RUNGS.length - 1,
      Math.floor(random() * 3 + bias * (RUNGS.length - 3)),
    );
    return RUNGS[rung];
  });

  return (
    <div
      className={cn("grid w-full", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      // A mosaic beside the name it depicts is decoration; one standing in for
      // a missing photo is content. `label` is what distinguishes them.
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    >
      {tiles.map((rung, index) => (
        <span
          key={index}
          className={cn("pixel-tile", rung ?? "bg-transparent")}
        />
      ))}
    </div>
  );
}
