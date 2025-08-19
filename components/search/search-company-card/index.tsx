import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import IconLabel from "@/components/utils/icon-label";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  LucideAlarmClock,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCircleDollarSign,
  LucideClock2,
  LucideGraduationCap,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import { TSearchCompanyCardProps } from "./prop";
import { useRouter } from "next/navigation"; 
import { availabilityConstant } from "@/utils/constants/app.constant";

export default function SearchCompanyCard(props: TSearchCompanyCardProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-start gap-4 px-4 py-3 shadow-md rounded-md">
      <div className="flex items-center gap-3">
        <Avatar rounded="md" className="size-28 phone-md:!hidden">
          <AvatarFallback>{props.company.name.slice(0, 3).toUpperCase()}</AvatarFallback>
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
              icon={<LucideUsers className="text-muted-foreground" strokeWidth={"1.5px"}/>}
              text={`${props.company.companySize} employees`}
            />
            <IconLabel
              icon={<LucideMapPin className="text-muted-foreground" strokeWidth={"1.5px"}/>}
              text={props.company.location}
            />
            <IconLabel
              icon={<LucideClock2 className="text-muted-foreground" strokeWidth={"1.5px"}/>}
              text={availabilityConstant.find((item) => item.value === props.type)?.label ?? "Unknown"}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 mt-3">
        <IconLabel
          icon={<LucideGraduationCap className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          text={`Education - ${props.education}`}
        />
        <IconLabel
          icon={<LucideBriefcaseBusiness className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          text={`Experience - ${props.experience}`}
        />
      </div>
      <TypographyP className="!m-0 text-sm leading-loose">{props.description}</TypographyP>
      <div className="flex flex-wrap items-center gap-3">
        {props.skills.map((item, index) => (
          <Tag label={item} key={index}/>
        ))}
      </div>
      <div className="w-full flex items-center justify-between phone-xl:!flex-col phone-xl:!gap-3 phone-xl:!items-start">
        <div className="w-full flex items-center gap-3">
          <IconLabel
            text={props.salary}
            icon={<LucideCircleDollarSign className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          />
          <IconLabel
            text={props.postedDate}
            icon={<LucideAlarmClock className="text-muted-foreground" strokeWidth={"1.5px"}/>}
          />
        </div>
        <div className="w-full flex justify-end items-center gap-2 [&>button]:text-xs">
          <Button className="text-xs" onClick={() => {router.replace(`/feed/company/${props.company.userId}`)}}>
            <LucideBuilding/>
            View Company Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
