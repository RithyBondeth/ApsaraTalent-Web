import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const GRID_RUNNERS = [
  {
    axis: "horizontal",
    direction: "forward",
    line: 3,
    length: 118,
    cycle: 9.2,
    delay: -1.4,
  },
  {
    axis: "vertical",
    direction: "forward",
    line: 3,
    length: 104,
    cycle: 10.4,
    delay: -4.6,
  },
  {
    axis: "horizontal",
    direction: "reverse",
    line: 6,
    length: 92,
    cycle: 10.8,
    delay: -6.2,
  },
  {
    axis: "vertical",
    direction: "reverse",
    line: 7,
    length: 126,
    cycle: 12.1,
    delay: -9.3,
  },
  {
    axis: "horizontal",
    direction: "forward",
    line: 9,
    length: 146,
    cycle: 11.6,
    delay: -8.8,
  },
  {
    axis: "vertical",
    direction: "forward",
    line: 11,
    length: 88,
    cycle: 9.6,
    delay: -7.1,
  },
  {
    axis: "horizontal",
    direction: "reverse",
    line: 13,
    length: 108,
    cycle: 9.8,
    delay: -3.7,
  },
  {
    axis: "horizontal",
    direction: "forward",
    line: 17,
    length: 132,
    cycle: 12.4,
    delay: -10.1,
  },
] as const;

interface IGridRunnersProps {
  className?: string;
  density?: "full" | "quiet";
}

export function GridRunners({ className, density = "full" }: IGridRunnersProps) {
  const runners = density === "quiet" ? GRID_RUNNERS.slice(0, 6) : GRID_RUNNERS;

  return (
    <div className={cn("grid-runners", className)} aria-hidden>
      {runners.map((runner, index) => (
        <span
          key={`${runner.axis}-${runner.line}-${index}`}
          className={`grid-runner grid-runner--${runner.axis} grid-runner--${runner.direction}`}
          style={
            {
              "--runner-line": `${runner.line * 44}px`,
              "--runner-length": `${runner.length}px`,
              "--runner-cycle": `${runner.cycle}s`,
              "--runner-delay": `${runner.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
