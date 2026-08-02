"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IWeeklyActivityChartProps } from "./props";
import { CHART_COLOR } from "@/utils/constants/ui.constant";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

export function WeeklyActivityChart({ data }: IWeeklyActivityChartProps) {
  /* -------------------------------- Utils ------------------------------- */
  const t = useTranslations("dashboard");
  const hasData = data.some(
    (d) => d.likes > 0 || d.received > 0 || d.matches > 0,
  );

  /* -------------------------- Empty List State -------------------------- */
  if (!hasData) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-[250px] flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/20 px-5 text-center text-sm text-muted-foreground"
      >
        <span className="grid size-11 place-items-center bg-primary/10 text-primary">
          <BarChart3 className="size-5" aria-hidden />
        </span>
        <span className="max-w-sm">{t("noActivityThisWeek")}</span>
      </div>
    );
  }

  /* ------------------------------ Render UI ------------------------------ */
  return (
    <div
      role="img"
      aria-label={t("weeklyActivityDescription")}
      className="h-[250px] w-full"
    >
    <ResponsiveContainer width="100%" height="100%">
      {/* Chart Section */}
      <BarChart data={data} barGap={2} barCategoryGap="20%">
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
          strokeOpacity={0.5}
        />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0",
            fontSize: "12px",
            boxShadow: "0 4px 12px hsl(var(--foreground) / 0.08)",
          }}
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
        />
        <Bar
          dataKey="likes"
          name="Likes Given"
          fill="hsl(var(--primary))"
          radius={[0, 0, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="received"
          name="Likes Received"
          fill={CHART_COLOR.PINK}
          radius={[0, 0, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="matches"
          name="Matches"
          fill={CHART_COLOR.GREEN}
          radius={[0, 0, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
