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
    <article className="group relative overflow-hidden border border-border border-l-[5px] border-l-foreground bg-card p-4 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-[8px_8px_0_hsl(var(--foreground)/0.08)] sm:p-5">
      {/* Subtle Gradient bg on hover Section */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${bgColor}`}
        style={{ opacity: 0 }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          {/* Icon Section */}
          <div
            className={`flex h-9 w-9 items-center justify-center border border-current/10 ${bgColor}`}
          >
            <Icon className={`h-4.5 w-4.5 ${color}`} />
          </div>
          {/* Trending Up Icon Section */}
          <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
        </div>
        {/* Value Section */}
        <TypographyP className="[&:not(:first-child)]:mt-0 text-2xl sm:text-3xl font-bold tracking-tight">
          {typeof value === "number" ? value : 0}
          {suffix ?? ""}
        </TypographyP>
        {/* Label Section */}
        <TypographyMuted className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
          {label}
        </TypographyMuted>
      </div>
    </article>
  );
}
