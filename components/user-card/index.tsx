"use client"
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import Tag from "../utils/tag";
import { TypographyMuted } from "../utils/typography/typography-muted";
import { TypographyP } from "../utils/typography/typography-p";
import { TypographySmall } from "../utils/typography/typography-small";
import { LucideCircleArrowRight, LucideFileUser, LucideHeartHandshake, LucideMapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import UserDialog from "../user-dialog";
import { useRouter } from "next/navigation";

export default function UserCard() {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const ignoreNextClick = useRef<boolean>(false);
    const router = useRouter();

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
    
        setOpenDialog(true);
    };

    useEffect(() => {
        if (!openDialog) {
            // Prevent reopening immediately after closing
            ignoreNextClick.current = true;
            setTimeout(() => {
                ignoreNextClick.current = false;
            }, 200);
        }
    }, [openDialog]);

    
    return (
        <div className="h-fit w-full flex flex-col items-start gap-5 p-3 rounded-lg border border-muted cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary">
            {/* Profile Section */}
            <div className="w-full flex items-start justify-between" onClick={handleClickDialog}>
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
                <Button className="text-sm" variant='secondary' onClick={() => router.push('/feed/123')}>
                    View
                    <LucideCircleArrowRight/>
                </Button>
            </div>
            <UserDialog open={openDialog} setOpen={setOpenDialog}/>
        </div>   
    );
}