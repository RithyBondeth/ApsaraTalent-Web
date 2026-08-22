import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { IMatchRateRadialProps } from "./props";
import { cn } from "@/lib/utils";

export function MatchRateRadial({ rate }: IMatchRateRadialProps) {
  /* ---------------------------------- Helpers -------------------------------- */
  // The arc takes a colour string because recharts does, but it reads the same
  // tokens as everything else — `hsl(var(--primary))` was already proving that
  // works here. The label beside it takes a class, because a `style={{ color }}`
  // of raw hex is invisible to both design gates and cannot follow the theme:
  // the three RATE_COLOR values scored 2.54, 2.15 and 3.76 against a light card,
  // all under the 4.5:1 that WCAG asks of text.
  const band = (r: number) => {
    if (r >= 70)
      return { arc: "hsl(var(--success))", text: "text-success-accent" };
    if (r >= 40) return { arc: "hsl(var(--primary))", text: "text-primary" };
    if (r >= 20)
      return { arc: "hsl(var(--warning))", text: "text-warning-accent" };
    return {
      arc: "hsl(var(--muted-foreground))",
      text: "text-muted-foreground",
    };
  };

  const tone = band(rate);
  const data = [{ value: rate, fill: tone.arc }];

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
        <span className={cn("text-3xl font-bold tracking-tight", tone.text)}>
          {rate}%
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">Match Rate</span>
      </div>
    </div>
  );
}
