"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusBadgeStyleClass } from "@/utils/functions/ui/get-interview-status-class";
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
import { AiInterviewPrepModal } from "@/components/matching/ai-interview-prep-modal";
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
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Header Row Section */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold leading-tight truncate">
              {interview.title}
            </h3>
            <TypographyMuted className="text-sm text-muted-foreground mt-0.5">
              {t("with", { name: otherPartyName })}
            </TypographyMuted>
          </div>
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeStyleClass(interview.status)}`}
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
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full">
            <LucideCalendarCheck className="size-3.5" />
            {formatShortDate(interview.scheduledAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full">
            <LucideClock className="size-3.5" />
            {interview.durationMinutes} min
          </span>
          {interview.location && (
            <span className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full">
              <LucideMapPin className="size-3.5" />
              {interview.location}
            </span>
          )}
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
            >
              <LucideLink className="size-3.5" />
              {t("joinMeeting")}
            </a>
          )}
        </div>
      </div>

      {/* Action Bar Section: Practice Questions (employee only) + Accept/Decline (pending only) */}
      {(isEmployee || showActions) && (
        <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
          {/* AI Practice Questions Section (employees only) */}
          {isEmployee && (
            <AiInterviewPrepModal
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
                className="text-xs text-destructive hover:bg-destructive/10"
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
                className="text-xs"
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
    </div>
  );
}
