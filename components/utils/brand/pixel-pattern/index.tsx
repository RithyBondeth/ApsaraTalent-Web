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
  "fill-foreground/[0.02]",
  "fill-foreground/[0.035]",
  "fill-foreground/[0.05]",
] as const;

/* The brand ground. Still low, but warm enough to register as the ramp. */
const EMBER = [
  "fill-pixel-3/[0.06]",
  "fill-pixel-4/[0.08]",
  "fill-pixel-5/[0.05]",
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

/** Edge of the repeating block, in tiles. At 10 the 400px repeat was faintly
 * readable as horizontal rhythm across a 1440px band; 16 pushes it to ~700px,
 * which is under three repeats on a wide screen and reads as texture. The
 * cost is 256 rects in a <defs> rather than 100 — still nothing. */
const BLOCK = 16;

export function PixelPattern({
  seed,
  cell = 48,
  tone = "neutral",
  density = 0.38,
  className,
}: IPixelPatternProps) {
  const random = generator(hash(seed));
  const palette = tone === "ember" ? EMBER : NEUTRAL;

  const tiles = Array.from({ length: BLOCK * BLOCK }, () => {
    if (random() > density) return null;
    return palette[Math.floor(random() * palette.length)];
  });

  // Deterministic id from the inputs rather than useId(), so this stays a
  // server component. Two instances with identical inputs would share an id,
  // but they would also be pixel-identical, so the collision is harmless.
  const patternId = `pixel-field-${hash(`${seed}|${cell}|${tone}|${density}`).toString(36)}`;

  return (
    <svg
      aria-hidden
      // The previous version laid out a fixed 28 columns of `cell` px, so at
      // cell=40 it was 1120px wide and simply stopped before the right edge of
      // anything wider. An SVG pattern tiles to whatever it is given, which is
      // what "fill the container" actually requires — and it is ~100 nodes
      // instead of one per tile across the whole surface.
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      <defs>
        <pattern
          id={patternId}
          width={cell * BLOCK}
          height={cell * BLOCK}
          patternUnits="userSpaceOnUse"
        >
          {tiles.map((tint, index) =>
            tint ? (
              <rect
                key={index}
                x={(index % BLOCK) * cell}
                y={Math.floor(index / BLOCK) * cell}
                width={cell}
                height={cell}
                className={tint}
              />
            ) : null,
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
