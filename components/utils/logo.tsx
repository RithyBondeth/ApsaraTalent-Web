"use client";

import Image from "next/image";
import BlackLogo from "@/assets/svg/logo-black.svg";
import WhiteLogo from "@/assets/svg/logo-white.svg";
import { useTheme } from "next-themes";
import { ILogoProps } from "@/utils/interfaces/logo.interface";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LogoComponent(props: ILogoProps) {
  const { height = 100, width = 200, className, priority = false } = props; 
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const currentTheme = mounted ? resolvedTheme : "light";
  const isBlackLogo = currentTheme === "light";

  return (
    <Image
      src={isBlackLogo ? BlackLogo : WhiteLogo}
      alt="logo"
      height={height}
      width={width}
      className={cn(className)}
      style={{ width: "auto", height: "auto" }}
      priority={priority}
    />
  );
}
