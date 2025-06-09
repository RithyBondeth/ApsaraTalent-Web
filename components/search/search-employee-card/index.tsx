import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import IconLabel from "@/components/utils/icon-label";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  LucideAlarmClock,
  LucideBuilding,
  LucideCircleDollarSign,
  LucideClock2,
  LucideMapPin,
} from "lucide-react";

export default function SearchEmployeeCard() {
  return (
    <div className="w-full flex flex-col items-start gap-4 px-4 py-3 shadow-md rounded-md">
      <div className="flex items-center gap-3">
        <Avatar rounded="md" className="size-28 phone-md:!hidden">
          <AvatarFallback>TEC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-3">
          <div>
            <TypographyH4 className="text-lg">Tech Solution</TypographyH4>
            <TypographyMuted className="text-sm font-medium text-blue-500">
              Cloud Computing
            </TypographyMuted>
          </div>
          <div className="flex flex-col items-start gap-1">
            <IconLabel
              icon={
                <LucideMapPin
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={"Phnom Penh, Cambodia"}
            />
            <IconLabel
              icon={
                <LucideClock2
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={"Internship"}
            />
          </div>
        </div>
      </div>
      <TypographyP className="!m-0 text-sm leading-loose">
        Design and implement scalable machine learning pipelines for real-time
        decision systems. Design and implement scalable machine learning
        pipelines for real-time decision systems.
      </TypographyP>
      <div className="flex flex-wrap items-center gap-3">
        {[1, 2, 3].map((item) => (
          <Tag label="Typescript" key={item} />
        ))}
      </div>
      <div className="w-full flex items-center justify-between phone-xl:!flex-col phone-xl:!gap-3 phone-xl:!items-start">
        <div className="flex items-center gap-3">
          <IconLabel
            text="$90k - $110k"
            icon={<LucideCircleDollarSign className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          />
          <IconLabel
            text="1 week ago"
            icon={<LucideAlarmClock className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          />
        </div>
        <Button className="text-xs">
          View Company
          <LucideBuilding />
        </Button>
      </div>
    </div>
  );
}
