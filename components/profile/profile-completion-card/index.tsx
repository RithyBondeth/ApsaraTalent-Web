"use client";

import { LucideCircleCheck, LucideCircleAlert } from "lucide-react";
import { IProfileCompletionCardProps } from "./props";
import { useTranslations } from "next-intl";

export default function ProfileCompletionCard({
  percentage,
  missingFields,
}: IProfileCompletionCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("profile");
  const tFields = useTranslations("profile.completionFields");
  const isComplete = percentage >= 100;

  /* --------------------------------- Helpers --------------------------------- */
  const barColor = isComplete
    ? "bg-emerald-500"
    : percentage >= 60
      ? "bg-primary"
      : percentage >= 30
        ? "bg-amber-500"
        : "bg-rose-500";

  const textColor = isComplete
    ? "text-emerald-500"
    : percentage >= 60
      ? "text-primary"
      : percentage >= 30
        ? "text-amber-500"
        : "text-rose-500";

  const bgColor = isComplete
    ? "bg-emerald-500/10 border-emerald-500/20"
    : percentage >= 60
      ? "bg-primary/5 border-primary/20"
      : percentage >= 30
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-rose-500/10 border-rose-500/20";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className={`rounded-2xl border shadow-sm p-4 sm:p-5 ${bgColor}`}>
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Circular Progress Indicator Section */}
        <div className="relative shrink-0 size-14 sm:size-16">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-border/40"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              strokeWidth="2.5"
              strokeDasharray={`${(percentage / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className={`${textColor} transition-all duration-700`}
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isComplete ? (
              <LucideCircleCheck className={`size-5 ${textColor}`} />
            ) : (
              <span
                className={`text-[11px] font-bold tabular-nums ${textColor}`}
              >
                {percentage}%
              </span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-sm font-semibold">{t("completion")}</span>
            <span className={`text-xs font-bold tabular-nums ${textColor}`}>
              {t("percentComplete", { percentage })}
            </span>
          </div>
          {/* Progress Bar Section */}
          <div className="w-full h-1.5 rounded-full bg-border/40 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {isComplete ? (
            <p className={`text-xs font-medium ${textColor}`}>
              {t("complete")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingFields.slice(0, 4).map((field) => (
                <span
                  key={field}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-background/70 border border-border/50 rounded-full px-2 py-0.5"
                >
                  <LucideCircleAlert className="size-2.5 shrink-0" />
                  {tFields(field as Parameters<typeof tFields>[0])}
                </span>
              ))}
              {missingFields.length > 4 && (
                <span className="text-[11px] text-muted-foreground px-1 py-0.5">
                  +{missingFields.length - 4} {t("missingInformation")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
