import { TrendingUp } from "lucide-react";
import { IStatisticCardProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function StatisticCard(props: IStatisticCardProps) {
  /* --------------------------------- Props --------------------------------- */
  const { icon: Icon, color, value, suffix, label, bgColor } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="group relative overflow-hidden bg-card rounded-2xl border border-border/60 p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-border">
      {/* Subtle Gradient bg on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${bgColor}`}
        style={{ opacity: 0 }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${bgColor}`}
          >
            <Icon className={`h-4.5 w-4.5 ${color}`} />
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
        </div>
        <TypographyP className="[&:not(:first-child)]:mt-0 text-2xl sm:text-3xl font-bold tracking-tight">
          {typeof value === "number" ? value : 0}
          {suffix ?? ""}
        </TypographyP>
        <TypographyMuted className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
          {label}
        </TypographyMuted>
      </div>
    </div>
  );
}
