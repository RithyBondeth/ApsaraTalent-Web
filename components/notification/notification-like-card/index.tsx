"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { timeAgo } from "@/utils/functions/date";
import { LucideHeart, LucideX } from "lucide-react";
import { useRouter } from "next/navigation";
import { INotificationLikeCardProps } from "./props";

export default function NotificationLikeCard(
  props: INotificationLikeCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle View Profile ─────────────────────────────────────────
  const handleViewProfile = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    router.push(`/feed/${props.role}/${props.user.id}`);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="group/card relative w-full flex items-start gap-3 rounded-lg p-3 shadow-md sm:gap-5 sm:p-5">
      {/* Delete Button Section */}
      {props.onDelete && (
        <button
          onClick={() => props.onDelete!(props.id)}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover/card:opacity-100"
        >
          <LucideX className="size-4" />
        </button>
      )}

      {/* Like Icon Section */}
      <div className="rounded-md bg-pink-100 p-2.5 text-pink-500 sm:p-3">
        <LucideHeart className="size-6 sm:size-8" strokeWidth={1.5} />
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between phone-xl:flex-col phone-xl:items-start">
          <TypographyLead className="text-md font-semibold text-primary">
            New Like!
          </TypographyLead>
          <div className="flex items-center gap-1">
            <TypographySmall className="text-muted-foreground phone-xl:text-xs">
              {timeAgo(props.timestamp)}
            </TypographySmall>
            {!props.seen && <div className="size-2 rounded-full bg-pink-500" />}
          </div>
        </div>

        {/* Description Section */}
        <TypographyMuted>{props.message}</TypographyMuted>

        {/* Action Section */}
        <div className="w-full flex items-center justify-between gap-2 tablet-sm:mt-1 tablet-sm:justify-end">
          <div className="flex items-center gap-3 tablet-sm:hidden">
            <div className="flex items-center gap-2">
              <Avatar rounded="md" className="bg-secondary size-8">
                <AvatarFallback className="text-sm">
                  {props.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={props.user.avatar} />
              </Avatar>
              <TypographySmall>{props.user.name}</TypographySmall>
            </div>

            {/* Like Badge Section */}
            <div className="px-3 py-1 rounded-xl text-xs font-medium text-pink-500 bg-pink-100">
              like
            </div>
          </div>

          {/* View Profile Button Section */}
          <Button
            className="h-8 text-xs tablet-sm:h-9 tablet-sm:w-full tablet-sm:text-xs"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
