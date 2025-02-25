"use client"
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import Tag from "../utils/tag";
import { TypographyMuted } from "../utils/typography/typography-muted";
import { TypographyP } from "../utils/typography/typography-p";
import { TypographySmall } from "../utils/typography/typography-small";
import { LucideBookmark, LucideCircleArrowRight, LucideHeartHandshake, LucideMapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import UserDialog from "../user-dialog";
import { IUserCardProps } from "./props";

export default function UserCard(props: IUserCardProps) {
    const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
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
    
        setOpenProfileDialog(true);
    };

    useEffect(() => {
        if (!openProfileDialog) {
            // Prevent reopening immediately after closing
            ignoreNextClick.current = true;
            setTimeout(() => {
                ignoreNextClick.current = false;
            }, 200);
        }
    }, [openProfileDialog]);

    
    return (
        <div className="h-fit w-full flex flex-col items-start gap-5 p-3 rounded-lg border border-muted cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary">
            {/* Profile Section */}
            <div className="w-full flex items-start justify-between" onClick={handleClickDialog}>
                <div className="flex items-center gap-3">
                    <Avatar className="size-20">
                        <AvatarFallback>{!props.avatar ? props.name.slice(0, 2) : props.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                        <TypographyP className="font-semibold">{props.name}</TypographyP>
                        <TypographyMuted>{props.job}</TypographyMuted>
                        <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
                            <LucideMapPin className="size-3 "/>
                            <span>{props.location}</span>
                        </TypographySmall>
                    </div>
                </div>
                <Button className="size-12 rounded-full transition-all duration-300 ease-in-out hover:scale-105">
                    <LucideHeartHandshake className="!size-6 transition-all duration-300 ease-in-out" />
                </Button>
            </div>

            {/* Tag Section */}
            <div className="w-full flex flex-wrap gap-2">
                {props.skills.map((skill) => <Tag key={skill} label={skill} />)}
            </div>

            {/* Description Section */}
            <TypographyP className="!m-0 text-sm leading-relaxed">{props.description}</TypographyP> 

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
            <UserDialog open={openProfileDialog} setOpen={setOpenProfileDialog}
                avatar={props.avatar}
                name={props.name}
                job={props.job}
                location={props.location}
                yearsOfExperience={props.yearsOfExperience}
                availability={props.availability}
                skills={props.skills}
                educations={props.educations}
                status={props.status}
            />
        </div>      
    );
}