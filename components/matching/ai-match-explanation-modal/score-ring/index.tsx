export default function ScoreRing(props: { score: number }) {
  /* ---------------------------- Props --------------------------- */
  const { score } = props;

  /* ---------------------------- Utils --------------------------- */
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  /* -------------------------- Render UI ------------------------- */
  return (
    <div className="relative flex items-center justify-center size-[72px] sm:size-[88px] shrink-0">
      <svg
        width="72"
        height="72"
        viewBox="0 0 84 84"
        aria-hidden="true"
        className="-rotate-90 sm:w-[88px] sm:h-[88px]"
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
          className="text-[18px] sm:text-[22px] font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}
