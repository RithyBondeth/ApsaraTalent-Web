"use client";

import { cn } from "@/lib/utils";
import {
  BlackLogo,
  BlackLogoV2,
  LogoWithoutTitle,
  WhiteLogo,
  WhiteLogoV2,
} from "@/utils/constants/asset.constant";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ----------------------------------- Helper ---------------------------------- */
interface ILogoProps {
  withoutTitle?: boolean;
  variant?: "default" | "v2";
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function LogoComponent({
  withoutTitle = false,
  variant = "default",
  height = 100,
  width = 200,
  className,
  priority = false,
}: ILogoProps) {
  /* -------------------------------- All States ------------------------------ */
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

  /* ---------------------------------- Utils ---------------------------------- */
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const src = withoutTitle
    ? LogoWithoutTitle
    : variant === "v2"
      ? isDark
        ? WhiteLogoV2
        : BlackLogoV2
      : isDark
        ? WhiteLogo
        : BlackLogo;
  const filterClass = withoutTitle && isDark ? "brightness-0 invert" : "";

  return (
    <Image
      src={src}
      alt="Apsara Talent logo"
      height={height}
      width={width}
      className={cn("h-auto w-auto", filterClass, className)}
      priority={priority}
    />
  );
}
