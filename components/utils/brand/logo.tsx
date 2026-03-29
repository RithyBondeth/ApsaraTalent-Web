"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BlackLogo,
  WhiteLogo,
  LogoWithoutTitle,
} from "@/utils/constants/asset.constant";

interface ILogoProps {
  isBlackLogo?: boolean;
  withoutTitle?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function LogoComponent(props: ILogoProps) {
  /* --------------------------------- Props --------------------------------- */
  const { height = 100, width = 200, className, priority = false } = props;
  /* ---------------------------------- Utils --------------------------------- */
  const { resolvedTheme } = useTheme();
  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------------------------- Utils --------------------------------- */
  const currentTheme = mounted ? resolvedTheme : "light";
  const isBlackLogo = currentTheme === "light";

  /* --------------------------------- Methods --------------------------------- */
  // ── Get Logo Source ─────────────────────────────────────────
  const getLogoSource = () => {
    if (props.withoutTitle) {
      return LogoWithoutTitle;
    }
    return isBlackLogo ? BlackLogo : WhiteLogo;
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Image
      src={getLogoSource()}
      alt="logo"
      height={height}
      width={width}
      className={cn(className)}
      style={{ width: "auto", height: "auto" }}
      priority={priority}
    />
  );
}
