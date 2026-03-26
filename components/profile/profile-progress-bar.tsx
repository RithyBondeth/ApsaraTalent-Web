"use client";

interface ProfileProgressBarProps {
  percentage: number;
}

/**
 * Compact inline progress bar for use in dialogs and cards.
 * Shows a thin colored bar with percentage text.
 */
export function ProfileProgressBar({ percentage }: ProfileProgressBarProps) {
  const isComplete = percentage >= 100;
  const barColor = isComplete
    ? "bg-green-500"
    : percentage >= 70
      ? "bg-primary"
      : percentage >= 40
        ? "bg-amber-500"
        : "bg-rose-500";

  const textColor = isComplete
    ? "text-green-600 dark:text-green-400"
    : percentage >= 70
      ? "text-primary"
      : percentage >= 40
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-[11px] font-semibold shrink-0 ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
}
