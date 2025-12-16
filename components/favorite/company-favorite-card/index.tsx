import {
  LucideArrowRight,
  LucideBookmarkX,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideClock,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Tag from "../../utils/tag";
import { TypographyH4 } from "../../utils/typography/typography-h4";
import { TypographyP } from "../../utils/typography/typography-p";
import { Button } from "../../ui/button";
import IconLabel from "@/components/utils/icon-label";
import { IFavoriteCompanyCardProps } from "./props";
import { useRouter } from "next/navigation";

export default function FavoriteCompanyCard(props: IFavoriteCompanyCardProps) {
  const router = useRouter();

  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-md tablet-xl:flex-col tablet-xl:items-start">
      <Avatar rounded="md" className="size-56">
        <AvatarFallback>{props.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        <AvatarImage src={props.avatar} />
      </Avatar>
      <div className="w-full flex flex-col items-start gap-3">
        <div className="flex flex-col items-start gap-1">
          <TypographyH4 className="text-lg">{props.name}</TypographyH4>
          <div className="flex items-center gap-3 mt-1 tablet-md:flex-col tablet-md:items-start">
            <IconLabel
              className="[&>p]:text-primary"
              icon={<LucideBuilding size={"15px"} />}
              text={props.industry}
            />
            <IconLabel
              className="[&>p]:text-primary"
              icon={<LucideClock size={"15px"} />}
              text={`Founded in ${props.foundedYear}`}
            />
          </div>
        </div>
        <TypographyP className="text-sm leading-relaxed !m-0">
          {props.description}
        </TypographyP>
        <div className="flex flex-wrap items-center gap-2">
          {props.openPosition.map((op) => (
            <Tag label={op.title} key={op.id} />
          ))}
        </div>
        <div className="w-full flex items-center justify-between mt-1 tablet-xl:flex-col tablet-xl:items-start tablet-xl:gap-5">
          <div className="flex items-center gap-5 tablet-xl:flex-col tablet-xl:items-start">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-md bg-blue-100">
                <LucideUsers size={"15px"} className="text-blue-500" />
              </div>
              <div className="flex flex-col items-start">
                <TypographyP className="text-xs !m-0">Team member</TypographyP>
                <TypographyP className="text-sm font-medium !m-0">
                  {props.companySize <= 1
                    ? `${props.companySize} member`
                    : `${props.companySize} members`}
                </TypographyP>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-red-100">
                <LucideBriefcaseBusiness
                  size={"15px"}
                  className="text-red-500"
                />
              </div>
              <div className="flex flex-col items-start">
                <TypographyP className="text-xs !m-0">
                  Open Position
                </TypographyP>
                <TypographyP className="text-sm font-medium !m-0">
                  {props.openPosition.length <= 1
                    ? `${props.openPosition.length} position`
                    : `${props.openPosition.length} positions`}
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
          <div className="flex items-center gap-3">
            <Button
              className="text-xs"
              variant={'destructive'}
              onClick={() => {}}
            >
              Remove
              <LucideBookmarkX />
            </Button>
            <Button
              className="text-xs"
              onClick={() => {
                router.replace(`/feed/company/${props.id}`);
              }}
            >
              View Detail
              <LucideArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
