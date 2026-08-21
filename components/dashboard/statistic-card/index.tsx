import { TrendingUp } from "lucide-react";
import { IStatisticCardProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function StatisticCard({
  icon: Icon,
  color,
  value,
  suffix,
  label,
  bgColor,
}: IStatisticCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group relative overflow-hidden border border-l-[5px] border-border border-l-foreground bg-card p-4 shadow-hard transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-hard-lg sm:p-5">
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
            <Icon className={`h-4.5 w-4.5 ${color}`} />
          </div>
          {/* Trending Up Icon Section */}
          <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
        </div>
        {/* Value Section */}
        <TypographyP className="text-2xl font-bold tracking-tight sm:text-3xl [&:not(:first-child)]:mt-0">
          {typeof value === "number" ? value : 0}
          {suffix ?? ""}
        </TypographyP>
        {/* Label Section */}
        <TypographyMuted className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
          {label}
        </TypographyMuted>
      </div>
    </article>
  );
}
