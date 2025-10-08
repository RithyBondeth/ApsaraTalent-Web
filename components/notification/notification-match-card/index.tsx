"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideHeartHandshake } from "lucide-react";
import { INotificationMatchCardProps } from "./props";
import { timeAgo } from "@/utils/functions/timeago-formatter";
import { useRouter } from "next/navigation";

export default function NotificationMatchCard(
  props: INotificationMatchCardProps
) {
  const router = useRouter();

  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-lg">
      <div className="rounded-md p-3 text-blue-500 bg-blue-100">
        <LucideHeartHandshake className="size-8" />
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between phone-xl:flex-col phone-xl:items-start">
          <TypographyLead className="text-md font-semibold text-primary">
            New Match Found!
          </TypographyLead>
          <div className="flex items-center gap-1">
            <TypographySmall className="text-muted-foreground phone-xl:text-xs">
              {timeAgo(props.timestamp)}
            </TypographySmall>
            {!props.seen && <div className="size-2 rounded-full bg-blue-500" />}
          </div>
        </div>
        <TypographyMuted>
          You matched with {props.user.name}
          {props.role === "employee"
            ? `, A ${props.user.position}.`
            : `, ${props.user.industry} Company.`}
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
            <div className="px-3 py-1 rounded-xl text-xs font-medium text-blue-500 bg-blue-100">
              match
            </div>
          </div>
          <Button
            className="text-xs tablet-sm:text-[10px]"
            onClick={() => router.push(`/feed/${props.role}/${props.user.id}`)}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
