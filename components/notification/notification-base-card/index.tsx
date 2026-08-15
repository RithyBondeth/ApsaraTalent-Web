"use client";

import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/functions/date";
import { LucideX } from "lucide-react";
import { useTranslations } from "next-intl";
import { INotificationBaseCardProps } from "./props";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useState } from "react";

export default function NotificationBaseCard(
  props: INotificationBaseCardProps,
) {
  /* ----------------------------- Props --------------------------- */
  const {
    id,
    seen,
    timestamp,
    title,
    description,
    icon,
    iconBgColor,
    iconColor,
    unreadColor = "bg-primary",
    children,
    onClick,
    onDelete,
    className,
  } = props;

  /* ----------------------------- Utils ---------------------------- */
  const t = useTranslations("notification");
  const tc = useTranslations("common");

  /* ----------------------------- State ---------------------------- */
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /* ---------------------------- Methods --------------------------- */
  // ─── Handle Delete ─────────────────────────────────
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      setIsDeleting(true);
      // Wait for animation to complete
      setTimeout(() => {
        onDelete(id);
      }, 400);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group/card relative flex w-full items-start gap-3 overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card p-4 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] transition-all duration-300 sm:gap-5 sm:p-5",
        onClick &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:bg-muted/20 hover:shadow-[8px_8px_0_hsl(var(--foreground)/0.08)] active:scale-[0.99]",
        !seen && "bg-muted/15",
        isDeleting && "animate-card-pop-shrink",
        className,
      )}
    >
      {/* Unread Indicator Bar Section */}
      {!seen && (
        <div
          className={cn(
            "absolute bottom-0 left-0 top-0 w-1 transition-all duration-300",
            unreadColor,
          )}
        />
      )}

      {/* Delete Button Section */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-3 top-3 p-1.5 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive focus:opacity-100 group-hover/card:opacity-100"
          aria-label={t("deleteNotification")}
        >
          <LucideX className="size-4" />
        </button>
      )}

      {/* Icon Section */}
      <div
        className={cn(
          "border-current/10 shrink-0 border p-2.5 transition-transform duration-300 group-hover/card:scale-105 sm:p-3",
          iconBgColor,
          iconColor,
        )}
      >
        <div className="size-6 sm:size-8">{icon}</div>
      </div>

      {/* Content Section */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex w-full items-center justify-between gap-2 pr-7">
          <TypographyLead className="pixel-display line-clamp-1 text-sm text-foreground sm:text-base">
            {title}
          </TypographyLead>
          <div className="flex shrink-0 items-center gap-2">
            <TypographySmall className="text-[10px] font-medium text-muted-foreground sm:text-xs">
              {timeAgo(timestamp, tc)}
            </TypographySmall>
            {!seen && (
              <div
                className={cn("size-2 animate-pulse rounded-full", unreadColor)}
              />
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3">
          {description}
        </div>

        {/* Action and Additional Content Section */}
        {children && <div className="mt-2 w-full">{children}</div>}
      </div>
    </div>
  );
}
