"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideCalendarCheck } from "lucide-react";
import { INotificationInterviewCardProps } from "./props";
import { useTranslations } from "next-intl";
import NotificationBaseCard from "../notification-base-card";
import { useRouter } from "next/navigation";
import { getNameInitials } from "@/utils/functions/text";

export default function NotificationInterviewCard(
  props: INotificationInterviewCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("notification");
  const router = useRouter();

  const eventTypeKeyMap: Record<string, string> = {
    interview_scheduled: "interviewScheduled",
    interview_accepted: "interviewAccepted",
    interview_declined: "interviewDeclined",
    interview_cancelled: "interviewCancelled",
    interview_completed: "interviewCompleted",
  };
  const titleKey = eventTypeKeyMap[props.eventType] ?? "newInterview";

  const description = props.rawMessage
    ? props.rawMessage
    : props.status
      ? t("interviewMessageStatus", {
          title: props.interviewTitle,
          status: props.status,
        })
      : t("interviewMessageScheduled", {
          name: props.senderName,
          title: props.interviewTitle,
        });

  /* --------------------------------- Methods --------------------------------- */
  // ─── Handle Navigate ─────────────────────────────────
  const handleNavigate = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    router.push("/interview");
  };

  return (
    <NotificationBaseCard
      id={props.id}
      seen={props.seen}
      timestamp={props.timestamp}
      title={t(titleKey as Parameters<typeof t>[0])}
      description={description}
      icon={<LucideCalendarCheck strokeWidth={1.5} className="size-full" />}
      iconBgColor="bg-teal-100 dark:bg-teal-900/30"
      iconColor="text-teal-600"
      unreadColor="bg-teal-500"
      onDelete={props.onDelete}
      onClick={handleNavigate}
    >
      <div className="w-full flex items-center justify-between gap-2 tablet-sm:flex-col tablet-sm:items-start tablet-sm:gap-3">
        {/* User Info Section */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar and Name Section */}
          <div className="flex items-center gap-2 min-w-0">
            <Avatar rounded="md" className="bg-secondary size-8 shrink-0">
              <AvatarFallback className="text-sm">
                {getNameInitials(props.user.name)}
              </AvatarFallback>
              <AvatarImage src={props.user.avatar} />
            </Avatar>
            <div className="flex flex-col min-w-0">
              <TypographySmall className="font-bold text-foreground line-clamp-1">
                {props.user.name}
              </TypographySmall>
              {(props.user.position || props.user.industry) && (
                <TypographySmall className="text-[10px] text-muted-foreground line-clamp-1">
                  {props.role === "employee"
                    ? props.user.industry
                    : props.user.position}
                </TypographySmall>
              )}
            </div>
          </div>

          {/* Interview Badge Section */}
          <div className="shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-100 dark:bg-teal-900/30">
            {t("interviewBadge")}
          </div>
        </div>

        {/* Button Section */}
        <Button
          className="h-8 text-xs tablet-sm:h-9 tablet-sm:w-full tablet-sm:text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          {t("viewInterview")}
        </Button>
      </div>
    </NotificationBaseCard>
  );
}
