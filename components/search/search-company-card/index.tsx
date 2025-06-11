import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { TSearchCompanyCardProps } from "./prop";
import Link from "next/link";

export default function SearchCompanyCard(props: TSearchCompanyCardProps) {
  return (
    <div className="w-full flex flex-col items-start gap-4 px-4 py-3 shadow-md rounded-md">
      <div className="flex items-center gap-3">
        <Avatar rounded="md" className="size-28 phone-md:!hidden">
          <AvatarFallback>{props.company.name.slice(0, 3)}</AvatarFallback>
          <AvatarImage src={props.company.avatar} alt={props.company.name}/>
        </Avatar>
        <div className="flex flex-col items-start gap-3">
          <div>
            <TypographyH4 className="text-lg">{props.title}</TypographyH4>
            <TypographyMuted className="text-sm font-medium">{props.company.name}</TypographyMuted>
            <TypographyMuted className="text-xs font-medium mt-1 text-blue-500">{props.company.industry}</TypographyMuted>
          </div>
          <div className="flex items-center gap-3">
            <IconLabel
              icon={<LucideMapPin className="text-muted-foreground" strokeWidth={"1.5px"}/>}
              text={props.company.location}
            />
            <IconLabel
              icon={<LucideClock2 className="text-muted-foreground" strokeWidth={"1.5px"}/>}
              text={props.type}
            />
          </div>
        </div>
      </div>
      <TypographyP className="!m-0 text-sm leading-loose">{props.description}</TypographyP>
      <div className="flex flex-wrap items-center gap-3">
        {props.skills.map((item, index) => (
          <Tag label={item} key={index} />
        ))}
      </div>
      <div className="w-full flex items-center justify-between phone-xl:!flex-col phone-xl:!gap-3 phone-xl:!items-start">
        <div className="flex items-center gap-3">
          <IconLabel
            text={props.salary}
            icon={<LucideCircleDollarSign className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          />
          <IconLabel
            text={props.postedDate}
            icon={<LucideAlarmClock className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          />
        </div>
        <Link href={`feed/company/${props.company.userId}`}>
          <Button className="text-xs">
            View Company
            <LucideBuilding />
          </Button>
        </Link>
      </div>
    </div>
  );
}
