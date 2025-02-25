import { LucideBookmark, LucideBriefcaseBusiness, LucideBuilding, LucideCircleArrowRight, LucideClock, LucideMapPin } from "lucide-react";

import { LucideHeartHandshake } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { TypographyMuted } from "../utils/typography/typography-muted";
import { TypographyP } from "../utils/typography/typography-p";
import { TypographySmall } from "../utils/typography/typography-small";
import { Button } from "../ui/button";
import Tag from "../utils/tag";
import IconLabel from "../utils/icon-label";

export default function CompanyCard() {
    return (
        <div className="h-fit w-full flex flex-col items-start gap-6 p-3 rounded-lg border border-muted cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary">
            {/* Profile Section */}
            <div className="w-full flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="size-20">
                        <AvatarFallback>
                            <LucideBuilding/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                        <TypographyP className="font-semibold">TechCorp Solutions</TypographyP>
                        <TypographyMuted>Technology and Software</TypographyMuted>
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
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <IconLabel text="6 Open Positions" icon={<LucideBriefcaseBusiness/>} className="[&>p]:text-primary [&>p]:font-medium"/>
                    <div className="w-full flex flex-wrap gap-2">
                        {['Software Development', 'UI/UX Design', 'Marketing', 'Sales', 'Human Resource', 'Customer Service'].map((item) => <Tag key={item} label={item} />)}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <IconLabel text="Available times" icon={<LucideClock/>} className="[&>p]:text-primary [&>p]:font-medium"/>
                    <div className="w-full flex flex-wrap gap-2">
                        {['Fulltime', 'Parttime', 'Remote', 'Intern'].map((item) => <Tag key={item} label={item} />)}
                    </div>
                </div>
            </div>

           {/* button Section */}
            <div className="w-full flex items-center justify-end gap-3">
                <Button className="text-sm" variant='outline'>
                    Save
                    <LucideBookmark/>
                </Button> 
                <Button className="text-sm" variant='secondary'>
                    View
                    <LucideCircleArrowRight/>
                </Button>
            </div>  
        </div>
    )
}