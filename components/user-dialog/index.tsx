import { LucideClock, LucideGraduationCap, LucideMapPin, LucideUniversity, LucideUser } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { TypographyMuted } from "../utils/typography/typography-muted"
import { TypographyP } from "../utils/typography/typography-p"
import Tag from "../utils/tag"
import { Avatar, AvatarFallback } from "../ui/avatar"
import Label from "../utils/label"
import { TypographyH4 } from "../utils/typography/typography-h4"
import { TypographySmall } from "../utils/typography/typography-small"
import { Button } from "../ui/button"

export default function UserDialog({open, setOpen}: { open: boolean,  setOpen: (open: boolean) => void}) {

    const userStatus = [
        { label: 'Profile Completion', value: '90%' },
        { label: 'Accomplishment', value: '20+' },
        { label: 'Likes', value: '35' }
    ]

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            console.log("Dialog close triggered:", isOpen); // Debugging
            setOpen(isOpen);
        }}
        >
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-stretch justify-start gap-3">
                            <Avatar className="!size-36">
                                <AvatarFallback>BN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-5 font-normal">
                                <div>
                                    <TypographyH4>Hem Rithybondeth</TypographyH4>
                                    <TypographyMuted>Software Developer</TypographyMuted>
                                </div>
                                <div className="space-y-2">
                                    <Label text="Phnom Penh, Cambodia" icon={<LucideMapPin className="!size-5"/>}/>
                                    <Label text="5+ years experinces" icon={<LucideUser className="!size-5"/>}/>
                                    <Label text="Available for full time" icon={<LucideClock className="!size-5"/>}/>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col items-start gap-5 text-primary !mt-5">
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Education</TypographyP>
                                <div className="flex flex-col items-start gap-2">
                                    <Label text="Cambodia Academic Digital and Technology" icon={<LucideUniversity className="!size-5"/>}/>
                                    <Label text="Computer Science" icon={<LucideGraduationCap className="!size-5"/>}/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Skills</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item}>
                                            <Tag label="Backend Development"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-start gap-3">
                                <TypographyP className="font-medium">Status</TypographyP>
                                <div className="w-full flex items-stretch gap-3">
                                    {userStatus.map((item, index) => (
                                        <Button 
                                            key={index} variant={'secondary'} className="!h-fit w-full flex-1 flex flex-col items-center justify-center p-3">
                                            <TypographyP>{item.value}</TypographyP>
                                            <TypographySmall className="text-xs">{item.label}</TypographySmall>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}