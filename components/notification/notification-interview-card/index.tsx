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
import { USER_ROLE } from "@/utils/constants/auth.constant";

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
      iconBgColor="bg-category-orange-subtle"
      iconColor="text-category-orange-accent"
      unreadColor="bg-category-orange"
      onDelete={props.onDelete}
      onClick={handleNavigate}
    >
      <div className="flex w-full items-center justify-between gap-2 tablet-sm:flex-col tablet-sm:items-start tablet-sm:gap-3">
        {/* User Info Section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar and Name Section */}
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              rounded="md"
              className="size-8 shrink-0 !rounded-none border border-border bg-secondary"
            >
              <AvatarFallback className="text-sm">
                {getNameInitials(props.user.name)}
              </AvatarFallback>
              <AvatarImage src={props.user.avatar} />
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <TypographySmall className="line-clamp-1 font-medium text-foreground">
                {props.user.name}
              </TypographySmall>
              {(props.user.position || props.user.industry) && (
                <TypographySmall className="line-clamp-1 text-[10px] text-muted-foreground">
                  {props.role === USER_ROLE.EMPLOYEE
                    ? props.user.industry
                    : props.user.position}
                </TypographySmall>
              )}
            </div>
          </div>

          {/* Interview Badge Section */}
          <div className="pixel-label shrink-0 border border-category-orange/20 bg-category-orange-subtle px-3 py-1 text-[10px] text-category-orange-accent">
            {t("interviewBadge")}
          </div>
        </div>

        {/* Button Section */}
        <Button
          className="h-8 rounded-none text-xs tablet-sm:h-9 tablet-sm:w-full tablet-sm:text-xs"
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
