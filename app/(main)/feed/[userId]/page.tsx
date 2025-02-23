import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Label from "@/components/utils/label";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideAtSign, LucideMail, LucideMapPin, LucidePhone, LucideUser } from "lucide-react";

export default function UserDetailPage() {
    return (
        <div>
            <div className="w-full flex items-stretch justify-between border border-muted py-5 px-10">
                <div className="flex flex-col items-center gap-5">
                    <Avatar className="size-40">
                        <AvatarFallback>BN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-1">
                        <TypographyH4>Hem RithyBondeth</TypographyH4>
                        <TypographyMuted>Software Engineer</TypographyMuted>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Firstname</TypographyMuted>
                        <Label icon={<LucideUser className="!size-5"/>} text="Hem"/>        
                    </div>
                   <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Lastname</TypographyMuted>
                        <Label icon={<LucideUser className="!size-5"/>} text="RithyBondeth" />        
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Username</TypographyMuted>
                        <Label icon={<LucideAtSign className="!size-5"/>} text="_benx123_" />        
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Email</TypographyMuted>
                        <Label icon={<LucideMail className="!size-5"/>} text="rithybondeth@gmail.com" />        
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Phone</TypographyMuted>
                        <Label icon={<LucidePhone className="!size-5"/>} text="085872582" />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Address</TypographyMuted>
                        <Label icon={<LucideMapPin className="!size-5"/>} text="Phnom Penh, Cambodia" />
                    </div>
                </div>
            </div>
        </div>
    )
}