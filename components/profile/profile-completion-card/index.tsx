"use client";

import { LucideCheck, LucideCircleAlert } from "lucide-react";
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
  const barColor = isComplete ? "bg-success" : "bg-foreground";

  // text-success before this: 2.3:1 on a white card, well under AA.
  const textColor = isComplete ? "text-success-accent" : "text-foreground";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section className="profile-completion-card border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Completion Metric Section */}
        <div className="grid size-16 shrink-0 place-items-center bg-foreground text-background sm:size-[72px]">
          {isComplete ? (
            <LucideCheck className="size-6" />
          ) : (
            <span className="pixel-numeral pixel-display text-lg">
              {percentage}%
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="pixel-label text-xs">{t("completion")}</span>
            <span className={`text-xs font-bold tabular-nums ${textColor}`}>
              {t("percentComplete", { percentage })}
            </span>
          </div>
          {/* Progress Bar Section */}
          <div className="mb-2 h-1.5 w-full overflow-hidden bg-muted">
            <div
              className={`h-full transition-all duration-700 ${barColor}`}
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
                  className="inline-flex items-center gap-1 border border-border bg-background/70 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  <LucideCircleAlert className="size-2.5 shrink-0" />
                  {tFields(field as Parameters<typeof tFields>[0])}
                </span>
              ))}
              {missingFields.length > 4 && (
                <span className="px-1 py-0.5 text-[11px] text-muted-foreground">
                  +{missingFields.length - 4} {t("missingInformation")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
