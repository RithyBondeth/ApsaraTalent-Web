"use client";

import { cn } from "@/lib/utils";
import {
  logo,
  logoDark,
  logoWithoutTitle,
  logoWithoutTitleDark,
} from "@/utils/constants/asset.constant";
import Image from "next/image";

/* ---------------------------------------------------------------------------
 * The brand mark.
 *
 * The artwork pairs its dancer with a fixed dark wordmark, which sits at
 * roughly 1.1:1 against the dark theme's near-black page — the lockup went out
 * as a blue rule under an invisible word. So the theme swap is back, but
 * not the way it was: this used to cross-fade two absolutely positioned SVGs
 * with a blur transition and an `aspect-[5/3]` wrapper that matched neither
 * artwork. Here the twin is the *same* artwork with its neutral inks lifted,
 * both marks share one intrinsic ratio, and the swap is a pair of `dark:`
 * visibility classes — no JS, so no hydration flash and no post-paint jump
 * (next-themes stamps the class before first paint).
 *
 * Both files download, which is the cost of a CSS-only swap. It is small: the
 * optimizer serves each at the rendered width, and nothing here renders past
 * 64px tall.
 * ------------------------------------------------------------------------- */

interface ILogoProps {
  /** Icon-only mark — the dancer without the wordmark. */
  withoutTitle?: boolean;
  /** Rendered height in px. Width follows the artwork's own ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
}

/* The artwork's true aspect after trimming. The source ships with the
   transparency checkerboard flattened into the pixels, so these ratios come
   from the alpha bounding box of the keyed marks, not the file dimensions.
   Recolouring the marks did not touch alpha, so these are unchanged. */
const RATIO = { lockup: 867 / 480, icon: 402 / 560 } as const;

export default function LogoComponent({
  withoutTitle = false,
  height = 56,
  className,
  priority = false,
}: ILogoProps) {
  const ratio = withoutTitle ? RATIO.icon : RATIO.lockup;
  const width = Math.round(height * ratio);
  /* `alt` stays out of this object and is written on each <Image> below:
     jsx-a11y/alt-text cannot see it through a spread and warns either way. */
  const shared = {
    height,
    width,
    sizes: `${width}px`,
    priority,
  };

  return (
    <>
      <Image
        {...shared}
        alt="Apsara Talent"
        src={withoutTitle ? logoWithoutTitle : logo}
        className={cn("w-auto object-contain dark:hidden", className)}
      />
      <Image
        {...shared}
        alt="Apsara Talent"
        src={withoutTitle ? logoWithoutTitleDark : logoDark}
        className={cn("hidden w-auto object-contain dark:block", className)}
      />
    </>
  );
}
