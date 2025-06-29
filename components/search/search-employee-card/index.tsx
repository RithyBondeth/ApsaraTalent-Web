import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import IconLabel from "@/components/utils/icon-label";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  LucideClock,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideMapPin,
  LucideUser,
} from "lucide-react";
import { TSearchEmployeeCardProps } from "./props";
import { useRouter } from "next/navigation";
import { availabilityConstant } from "@/utils/constants/app.constant";

export default function SearchEmployeeCard(props: TSearchEmployeeCardProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-start gap-4 px-4 py-3 shadow-md rounded-md">
      <div className="flex items-center gap-3">
        <Avatar rounded="md" className="size-28 phone-md:!hidden">
          <AvatarImage src={props.avatar} />
          <AvatarFallback>{props.username?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-3">
          <div>
            <TypographyH4 className="text-lg">
              {props.firstname} {props.lastname}
            </TypographyH4>
            <TypographyMuted className="text-sm font-medium text-blue-500">
              {props.job}
            </TypographyMuted>
          </div>
          <div className="flex items-center gap-3">
            <IconLabel
              icon={
                <LucideUser
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={
                props.yearOfExperience === 1
                  ? `${props.yearOfExperience} year experience`
                  : `${props.yearOfExperience} years experience`
              }
            />
            <IconLabel
              icon={
                <LucideMapPin
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text={props.location}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-3">
        <IconLabel
          icon={<LucideClock />}
          text={availabilityConstant.find((item) => item.value === props.availability)?.label ?? "Unknown"}
          className="text-muted-foreground"
        />
        <IconLabel
          icon={<LucideGraduationCap />}
          text={props.education}
          className="text-muted-foreground"
        />
      </div>
      <TypographyP className="!m-0 text-sm leading-loose">{props.description}</TypographyP>
      <div className="flex flex-wrap items-center gap-3">
        {props.skills.map(
          (item, index) => (
            <Tag label={item} key={index} />
          )
        )}
      </div>
      <div className="w-full flex justify-end items-center gap-2 [&>button]:text-xs">
        <Button>
          <LucideHeartHandshake />
          Like
        </Button>
        <Button onClick={() => {router.replace(`/feed/employee/${props.id}`)}}>
          <LucideUser />
          View
        </Button>
      </div>
    </div>
  );
}
