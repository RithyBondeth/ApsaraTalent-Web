import { PixelIcon } from "@/components/utils/brand/pixel-icon";
import { TrendingUp } from "lucide-react";
import { IStatisticCardProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function StatisticCard({
  icon,
  color,
  value,
  suffix,
  label,
  bgColor,
}: IStatisticCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group relative overflow-hidden bg-card p-5 transition-colors hover:bg-muted/40 sm:p-6">
      {/* Subtle Gradient bg on hover Section */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${bgColor}`}
        style={{ opacity: 0 }}
      />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          {/* Icon Section */}
          <div
            className={`border-current/10 flex h-9 w-9 items-center justify-center border ${bgColor}`}
          >
            <PixelIcon name={icon} size={18} className={color} />
          </div>
          {/* Trending Up Icon Section */}
          <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
        </div>
        {/* Value Section */}
        <TypographyP className="pixel-numeral text-3xl sm:text-4xl [&:not(:first-child)]:mt-0">
          {typeof value === "number" ? value : 0}
          {suffix ?? ""}
        </TypographyP>
        {/* Label Section */}
        <TypographyMuted className="pixel-label mt-2 text-[10px] text-muted-foreground">
          {label}
        </TypographyMuted>
      </div>
    </article>
  );
}
