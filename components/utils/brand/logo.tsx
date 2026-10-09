"use client";

import { cn } from "@/lib/utils";
import {
  logo,
  logoDark,
  logoWithoutTitle,
  logoWithoutTitleDark,
} from "@/utils/constants/asset.constant";
import Image from "next/image";
import {
  BRAND_LOCKUP_ASPECT_RATIO,
  BRAND_SYMBOL_ASPECT_RATIO,
} from "@/utils/constants/brand-dimensions.constant";

// The approved AT monogram and horizontal name lockup share vector masters
// with mobile. CSS switches to the matching primary blue and white wordmark
// before dark-theme paint.

interface ILogoProps {
  /** The AT monogram without the wordmark. */
  withoutTitle?: boolean;
  /** Rendered height in px. Width follows the artwork's own ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
}

const RATIO = {
  lockup: BRAND_LOCKUP_ASPECT_RATIO,
  icon: BRAND_SYMBOL_ASPECT_RATIO,
} as const;

export default function LogoComponent({
  withoutTitle = false,
  height = 32,
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
        className={cn("max-w-full object-contain dark:hidden", className)}
        style={{ height, width: "auto" }}
      />
      <Image
        {...shared}
        alt="Apsara Talent"
        src={withoutTitle ? logoWithoutTitleDark : logoDark}
        className={cn("hidden max-w-full object-contain dark:block", className)}
        style={{ height, width: "auto" }}
      />
    </>
  );
}
