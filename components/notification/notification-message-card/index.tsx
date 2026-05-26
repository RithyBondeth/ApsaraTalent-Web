"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideMail } from "lucide-react";
import { useRouter } from "next/navigation";
import { INotificationMessageCardProps } from "./props";
import { useTranslations } from "next-intl";
import NotificationBaseCard from "../notification-base-card";

export default function NotificationMessageCard(
  props: INotificationMessageCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("notification");

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Reply ─────────────────────────────────────────
  const handleReply = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    router.push(`/message?chat=${props.user.id}`);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <NotificationBaseCard
      id={props.id}
      seen={props.seen}
      timestamp={props.timestamp}
      title={t("newMessage")}
      description={
        <p className="line-clamp-2 sm:line-clamp-3">
          <span className="font-bold text-foreground">{props.user.name}</span>
          {" — "}
          {props.preview}
        </p>
      }
      icon={<LucideMail strokeWidth={1.5} className="size-full" />}
      iconBgColor="bg-green-100 dark:bg-green-900/30"
      iconColor="text-green-500"
      unreadColor="bg-green-500"
      onDelete={props.onDelete}
      onClick={handleReply}
    >
      {/* Content Section */}
      <div className="w-full flex items-center justify-between gap-2 tablet-sm:flex-col tablet-sm:items-start tablet-sm:gap-3">
        {/* User Info Section */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar and Name Section */}
          <div className="flex items-center gap-2 min-w-0">
            <Avatar rounded="md" className="bg-secondary size-8 shrink-0">
              <AvatarFallback className="text-sm">
                {props.user.name.slice(0, 2).toUpperCase()}
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

          {/* Message Badge Section */}
          <div className="shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-100 dark:bg-green-900/30">
            {t("messageBadge")}
          </div>
        </div>

        {/* Button Section */}
        <Button
          className="h-8 text-xs tablet-sm:h-9 tablet-sm:w-full tablet-sm:text-xs"
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
