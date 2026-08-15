import { SCORE_COLOR } from "@/utils/constants/ui.constant";

export default function ScoreRing(props: { score: number }) {
  /* ---------------------------- Props --------------------------- */
  const { score } = props;

  /* ---------------------------- Utils --------------------------- */
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color =
    score >= 75
      ? SCORE_COLOR.HIGH
      : score >= 50
        ? SCORE_COLOR.MEDIUM
        : SCORE_COLOR.LOW;

  /* -------------------------- Render UI ------------------------- */
  return (
    <div className="relative flex size-[72px] shrink-0 items-center justify-center sm:size-[88px]">
      <svg
        width="72"
        height="72"
        viewBox="0 0 84 84"
        aria-hidden="true"
        className="-rotate-90 sm:h-[88px] sm:w-[88px]"
      >
        {/* Track Section */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          strokeWidth="7"
          fill="none"
          stroke="currentColor"
          className="text-muted"
        />
        {/* Progress Arc Section */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          strokeWidth="7"
          fill="none"
          stroke={color}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      {/* Score Label Section */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="pixel-numeral text-[18px] font-bold leading-none sm:text-[22px]"
          style={{ color }}
        >
          {score}
        </span>
        <span className="mt-0.5 text-[9px] font-medium text-muted-foreground sm:text-[10px]">
          / 100
        </span>
      </div>
    </div>
  );
}
