import {
    LucideArrowRight,
    LucideBriefcaseBusiness,
    LucideClock,
    LucideMapPin,
  } from "lucide-react";
  import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
  import Tag from "../../utils/tag";
  import { TypographyH4 } from "../../utils/typography/typography-h4";
  import { TypographyP } from "../../utils/typography/typography-p";
  import { Button } from "../../ui/button";
import { IFavoriteEmployeeCardProps } from "./props";
import { useRouter } from "next/navigation";

  
  export default function FavoriteEmployeeCard(
    props: IFavoriteEmployeeCardProps
  ) {
    const router = useRouter();
    
    return (
      <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-md">
        <Avatar rounded="md" className="size-56 phone-md:!hidden">
          <AvatarFallback>{props.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>
        <div className="w-full flex flex-col items-start gap-3">
          <div className="w-full flex items-start justify-between">
            <div className="flex flex-col items-start gap-1">
              <TypographyH4 className="text-lg">{props.name}</TypographyH4>
              <TypographyP className="text-sm font-medium !m-0">
                @{props.username}
              </TypographyP>
            </div>
            <Tag label={"Full Time Available"} />
          </div>
          <TypographyP className="text-sm leading-relaxed !m-0">
            {props.description}
          </TypographyP>
          <div className="flex flex-wrap items-center gap-2">
            {props.skills.map((skill, index) => (
              <Tag label={skill} key={index} />
            ))}
          </div>
          <div className="w-full flex items-center justify-between mt-2">
            <div className="flex items-center gap-5">
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
                    {props.experience <= 1
                      ? `${props.experience} year experience`
                      : `${props.experience} years experience`}
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
            <Button className="text-xs" onClick={() => {
              router.replace(`/feed/employee/${props.id}`)
            }}>
              View Detail
              <LucideArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  