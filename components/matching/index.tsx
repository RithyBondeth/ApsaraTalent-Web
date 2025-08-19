import {
  LucideArrowRight,
  LucideCalendar,
  LucideMapPin,
  LucidePhoneCall,
  LucideUsers,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Tag from "../utils/tag";
import { TypographyH4 } from "../utils/typography/typography-h4";
import { TypographyP } from "../utils/typography/typography-p";
import { TypographySmall } from "../utils/typography/typography-small";
import Divider from "../utils/divider";
import { Button } from "../ui/button";

export default function MatchingCard() {
  return (
    <div className="w-full flex items-center gap-5 p-5 shadow-md rounded-md">
      <Avatar rounded="md" className="h-full w-[20%] phone-md:!hidden">
        <AvatarFallback>BN</AvatarFallback>
        <AvatarImage src="" />
      </Avatar>
      <div className="flex flex-col items-start gap-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <TypographyH4 className="text-lg">QuantumEdge</TypographyH4>
            <TypographyP className="text-sm font-medium !m-0">
              Quantum Computing
            </TypographyP>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Tag label={"Active"} />
            <TypographySmall className="text-xs font-medium">
              Est. 2020
            </TypographySmall>
          </div>
        </div>
        <TypographyP className="text-sm leading-relaxed !m-0">
          QuantumEdge is a pioneering technology firm developing next-generation
          quantum computing platforms, algorithms, and secure communication
          systems for global enterprises and research institutions.
        </TypographyP>
        <div className="flex items-center gap-10 mt-1">
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-md bg-blue-100">
              <LucideUsers size={"15px"} className="text-blue-500" />
            </div>
            <div className="flex flex-col items-start">
              <TypographyP className="text-xs !m-0">Team member</TypographyP>
              <TypographyP className="text-sm font-medium !m-0">
                30 members
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
                Phnom Penh
              </TypographyP>
            </div>
          </div>
        </div>
        <Divider />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1">
              <LucidePhoneCall size={"15px"} />
              <TypographyP className="text-sm !m-0">085872582</TypographyP>
            </div>
            <div className="flex items-center gap-1">
              <LucideCalendar size={"15px"} />
              <TypographyP className="text-sm !m-0">Founded in 2020</TypographyP>
            </div>
          </div>
          <Button className="text-xs">
            View Detail
            <LucideArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
