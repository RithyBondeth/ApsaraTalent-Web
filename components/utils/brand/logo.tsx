"use client";

import { cn } from "@/lib/utils";
import {
  logo,
  logoDark,
  logoWithoutTitle,
} from "@/utils/constants/asset.constant";
import Image from "next/image";

/* ---------------------------------------------------------------------------
 * The brand mark.
 *
 * The lockup pairs the dancer with a near-black wordmark that all but vanishes
 * on the dark theme's page, so it ships as a twin lettered in white. The swap is
 * a pair of `dark:` visibility classes — no JS, so no hydration flash and no
 * post-paint jump (next-themes stamps the class before first paint). Both files
 * download, which is the cost of a CSS-only swap; the optimizer serves each at
 * the rendered width and nothing here renders past 64px tall.
 *
 * The icon-only mark needs no twin. It is the dancer alone, blue and white
 * throughout with no wordmark to lose, so it reads on either theme and renders
 * as a single image — one request instead of two.
 * ------------------------------------------------------------------------- */

interface ILogoProps {
  /** Icon-only mark — the dancer without the wordmark. */
  withoutTitle?: boolean;
  /** Rendered height in px. Width follows the artwork's own ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
}

/* The files are already trimmed to their alpha box (see asset.constant), so
   these are simply their pixel dimensions. Both lockups share a rectangle on
   purpose, so one ratio serves the pair. */
const RATIO = { lockup: 1542 / 884, icon: 843 / 1206 } as const;

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

  if (withoutTitle) {
    return (
      <Image
        {...shared}
        alt="Apsara Talent"
        src={logoWithoutTitle}
        className={cn("w-auto object-contain", className)}
      />
    );
  }

  return (
    <>
      <Image
        {...shared}
        alt="Apsara Talent"
        src={logo}
        className={cn("w-auto object-contain dark:hidden", className)}
      />
      <Image
        {...shared}
        alt="Apsara Talent"
        src={logoDark}
        className={cn("hidden w-auto object-contain dark:block", className)}
      />
    </>
  );
}
