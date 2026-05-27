"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideHeartHandshake } from "lucide-react";
import { INotificationMatchCardProps } from "./props";
import { useTranslations } from "next-intl";
import NotificationBaseCard from "../notification-base-card";
import { useRouter } from "next/navigation";
import { getNameInitials } from "@/utils/functions/text";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function NotificationMatchCard(
  props: INotificationMatchCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("notification");
  const router = useRouter();

  /* --------------------------------- Methods --------------------------------- */
  // ─── Handle Navigate ─────────────────────────────────
  const handleNavigate = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    router.push("/matching");
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <NotificationBaseCard
      id={props.id}
      seen={props.seen}
      timestamp={props.timestamp}
      title={t("newMatch")}
      description={
        props.role === USER_ROLE.EMPLOYEE
          ? t("matchedWithEmployee", {
              name: props.user.name,
              position: props.user.position ?? "",
            })
          : t("matchedWithCompany", {
              name: props.user.name,
              industry: props.user.industry ?? "",
            })
      }
      icon={<LucideHeartHandshake strokeWidth={1.5} className="size-full" />}
      iconBgColor="bg-blue-100 dark:bg-blue-900/30"
      iconColor="text-blue-500"
      unreadColor="bg-blue-500"
      onDelete={props.onDelete}
      onClick={handleNavigate}
    >
      {/* Content Section */}
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
                  {props.role === USER_ROLE.EMPLOYEE
                    ? props.user.industry
                    : props.user.position}
                </TypographySmall>
              )}
            </div>
          </div>

          {/* Match Badge Section */}
          <div className="shrink-0 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-100 dark:bg-blue-900/30">
            {t("matchBadge")}
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
          {t("viewMatching")}
        </Button>
      </div>
    </NotificationBaseCard>
  );
}
