import { IProfileProgressBarProps } from "./props";

export function ProfileProgressBar({ percentage }: IProfileProgressBarProps) {
  /* ---------------------------------- Utils --------------------------------- */
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

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2.5 w-full">
      {/* ProgressBar Section */}
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Label Section */}
      <span className={`text-[11px] font-semibold shrink-0 ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
}
