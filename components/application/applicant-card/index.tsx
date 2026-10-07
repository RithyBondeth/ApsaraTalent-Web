"use client";

import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/utils/functions/date";
import { getScoreTone } from "@/utils/functions/ui";
import { APPLICATION_STATUS_TRANSITIONS } from "@/utils/types/application/application-status.type";
import {
  LucideArrowRight,
  LucideCalendarDays,
  LucideLoader2,
  LucideMessageSquareQuote,
  LucideUserRound,
  LucideX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApplicationStatusBadge } from "../application-status-badge";
import { IApplicantCardProps } from "./props";

export function ApplicantCard({
  application,
  isUpdating,
  onAdvance,
  onReject,
}: IApplicantCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("application");

  /*
    The next stage and the rejection are pulled apart deliberately. Advancing is
    one unambiguous move at every stage, so it is one button that names where
    the candidate goes — not a dropdown the reader has to open to find out.
    Rejecting is the other edge from every stage, and it asks for a reason, so
    it gets its own control.
  */
  const [nextStage] = APPLICATION_STATUS_TRANSITIONS[application.status].filter(
    (status) => status !== "rejected",
  );
  const canReject =
    APPLICATION_STATUS_TRANSITIONS[application.status].includes("rejected");

  const score = application.matchScore;
  const tone = typeof score === "number" ? getScoreTone(score) : null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-border bg-card shadow-hard transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:shadow-hard-lg">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Row Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {/*
              The fit score leads the row because it is what the list is sorted
              on. An applicant the pair was never scored for shows a dash rather
              than a zero — "unknown" and "a bad match" are not the same answer.
            */}
            <div
              className={cn(
                "grid size-12 shrink-0 place-items-center border text-sm font-black tabular-nums",
                tone ? tone.border : "border-border",
                tone ? tone.text : "text-muted-foreground",
              )}
              aria-label={
                typeof score === "number"
                  ? t("fitScoreLabel", { score })
                  : t("fitScoreUnknown")
              }
            >
              {typeof score === "number" ? score : "—"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
                {application.employeeName ?? t("unnamedApplicant")}
              </h3>
              <TypographyMuted className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-1">
                  <LucideCalendarDays className="size-3" />
                  {t("appliedOn", {
                    date: formatShortDate(application.appliedAt),
                  })}
                </span>
                {!application.reviewedAt && (
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    {t("newApplicant")}
                  </span>
                )}
              </TypographyMuted>
            </div>
          </div>

          <ApplicationStatusBadge status={application.status} />
        </div>

        {application.coverLetterNote && (
          <div className="border-t border-border/60 pt-3">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <LucideMessageSquareQuote className="size-3" />
              {t("candidateNote")}
            </p>
            <TypographyMuted className="text-sm leading-relaxed">
              {application.coverLetterNote}
            </TypographyMuted>
          </div>
        )}

        {application.status === "rejected" && application.rejectionReason && (
          <div className="border-t border-border/60 pt-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("rejectionReason")}
            </p>
            <TypographyMuted className="text-sm leading-relaxed">
              {application.rejectionReason}
            </TypographyMuted>
          </div>
        )}

        {/* Action Row Section */}
        {(nextStage || canReject) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
            <TypographyMuted className="flex items-center gap-1 text-xs">
              <LucideUserRound className="size-3" />
              {application.statusChangedAt
                ? t("updatedOn", {
                    date: formatShortDate(application.statusChangedAt),
                  })
                : t("notYetMoved")}
            </TypographyMuted>

            <div className="flex items-center gap-2">
              {canReject && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  disabled={isUpdating}
                  onClick={() => onReject(application)}
                >
                  <LucideX className="size-3.5" />
                  {t("reject")}
                </Button>
              )}
              {nextStage && (
                <Button
                  size="sm"
                  className="rounded-none"
                  disabled={isUpdating}
                  onClick={() => onAdvance(application.id, nextStage)}
                >
                  {isUpdating ? (
                    <LucideLoader2 className="size-3.5 animate-spin" />
                  ) : (
                    <LucideArrowRight className="size-3.5" />
                  )}
                  {t(`advanceTo.${nextStage}`)}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
