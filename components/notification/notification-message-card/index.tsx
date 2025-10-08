import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { LucideMail } from "lucide-react";

export default function NotificationMessageCard() {
  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-lg">
      <div className="rounded-full p-3 text-green-500 bg-green-100">
        <LucideMail className="size-8" />
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between">
          <TypographyLead className="text-md font-semibold text-primary">
            New Message!
          </TypographyLead>
          <div className="flex items-center gap-1">
            <TypographySmall>2 minutes ago</TypographySmall>
            <div className="size-2 rounded-full bg-blue-500" />
          </div>
        </div>
        <TypographyMuted>
          Sarah Johnson from TechCorp sent you a message about the Data Analyst
          position.
        </TypographyMuted>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Avatar rounded="full">
                <AvatarFallback>BN</AvatarFallback>
              </Avatar>
              <TypographySmall>Rithy Bondeth</TypographySmall>
            </div>
            <div className="px-3 py-1 rounded-xl text-xs font-medium text-green-500 bg-green-100">
              message
            </div>
          </div>
          <Button className="text-xs">Reply</Button>
        </div>
      </div>
    </div>
  );
}
