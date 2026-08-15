import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { IMatchRateRadialProps } from "./props";
import { RATE_COLOR } from "@/utils/constants/ui.constant";

export function MatchRateRadial({ rate }: IMatchRateRadialProps) {
  /* ---------------------------------- Helpers -------------------------------- */
  const getColorBasedOnRate = (r: number) => {
    if (r >= 70) return RATE_COLOR.HIGH;
    if (r >= 40) return "hsl(var(--primary))";
    if (r >= 20) return RATE_COLOR.MEDIUM;
    return RATE_COLOR.LOW;
  };

  const data = [{ value: rate, fill: "hsl(var(--primary))" }];
  const color = getColorBasedOnRate(rate);
  data[0].fill = color;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="relative flex flex-col items-center">
      {/* Chart Section */}
      <ResponsiveContainer width={180} height={180}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="72%"
          outerRadius="100%"
          barSize={14}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: "hsl(var(--muted))" }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Rate Section */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-medium tracking-tight" style={{ color }}>
          {rate}%
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">Match Rate</span>
      </div>
    </div>
  );
}
