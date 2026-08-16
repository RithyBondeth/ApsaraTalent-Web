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
  // Completion is a severity scale, so it reads from the status ramp. This
  // used to mix emerald/amber/rose while the sibling card below the fold used
  // green/amber/red for the same three bands.
  const tone =
    percentage >= 80
      ? {
          bar: "bg-success",
          text: "text-success-accent",
          surface: "bg-success-subtle",
        }
      : percentage >= 50
        ? {
            bar: "bg-warning",
            text: "text-warning-accent",
            surface: "bg-warning-subtle",
          }
        : {
            bar: "bg-destructive",
            text: "text-destructive-accent",
            surface: "bg-destructive-subtle",
          };

  /* ---------------------------------- Render UI --------------------------------- */
  return (
    <div className="flex w-full items-center gap-5 border-b border-border bg-card px-6 py-5 sm:px-8">
      {/* Icon Section */}
      <div
        className={`border-current/10 hidden h-10 w-10 shrink-0 items-center justify-center border sm:flex ${tone.surface}`}
      >
        {isComplete ? (
          <LucideCheckCircle2 className={`h-5 w-5 ${tone.text}`} />
        ) : (
          <LucideShieldCheck className={`h-5 w-5 ${tone.text}`} />
        )}
      </div>

      {/* Content Section */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium leading-none">
            {t("profileCompletion")}
          </span>
          <span className={`text-sm font-medium tabular-nums ${tone.text}`}>
            {percentage}%
          </span>
        </div>
        {/* Progress Bar Section */}
        <div className="h-1.5 w-full overflow-hidden bg-muted">
          <div
            className={`h-full transition-all duration-500 ${tone.bar}`}
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
          className="xs:flex hidden shrink-0 gap-1 text-xs"
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
