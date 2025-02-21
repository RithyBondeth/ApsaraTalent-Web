import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import Tag from "../utils/tag";
import { TypographyMuted } from "../utils/typography/typography-muted";
import { TypographyP } from "../utils/typography/typography-p";
import { TypographySmall } from "../utils/typography/typography-small";
import { LucideCircleArrowRight, LucideFileUser, LucideHeartHandshake, LucideMapPin } from "lucide-react";
export default function FeedCard() {
    return (
        <div className="h-fit w-full flex flex-col items-start gap-3 p-3 rounded-lg border border-muted cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary">
            {/* Profile Section */}
            <div className="w-full flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="size-20">
                        <AvatarFallback>JAN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                        <TypographyP className="font-semibold">John Doe</TypographyP>
                        <TypographyMuted>Software Engineer</TypographyMuted>
                        <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
                            <LucideMapPin className="size-3 "/>
                            <span>Phnom Penh, Cambodia</span>
                        </TypographySmall>
                    </div>
                </div>
                <Button className="size-12 rounded-full transition-all duration-300 ease-in-out hover:scale-105">
                    <LucideHeartHandshake className="!size-6 transition-all duration-300 ease-in-out" />
                </Button>
            </div>

            {/* Tag Section */}
            <div className="w-full flex flex-wrap gap-1">
                <Tag label="Software Engineer" />
                <Tag label="Graphic Designer" />
            </div>

            {/* Description Section */}
            <TypographyP className="!m-0 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. amet consectetur adipisicing.
            </TypographyP> 

            {/* button Section */}
            <div className="w-full flex items-center justify-end gap-3">
                <Button className="text-sm" variant='outline'>
                    Resume
                    <LucideFileUser/>
                </Button>
                <Button className="text-sm">
                    View
                    <LucideCircleArrowRight/>
                </Button>
            </div>
        </div>   
    );
}