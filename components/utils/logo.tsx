"use client";

import Image from "next/image";
import BlackLogo from "@/assets/svg/logo-black.svg";
import WhiteLogo from "@/assets/svg/logo-white.svg";
import { useTheme } from "next-themes";
import { ILogoProps } from "@/utils/interfaces/logo.interface";
import { useEffect, useState } from "react";

export default function LogoComponent(props: ILogoProps) {
  const { height = 80, width = 160 } = props; // Removed `isBlackLogo` from destructuring
  const { resolvedTheme } = useTheme(); // Get system-aware theme resolution
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to display (avoid SSR issues)
  const currentTheme = mounted ? resolvedTheme : "light";
  const isBlackLogo = currentTheme === "light"; // Dynamically set logo color

  return <Image src={isBlackLogo ? BlackLogo : WhiteLogo} alt="logo" height={height} width={width} />;
}