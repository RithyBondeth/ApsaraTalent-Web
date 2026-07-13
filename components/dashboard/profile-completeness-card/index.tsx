"use client";

import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideCheckCircle2,
  LucideChevronRight,
  LucideShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IProfileCompletenessCardProps } from "./props";

export function ProfileCompletenessCard({
  completion,
  profileUrl,
}: IProfileCompletenessCardProps) {
  /* ---------------------------------- Utils ---------------------------------- */
  const { percentage, missingFields } = completion;
  const isComplete = percentage >= 100;
  const t = useTranslations("dashboard");

  /* --------------------------------- Helpers --------------------------------- */
  const barColor =
    percentage >= 80
      ? "bg-emerald-500"
      : percentage >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  const textColor =
    percentage >= 80
      ? "text-emerald-500"
      : percentage >= 50
        ? "text-amber-500"
        : "text-rose-500";

  const bgColor =
    percentage >= 80
      ? "bg-emerald-500/10"
      : percentage >= 50
        ? "bg-amber-500/10"
        : "bg-rose-500/10";

  /* ---------------------------------- Render UI --------------------------------- */
  return (
    <div className="w-full flex items-center gap-4 sm:gap-6 bg-card rounded-2xl border border-border/60 px-5 py-4 sm:px-6">
      {/* Icon Section */}
      <div
        className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgColor}`}
      >
        {isComplete ? (
          <LucideCheckCircle2 className={`h-5 w-5 ${textColor}`} />
        ) : (
          <LucideShieldCheck className={`h-5 w-5 ${textColor}`} />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold leading-none">
            {t("profileCompletion")}
          </span>
          <span className={`text-sm font-bold tabular-nums ${textColor}`}>
            {percentage}%
          </span>
        </div>
        {/* Progress Bar Section */}
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Status Text Section */}
        <TypographyMuted className="text-xs leading-none">
          {isComplete
            ? t("profileCompleteMessage")
            : t("profileMissingFields", { count: missingFields.length })}
        </TypographyMuted>
      </div>

      {/* CTA Button Section */}
      {!isComplete && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="shrink-0 hidden xs:flex text-xs rounded-xl gap-1"
        >
          <Link href={profileUrl}>
            {t("completeProfile")}
            <LucideChevronRight className="size-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
