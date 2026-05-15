"use client";

import { cn } from "@/lib/utils";
import { logo, logoWithoutTitle } from "@/utils/constants/asset.constant";
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
  const src = withoutTitle ? logoWithoutTitle : logo;

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
