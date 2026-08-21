"use client";

import { cn } from "@/lib/utils";
import { logo, logoWithoutTitle } from "@/utils/constants/asset.constant";
import Image from "next/image";

/* ---------------------------------------------------------------------------
 * The brand mark.
 *
 * This used to cross-fade two SVGs — a light-mode lockup and a dark-mode one —
 * with a blur transition on theme change. The new artwork ships as a single
 * lockup, so there is nothing to cross-fade and the pair of stacked, absolutely
 * positioned images (and their `aspect-[5/3]` wrapper, which did not match the
 * artwork's 3:2) are gone. One image, its own aspect ratio, no theme swap.
 * ------------------------------------------------------------------------- */

interface ILogoProps {
  /** Icon-only mark — the dancer without the wordmark. */
  withoutTitle?: boolean;
  /** Rendered height in px. Width follows the artwork's own ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
}

/* The artwork's true aspect after trimming: the source files shipped with
   transparent padding (11% off the bottom of the lockup, 17% off the left of
   the icon), so a height-constrained box was spending a fifth of its budget
   on empty space. These are the ratios of the trimmed marks. */
const RATIO = { lockup: 740 / 428, icon: 454 / 581 } as const;

export default function LogoComponent({
  withoutTitle = false,
  height = 56,
  className,
  priority = false,
}: ILogoProps) {
  const src = withoutTitle ? logoWithoutTitle : logo;
  const ratio = withoutTitle ? RATIO.icon : RATIO.lockup;
  const width = Math.round(height * ratio);

  return (
    <Image
      src={src}
      alt="Apsara Talent"
      height={height}
      width={width}
      sizes={`${width}px`}
      className={cn("w-auto object-contain", className)}
      priority={priority}
    />
  );
}
