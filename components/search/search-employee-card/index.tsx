import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export default function SearchEmployeeCard() {
  return (
    <div className="w-full flex flex-col items-start gap-4 px-4 py-3 shadow-md rounded-md">
      <div className="flex items-center gap-3">
        <Avatar rounded="full" className="size-28 phone-md:!hidden">
          <AvatarFallback>BON</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-3">
          <div>
            <TypographyH4 className="text-lg">Hem RithyBondeth</TypographyH4>
            <TypographyMuted className="text-sm font-medium text-blue-500">
              Full Stack Developer
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
              text={"2 years experience"}
            />
            <IconLabel
              icon={
                <LucideMapPin
                  className="text-muted-foreground"
                  strokeWidth={"1.5px"}
                />
              }
              text="Phnom Penh"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-3">
        <IconLabel
          icon={<LucideClock />}
          text={"Internship Available"}
          className="text-muted-foreground"
        />
        <IconLabel
          icon={<LucideGraduationCap />}
          text={"Bachelor's Degree of Computer Science"}
          className="text-muted-foreground"
        />
      </div>
      <TypographyP className="!m-0 text-sm leading-loose">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
        distinctio adipisci odit. Possimus at, nesciunt cum fuga eos voluptatum
        repudiandae.
      </TypographyP>
      <div className="flex flex-wrap items-center gap-3">
        {["Typescript", "React.js", "Next.js", "Figma", "Javascript"].map(
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
        <Button>
          <LucideUser />
          View Employee
        </Button>
      </div>
    </div>
  );
}
