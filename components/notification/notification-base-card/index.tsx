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
        "group/card relative w-full flex items-start gap-3 rounded-xl p-4 transition-all duration-300 sm:gap-5 sm:p-5",
        "bg-card border border-border shadow-sm",
        onClick &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-brand/20 hover:bg-muted/30 hover:shadow-[0_10px_28px_hsl(var(--foreground)/0.08)] active:scale-[0.99]",
        !seen && "ring-1 ring-primary/10",
        isDeleting && "animate-card-pop-shrink",
        className,
      )}
    >
      {/* Unread Indicator Bar Section */}
      {!seen && (
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-1 rounded-r-full transition-all duration-300",
            unreadColor.replace("bg-", "bg-"), // Ensure it's a bg class
          )}
        />
      )}

      {/* Delete Button Section */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-hover/card:opacity-100 focus:opacity-100"
          aria-label={t("deleteNotification")}
        >
          <LucideX className="size-4" />
        </button>
      )}

      {/* Icon Section */}
      <div
        className={cn(
          "shrink-0 rounded-xl p-2.5 sm:p-3 transition-transform duration-300 group-hover/card:scale-110",
          iconBgColor,
          iconColor,
        )}
      >
        <div className="size-6 sm:size-8">{icon}</div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="w-full flex items-center justify-between gap-2">
          <TypographyLead className="text-sm sm:text-base font-bold text-foreground line-clamp-1">
            {title}
          </TypographyLead>
          <div className="flex items-center gap-2 shrink-0">
            <TypographySmall className="text-[10px] sm:text-xs text-muted-foreground font-medium">
              {timeAgo(timestamp, tc)}
            </TypographySmall>
            {!seen && (
              <div
                className={cn("size-2 rounded-full animate-pulse", unreadColor)}
              />
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
          {description}
        </div>

        {/* Action and Additional Content Section */}
        {children && <div className="mt-2 w-full">{children}</div>}
      </div>
    </div>
  );
}
