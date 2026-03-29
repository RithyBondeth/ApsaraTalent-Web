import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { IMatchRateRadialProps } from "./props";

export function MatchRateRadial({ rate }: IMatchRateRadialProps) {
  /* ---------------------------------- Helper --------------------------------- */
  const getColorBasedOnRate = (r: number) => {
    if (r >= 70) return "#10b981";
    if (r >= 40) return "hsl(var(--primary))";
    if (r >= 20) return "#f59e0b";
    return "#ef4444";
  };

  const data = [{ value: rate, fill: "hsl(var(--primary))" }];
  const color = getColorBasedOnRate(rate);
  data[0].fill = color;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="relative flex flex-col items-center">
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

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight" style={{ color }}>
          {rate}%
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">Match Rate</span>
      </div>
    </div>
  );
}
