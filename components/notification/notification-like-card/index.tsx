"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideHeart } from "lucide-react";
import { INotificationLikeCardProps } from "./props";
import { useTranslations } from "next-intl";
import NotificationBaseCard from "../notification-base-card";
import { useRouter } from "next/navigation";
import { getNameInitials } from "@/utils/functions/text";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export default function NotificationLikeCard(
  props: INotificationLikeCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("notification");
  const router = useRouter();

  /* --------------------------------- Methods -------------------------------- */
  // ─── Handle Navigate ─────────────────────────────────
  const handleNavigate = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    // Navigate to the sender's public feed profile
    if (props.role === USER_ROLE.EMPLOYEE) {
      router.push(`/feed/company/${props.user.id}`);
    } else {
      router.push(`/feed/employee/${props.user.id}`);
    }
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <NotificationBaseCard
      id={props.id}
      seen={props.seen}
      timestamp={props.timestamp}
      title={t("newLike")}
      description={
        props.role === USER_ROLE.EMPLOYEE
          ? t("likedYourProfile", { name: props.user.name })
          : t("likedYourCompany", { name: props.user.name })
      }
      icon={<LucideHeart strokeWidth={1.5} className="size-full" />}
      iconBgColor="bg-category-magenta-subtle"
      iconColor="text-category-magenta-accent"
      unreadColor="bg-category-magenta"
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
              className="size-8 shrink-0 border border-border bg-secondary"
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

          {/* Like Badge Section */}
          <div className="pixel-label shrink-0 border border-category-magenta/20 bg-category-magenta-subtle px-3 py-1 text-[10px] text-category-magenta-accent">
            {t("likeBadge")}
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
          {t("viewProfile")}
        </Button>
      </div>
    </NotificationBaseCard>
  );
}
