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
    LucideUsers
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TSearchCompanyCardProps } from "./prop";

export default function SearchCompanyCard(props: TSearchCompanyCardProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-start gap-4 rounded-md px-3 py-3 shadow-md sm:px-4">
      <div className="w-full flex items-center gap-3 sm:gap-5 tablet-md:flex-col tablet-md:items-start">
        <Avatar rounded="md" className="size-28 phone-md:!hidden">
          <AvatarFallback>
            {props.company.name.slice(0, 3).toUpperCase()}
          </AvatarFallback>
          <AvatarImage src={props.company.avatar} alt={props.company.name} />
        </Avatar>
        <div className="flex flex-col items-start gap-3 phone-340:gap-5">
          <div>
            <TypographyH4 className="text-lg">{props.title}</TypographyH4>
            <TypographyMuted className="text-sm font-medium">
              {props.company.name}
            </TypographyMuted>
            <TypographyMuted className="text-xs font-medium mt-1 text-blue-500">
              {props.company.industry}
            </TypographyMuted>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 phone-340:flex-col phone-340:items-start">
            <IconLabel
              icon={
                <LucideUsers
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={`${props.company.companySize} employees`}
            />
            <IconLabel
              icon={
                <LucideMapPin
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={props.company.location}
            />
            <IconLabel
              icon={
                <LucideClock2
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={props.type}
            />
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex flex-col items-start gap-2.5 sm:mt-3 sm:gap-3">
        <IconLabel
          icon={
            <LucideGraduationCap
              className="text-muted-foreground"
              strokeWidth={"1.5px"}
            />
          }
          text={`Education - ${props.education}`}
        />
        <IconLabel
          icon={
            <LucideBriefcaseBusiness
              className="text-muted-foreground"
              strokeWidth={"1.5px"}
            />
          }
          text={`Experience - ${props.experience}`}
        />
      </div>
      <TypographyP className="!m-0 text-sm leading-relaxed sm:leading-loose">
        {props.description}
      </TypographyP>
      <div className="flex flex-wrap items-center gap-3">
        {props.skills.map((item, index) => (
          <Tag label={item} key={index} />
        ))}
      </div>
      <div className="w-full flex items-center justify-between gap-3 phone-xl:!flex-col phone-xl:!items-start">
        <div className="w-full flex flex-wrap items-center gap-2.5 sm:gap-3">
          <IconLabel
            text={props.salary}
            icon={
              <LucideCircleDollarSign
                className="text-muted-foreground"
                strokeWidth={"1.5px"}
              />
            }
          />
          <IconLabel
            text={props.postedDate}
            icon={
              <LucideAlarmClock
                className="text-muted-foreground"
                strokeWidth={"1.5px"}
              />
            }
          />
        </div>
        <div className="w-full flex items-center justify-end gap-2 phone-xl:[&>button]:w-full [&>button]:text-xs">
          <Button
            className="text-xs phone-xl:justify-center"
            onClick={() => {
              router.replace(`/feed/company/${props.id}`);
            }}
          >
            <LucideBuilding />
            View Company Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
