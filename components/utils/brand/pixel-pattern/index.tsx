import { cn } from "@/lib/utils";
import type { IPixelPatternProps } from "./props";

/* ---------------------------------------------------------------------------
 * The pixel field.
 *
 * A grid of large square tiles, most of them empty, a few tinted a step or two
 * off the page. Up close it is a checkerboard; at a glance it is a texture —
 * which is the point. It goes behind banners, brand panels and hero surfaces
 * as the thing that makes a flat area feel constructed rather than blank.
 *
 * This is not the mosaic. PixelMosaic is a small, saturated, identity-carrying
 * mark derived from a record. This is a large, near-invisible ground that
 * nothing reads as content. They share a grid and nothing else, and mixing
 * them up is how a background ends up shouting over the copy on top of it.
 *
 * Tints come from --foreground / the ramp at low alpha rather than from fixed
 * greys, so the field follows the theme instead of needing a dark twin.
 * ------------------------------------------------------------------------- */

/* Three steps of tint plus empty. Deliberately shallow: at these alphas the
   tiles blend into a texture, and any stronger reads as a checkerboard the eye
   keeps trying to parse. */
const NEUTRAL = [
  "bg-foreground/[0.02]",
  "bg-foreground/[0.035]",
  "bg-foreground/[0.05]",
] as const;

/* The brand ground. Still low, but warm enough to register as the ramp. */
const EMBER = [
  "bg-pixel-3/[0.06]",
  "bg-pixel-4/[0.08]",
  "bg-pixel-5/[0.05]",
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

export function PixelPattern({
  seed,
  cell = 48,
  tone = "neutral",
  density = 0.38,
  columns = 28,
  className,
}: IPixelPatternProps) {
  const random = generator(hash(seed));
  const palette = tone === "ember" ? EMBER : NEUTRAL;
  // Enough rows to overflow any banner-height container; the parent clips.
  const rows = 14;

  const tiles = Array.from({ length: columns * rows }, () => {
    if (random() > density) return null;
    return palette[Math.floor(random() * palette.length)];
  });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${cell}px)`,
          gridAutoRows: `${cell}px`,
        }}
      >
        {tiles.map((tint, index) => (
          <span key={index} className={tint ?? undefined} />
        ))}
      </div>
    </div>
  );
}
