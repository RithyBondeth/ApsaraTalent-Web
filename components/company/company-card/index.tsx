"use client"

import { LucideBookmark, LucideBriefcaseBusiness, LucideBuilding, LucideCircleArrowRight, LucideClock, LucideEye, LucideMapPin, LucideUsers } from "lucide-react";
import { LucideHeartHandshake } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { TypographyMuted } from "../../utils/typography/typography-muted";
import { TypographyP } from "../../utils/typography/typography-p";
import { TypographySmall } from "../../utils/typography/typography-small";
import { Button } from "../../ui/button";
import Tag from "../../utils/tag";
import IconLabel from "../../utils/icon-label";
import { useEffect } from "react";
import { useState } from "react";
import { ICompanyCardProps } from "./props";
import { useRef } from "react";
import CompanyDialog from "../company-dialog";
import { IJobPosition } from "@/utils/interfaces/user-interface/company.interface";      

export default function CompanyCard(props: ICompanyCardProps) {
    const [openCompanyDialog, setOpenCompanyDialog] = useState<boolean>(false);
    const ignoreNextClick = useRef<boolean>(false);

    const handleClickDialog = (e: React.MouseEvent) => {
        // Prevent reopening immediately after closing
        if (ignoreNextClick.current) {
            ignoreNextClick.current = false;
            return;
        }
    
        // Check if the click happened inside the DialogContent
        if ((e.target as HTMLElement).closest(".dialog-content")) {
            return;
        }
    
        setOpenCompanyDialog(true);
    };

    useEffect(() => {
        if (!openCompanyDialog) {
            // Prevent reopening immediately after closing
            ignoreNextClick.current = true;
            setTimeout(() => ignoreNextClick.current = false, 200);
        }
    }, [openCompanyDialog]);

    return (
        <div className="h-fit w-full flex flex-col items-start gap-6 p-3 rounded-lg border border-muted cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary">
            {/* Profile Section */}
            <div className="w-full flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="size-20" onClick={props.onProfileImageClick}>
                        <AvatarImage src={props.avatar!}/>
                        <AvatarFallback className="uppercase">{!props.avatar && props.name.slice(0, 3)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                        <TypographyP className="font-semibold">{props.name}</TypographyP>
                        <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
                            <LucideUsers className="size-3 "/>
                            <span>{props.companySize} employees</span>
                        </TypographySmall>
                        <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
                            <LucideMapPin className="size-3 "/>
                            <span>{props.location}</span>
                        </TypographySmall>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button className="size-12 rounded-full transition-all duration-300 ease-in-out hover:scale-105" onClick={handleClickDialog}>
                        <LucideEye className="!size-6 transition-all duration-300 ease-in-out" />
                    </Button>
                        <Button className="size-12 rounded-full transition-all duration-300 ease-in-out hover:scale-105">
                        <LucideHeartHandshake className="!size-6 transition-all duration-300 ease-in-out" />
                    </Button>
                </div>
            </div>

            {/* Industry Section */}
            <div className="w-full flex flex-col gap-3">
                <IconLabel text="Industry" icon={<LucideBuilding/>} className="[&>p]:text-primary [&>p]:font-medium"/>
                <TypographyMuted>{props.description}</TypographyMuted>
            </div>

            {/* Tag Section */}
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <IconLabel 
                        text={`${props.openPositions.length} Open Positions`} 
                        icon={<LucideBriefcaseBusiness/>} 
                        className="[&>p]:text-primary [&>p]:font-medium"
                    />
                    <div className="w-full flex flex-wrap gap-2">
                        {props.openPositions.map((item: IJobPosition, index) => <Tag key={index} label={item.title} />)}
                    </div>
                </div>
                {(props.availableTimes && <div className="flex flex-col gap-3">
                    <IconLabel text="Available times" icon={<LucideClock/>} className="[&>p]:text-primary [&>p]:font-medium"/>
                    <div className="w-full flex flex-wrap gap-2">
                        {props.availableTimes.map((item , index) => <Tag key={index} label={item} />)}
                    </div>
                </div>)}
            </div>

           {/* button Section */}
            <div className="w-full flex items-center justify-end gap-3">
                <Button className="text-sm" variant='outline' onClick={props.onSaveClick}>
                    Save
                    <LucideBookmark/>
                </Button> 
                <Button className="text-sm" variant='secondary' onClick={props.onViewClick}>
                    View
                    <LucideCircleArrowRight/>
                </Button>
            </div>  
            
            {/* Hidden Dialog Section */}
            <CompanyDialog  
                open={openCompanyDialog} 
                setOpen={setOpenCompanyDialog}
                {...props}
            />
        </div>
    )
}