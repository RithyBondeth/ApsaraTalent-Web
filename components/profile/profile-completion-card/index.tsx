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
  const isComplete = percentage >= 100;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{t("completion")}</h3>
        <span className="text-sm font-medium text-muted-foreground">
          {t("percentComplete", { percentage })}
        </span>
      </div>

      {/* Progress Bar Section */}
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? "bg-green-500" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status Section */}
      {isComplete ? (
        <div className="flex items-center gap-2 mt-3 text-green-500">
          <LucideCircleCheck className="size-4" />
          <span className="text-sm font-medium">{t("complete")}</span>
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <LucideCircleAlert className="size-4" />
            <span className="text-sm">{t("missingInformation")}</span>
          </div>
          <ul className="space-y-1 pl-6">
            {missingFields.map((field) => (
              <li
                key={field}
                className="text-sm text-muted-foreground list-disc"
              >
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
