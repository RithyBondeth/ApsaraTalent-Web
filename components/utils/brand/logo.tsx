"use client";

import { cn } from "@/lib/utils";
import {
  logo,
  logoBlack,
  logoWithoutTitle,
} from "@/utils/constants/asset.constant";
import Image from "next/image";

/* ----------------------------------- Helper ---------------------------------- */
interface ILogoProps {
  withoutTitle?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function LogoComponent({
  withoutTitle = false,
  height = 100,
  width = 200,
  className,
  priority = false,
}: ILogoProps) {
  if (withoutTitle) {
    return (
      <Image
        src={logoWithoutTitle}
        alt="Apsara Talent logo"
        height={height}
        width={width}
        className={cn("h-auto w-auto", className)}
        priority={priority}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label="Apsara Talent"
      className={cn(
        "relative inline-grid aspect-[5/3] overflow-visible",
        className,
      )}
      style={className ? undefined : { width, height }}
    >
      <Image
        src={logo}
        alt=""
        fill
        sizes={`${width}px`}
        aria-hidden
        className="pointer-events-none object-contain opacity-100 blur-0 transition-[opacity,transform,filter] duration-500 ease-out dark:scale-[0.98] dark:opacity-0 dark:blur-[2px]"
        priority={priority}
      />
      <Image
        src={logoBlack}
        alt=""
        fill
        sizes={`${width}px`}
        aria-hidden
        className="pointer-events-none scale-[1.08] object-contain opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-500 ease-out dark:scale-[1.11] dark:opacity-100 dark:blur-0"
        priority={priority}
      />
    </span>
  );
}
