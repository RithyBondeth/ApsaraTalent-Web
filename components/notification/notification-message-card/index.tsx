"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { timeAgo } from "@/utils/functions/timeago-formatter";
import { LucideMail } from "lucide-react";
import { useRouter } from "next/navigation";
import { INotificationMessageCardProps } from "./props";

export default function NotificationMessageCard(
  props: INotificationMessageCardProps,
) {
  const router = useRouter();

  const handleReply = () => {
    if (props.onMarkRead && !props.seen) props.onMarkRead(props.id);
    router.push(`/message?chat=${props.user.id}`);
  };

  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-lg">
      <div className="rounded-md p-3 text-green-500 bg-green-100">
        <LucideMail className="size-8" strokeWidth={1.5} />
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between phone-xl:flex-col phone-xl:items-start">
          <TypographyLead className="text-md font-semibold text-primary">
            New Message!
          </TypographyLead>
          <div className="flex items-center gap-1">
            <TypographySmall className="text-muted-foreground phone-xl:text-xs">
              {timeAgo(props.timestamp)}
            </TypographySmall>
            {!props.seen && (
              <div className="size-2 rounded-full bg-green-500" />
            )}
          </div>
        </div>
        <TypographyMuted>
          <span className="font-medium">{props.user.name}</span>
          {" — "}
          {props.preview}
        </TypographyMuted>
        <div className="w-full flex items-center justify-between tablet-sm:mt-1 tablet-sm:justify-end">
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
            <div className="px-3 py-1 rounded-xl text-xs font-medium text-green-500 bg-green-100">
              message
            </div>
          </div>
          <Button className="text-xs tablet-sm:text-[10px]" onClick={handleReply}>
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
