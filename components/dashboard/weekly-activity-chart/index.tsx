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

export function WeeklyActivityChart({ data }: IWeeklyActivityChartProps) {
  /* -------------------------------- Utils ------------------------------- */
  const hasData = data.some(
    (d) => d.likes > 0 || d.received > 0 || d.matches > 0,
  );

  /* -------------------------- Empty List State -------------------------- */
  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        No activity this week. Start liking to see your chart!
      </div>
    );
  }

  /* ------------------------------ Render UI ------------------------------ */
  return (
    <ResponsiveContainer width="100%" height={250}>
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
            borderRadius: "12px",
            fontSize: "12px",
            boxShadow: "0 4px 12px hsl(var(--foreground) / 0.08)",
          }}
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
        />
        <Bar
          dataKey="likes"
          name="Likes Given"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="received"
          name="Likes Received"
          fill="#ec4899"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="matches"
          name="Matches"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
