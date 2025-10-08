import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideHeartHandshake } from "lucide-react";
import { INotificationMatchCardProps } from "./props";

export default function NotificationMatchCard(
  props: INotificationMatchCardProps
) {
  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-lg">
      <div className="rounded-md p-3 text-blue-500 bg-blue-100">
        <LucideHeartHandshake className="size-8" />
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between">
          <TypographyLead className="text-md font-semibold text-primary">
            New Match Found!
          </TypographyLead>
          <div className="flex items-center gap-1">
            <TypographySmall>2 minutes ago</TypographySmall>
            <div className="size-2 rounded-full bg-blue-500" />
          </div>
        </div>
        <TypographyMuted>
          You matched with {props.user.name}
          {props.role === "employee"
            ? `, A ${props.user.position}.`
            : `, ${props.user.industry} Company.`}
        </TypographyMuted>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar rounded="md" className="bg-secondary size-8">
                <AvatarFallback>
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
          <Button className="text-xs">View Profile</Button>
        </div>
      </div>
    </div>
  );
}
