"use client";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themes/theme-store";
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
  /* ---------------------------------- Utils ---------------------------------- */
  const { theme, systemTheme } = useThemeStore();
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  const logoIcon = isDark ? logoBlack : logo;

  const src = withoutTitle ? logoWithoutTitle : logoIcon;

  return (
    <Image
      src={src}
      alt="Apsara Talent logo"
      height={height}
      width={width}
      className={cn("h-auto w-auto", className)}
      priority={priority}
    />
  );
}
