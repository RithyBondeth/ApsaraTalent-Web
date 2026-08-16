"use client";

import { cn } from "@/lib/utils";
import { PixelPet } from "@/components/utils/brand/pixel-pet";

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
  height = 52,
  width = 148,
  className,
}: ILogoProps) {
  return (
    <span
      role="img"
      aria-label="Apsara Talent"
      className={cn(
        "inline-flex shrink-0 items-center overflow-visible text-foreground",
        withoutTitle ? "aspect-[16/17]" : "gap-2.5",
        className,
      )}
      style={className ? undefined : { width, height }}
    >
      <PixelPet
        expression="smiling"
        height={34}
        className="h-full max-h-[52px] w-auto shrink-0"
      />
      {!withoutTitle && (
        <span
          aria-hidden
          className="flex flex-col text-[0.84rem] font-medium leading-[0.9] tracking-[-0.045em]"
        >
          <span>Apsara</span>
          <span>Talent</span>
        </span>
      )}
    </span>
  );
}
