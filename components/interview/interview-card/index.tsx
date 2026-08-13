"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusBadgeStyleClass } from "@/utils/functions/ui";
import { formatShortDate } from "@/utils/functions/date";
import {
  LucideCalendarCheck,
  LucideCheck,
  LucideClock,
  LucideLink,
  LucideLoader2,
  LucideMapPin,
  LucideX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IInterviewCardProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LazyAiInterviewPrepAction } from "@/components/matching/lazy-ai-actions";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export function InterviewCard({
  interview,
  isEmployee,
  isUpdating,
  onAccept,
  onDecline,
}: IInterviewCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("interview");
  const isCreator =
    interview.createdBy ===
    (isEmployee ? USER_ROLE.EMPLOYEE : USER_ROLE.COMPANY);
  const showActions = interview.status === "pending" && !isCreator;
  const otherPartyName = isEmployee
    ? (interview.company?.name ?? "Company")
    : `${interview.employee?.firstname ?? ""} ${interview.employee?.lastname ?? ""}`.trim() ||
      interview.employee?.username ||
      "Employee";

  /* -------------------------------- All States ------------------------------ */
  const [pendingAction, setPendingAction] = useState<
    "accept" | "decline" | null
  >(null);

  /* --------------------------------- Effects -------------------------------- */
  // Clear the pending action once the API call finishes
  useEffect(() => {
    if (!isUpdating) setPendingAction(null);
  }, [isUpdating]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-border border-l-[5px] border-l-foreground bg-card shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-[8px_8px_0_hsl(var(--foreground)/0.08)]">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Row Section */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
              {interview.title}
            </h3>
            <TypographyMuted className="text-sm text-muted-foreground mt-0.5">
              {t("with", { name: otherPartyName })}
            </TypographyMuted>
          </div>
          <Badge
            variant="outline"
            className={`flex-shrink-0 whitespace-nowrap rounded-none border-current/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${getStatusBadgeStyleClass(interview.status)}`}
          >
            {t(`status.${interview.status}`)}
          </Badge>
        </div>

        {/* Description Section */}
        {interview.description && (
          <TypographyMuted className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {interview.description}
          </TypographyMuted>
        )}

        {/* ScheduleAt, Duration, Location, MeetingLink Section */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 border border-border bg-muted/45 px-3 py-1.5">
            <LucideCalendarCheck className="size-3.5" />
            {formatShortDate(interview.scheduledAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 border border-border bg-muted/45 px-3 py-1.5">
            <LucideClock className="size-3.5" />
            {interview.durationMinutes} min
          </span>
          {interview.location && (
            <span className="inline-flex items-center gap-1.5 border border-border bg-muted/45 px-3 py-1.5">
              <LucideMapPin className="size-3.5" />
              {interview.location}
            </span>
          )}
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-border bg-muted/45 px-3 py-1.5 transition-colors hover:bg-primary/10"
            >
              <LucideLink className="size-3.5" />
              {t("joinMeeting")}
            </a>
          )}
        </div>
      </div>

      {/* Action Bar Section: Practice Questions (employee only) + Accept/Decline (pending only) */}
      {(isEmployee || showActions) && (
        <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
          {/* AI Practice Questions Section (employees only) */}
          {isEmployee && (
            <LazyAiInterviewPrepAction
              eid={interview.employee.id}
              cid={interview.company.id}
              companyName={interview.company.name}
              interviewTitle={interview.title}
            />
          )}

          {/* Accept and Decline Section (pending only, for the non-creator) */}
          {showActions && (
            <div
              className={`flex items-center gap-2 ${!isEmployee ? "ml-auto" : ""}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="rounded-none text-xs text-destructive hover:bg-destructive/10"
                disabled={isUpdating}
                onClick={() => {
                  setPendingAction("decline");
                  onDecline(interview.id);
                }}
              >
                {pendingAction === "decline" ? (
                  <LucideLoader2 className="size-3.5 animate-spin" />
                ) : (
                  <LucideX className="size-3.5" />
                )}
                {t("decline")}
              </Button>
              <Button
                size="sm"
                className="rounded-none text-xs"
                disabled={isUpdating}
                onClick={() => {
                  setPendingAction("accept");
                  onAccept(interview.id);
                }}
              >
                {pendingAction === "accept" ? (
                  <LucideLoader2 className="size-3.5 animate-spin" />
                ) : (
                  <LucideCheck className="size-3.5" />
                )}
                {t("accept")}
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
