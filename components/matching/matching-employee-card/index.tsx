import { availabilityWordsFormat } from "@/utils/functions/availability-word-format";
import {
    LucideBriefcaseBusiness,
    LucideClock,
    LucideMapPin,
    LucideMessageCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "../../utils/tag";
import { TypographyH4 } from "../../utils/typography/typography-h4";
import { TypographyP } from "../../utils/typography/typography-p";
import { IMatchingEmployeeCardProps } from "./props";

export default function MatchingEmployeeCard(
  props: IMatchingEmployeeCardProps,
) {
  return (
    <div className="w-full flex items-start gap-3 rounded-md p-3 shadow-md sm:gap-5 sm:p-5 tablet-xl:flex-col">
      <Avatar rounded="md" className="size-28 sm:size-36 lg:size-56">
        <AvatarFallback>{props.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        <AvatarImage src={props.avatar} />
      </Avatar>
      <div className="w-full flex flex-col items-start gap-3">
        <div className="w-full flex items-start justify-between gap-2 tablet-xl:justify-start tablet-xl:gap-3">
          <div className="flex flex-col items-start gap-1">
            <TypographyH4 className="text-lg">{props.name}</TypographyH4>
            <TypographyP className="text-sm font-medium !m-0">
              @{props.username}
            </TypographyP>
          </div>
          <Tag label={availabilityWordsFormat(props.availability)} />
        </div>
        <TypographyP className="text-sm leading-relaxed !m-0">
          {props.description}
        </TypographyP>
        <div className="flex flex-wrap items-center gap-2">
          {props.skills.map((skill, index) => (
            <Tag label={skill} key={index} />
          ))}
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-3 tablet-xl:flex-col tablet-xl:items-start tablet-xl:gap-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 tablet-lg:flex-col tablet-lg:items-start">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-md bg-blue-100">
                <LucideBriefcaseBusiness
                  size={"15px"}
                  className="text-blue-500"
                />
              </div>
              <div className="flex flex-col items-start">
                <TypographyP className="text-xs !m-0">Position</TypographyP>
                <TypographyP className="text-sm font-medium !m-0">
                  {props.position}
                </TypographyP>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-md bg-red-100">
                <LucideClock size={"15px"} className="text-red-500" />
              </div>
              <div className="flex flex-col items-start">
                <TypographyP className="text-xs !m-0">Experience</TypographyP>
                <TypographyP className="text-sm font-medium !m-0">
                  {props.experience}
                </TypographyP>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-md bg-green-100">
                <LucideMapPin size={"15px"} className="text-green-500" />
              </div>
              <div className="flex flex-col items-start">
                <TypographyP className="text-xs !m-0">Location</TypographyP>
                <TypographyP className="text-sm font-medium !m-0">
                  {props.location}
                </TypographyP>
              </div>
            </div>
          </div>
          <Button
            className="w-full text-xs phone-xl:justify-center sm:w-auto"
            onClick={props.onChatNowClick}
          >
            Chat now
            <LucideMessageCircle />
          </Button>
        </div>
      </div>
    </div>
  );
}
