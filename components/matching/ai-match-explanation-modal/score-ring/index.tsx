import { cn } from "@/lib/utils";
import { getScoreTone } from "@/utils/functions/ui";

export default function ScoreRing(props: { score: number }) {
  /* ---------------------------- Props --------------------------- */
  const { score } = props;

  /* ---------------------------- Utils --------------------------- */
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  // The arc takes its colour from `currentColor`, the same way the track above
  // it does, so both sides of the ring come from tokens rather than a hex the
  // theme cannot move.
  const tone = getScoreTone(score);

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
          stroke="currentColor"
          className={tone.stroke}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      {/* Score Label Section */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-[18px] font-bold tabular-nums leading-none sm:text-[22px]",
            tone.text,
          )}
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
