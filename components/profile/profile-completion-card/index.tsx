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
  const barColor = isComplete ? "bg-emerald-500" : "bg-brand";
  const textColor = isComplete ? "text-emerald-600" : "text-brand";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="profile-completion-card rounded-2xl border border-border/70 bg-card p-4 shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] sm:p-5">
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Circular Progress Indicator Section */}
        <div className="relative size-14 shrink-0 rounded-2xl border border-brand/15 bg-brand-soft p-1.5 sm:size-16">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-border/70"
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
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">{t("completion")}</span>
            <span
              className={`rounded-full border border-current/15 bg-background/70 px-2.5 py-1 text-xs font-semibold tabular-nums ${textColor}`}
            >
              {t("percentComplete", { percentage })}
            </span>
          </div>
          {/* Progress Bar Section */}
          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-border/50">
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
                  className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background/70 px-2 py-0.5 text-[11px] text-muted-foreground"
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
