"use client";

import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { formatShortDate } from "@/utils/functions/date";
import { OPEN_APPLICATION_STATUSES } from "@/utils/types/application/application-status.type";
import {
  LucideCalendarDays,
  LucideLoader2,
  LucideMessageSquareQuote,
  LucideUndo2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApplicationStatusBadge } from "../application-status-badge";
import { IApplicationCardProps } from "./props";

export function ApplicationCard({
  application,
  isWithdrawing,
  onWithdraw,
}: IApplicationCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("application");
  const canWithdraw = OPEN_APPLICATION_STATUSES.includes(application.status);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-border bg-card shadow-hard transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:shadow-hard-lg">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Row Section */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
              {application.jobTitle ?? t("untitledRole")}
            </h3>
            <TypographyMuted className="mt-0.5 flex items-center gap-1 text-sm">
              <LucideCalendarDays className="size-3" />
              {t("appliedOn", { date: formatShortDate(application.appliedAt) })}
            </TypographyMuted>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        {/*
          The rejection reason is shown to the candidate rather than kept for
          the company's records. Being told no without being told why is the
          single most complained-about part of applying anywhere.
        */}
        {application.status === "rejected" && application.rejectionReason && (
          <div className="border-l-[4px] border-l-destructive bg-destructive-subtle px-4 py-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-destructive-accent">
              {t("rejectionReason")}
            </p>
            <TypographyMuted className="text-sm leading-relaxed text-destructive-accent">
              {application.rejectionReason}
            </TypographyMuted>
          </div>
        )}

        {application.coverLetterNote && (
          <div className="border-t border-border/60 pt-3">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <LucideMessageSquareQuote className="size-3" />
              {t("yourNote")}
            </p>
            <TypographyMuted className="text-sm leading-relaxed">
              {application.coverLetterNote}
            </TypographyMuted>
          </div>
        )}

        {/* Footer Row Section */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <TypographyMuted className="text-xs">
            {application.statusChangedAt
              ? t("updatedOn", {
                  date: formatShortDate(application.statusChangedAt),
                })
              : t("awaitingReview")}
          </TypographyMuted>

          {canWithdraw && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-none"
              disabled={isWithdrawing}
              onClick={() => onWithdraw(application.id)}
            >
              {isWithdrawing ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : (
                <LucideUndo2 className="size-3.5" />
              )}
              {t("withdraw")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
