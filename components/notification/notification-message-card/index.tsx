"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideMail } from "lucide-react";
import { useRouter } from "next/navigation";
import { INotificationMessageCardProps } from "./props";
import { useTranslations } from "next-intl";
import NotificationBaseCard from "../notification-base-card";
import { getNameInitials } from "@/utils/functions/text";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function NotificationMessageCard(
  props: INotificationMessageCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("notification");

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Reply ─────────────────────────────────────────
  const handleReply = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    router.push(`/message?chat=${props.user.id}`);
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <NotificationBaseCard
      id={props.id}
      seen={props.seen}
      timestamp={props.timestamp}
      title={t("newMessage")}
      description={
        <p className="line-clamp-2 sm:line-clamp-3">
          <span className="font-medium text-foreground">{props.user.name}</span>
          {" — "}
          {props.preview}
        </p>
      }
      icon={<LucideMail strokeWidth={1.5} className="size-full" />}
      iconBgColor="bg-category-lime-subtle"
      iconColor="text-category-lime-accent"
      unreadColor="bg-category-lime"
      onDelete={props.onDelete}
      onClick={handleReply}
    >
      {/* Content Section */}
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

          {/* Message Badge Section */}
          <div className="pixel-label shrink-0 border border-category-lime/20 bg-category-lime-subtle px-3 py-1 text-[10px] text-category-lime-accent">
            {t("messageBadge")}
          </div>
        </div>

        {/* Button Section */}
        <Button
          className="h-8 rounded-none text-xs tablet-sm:h-9 tablet-sm:w-full tablet-sm:text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleReply();
          }}
        >
          {t("reply")}
        </Button>
      </div>
    </NotificationBaseCard>
  );
}
