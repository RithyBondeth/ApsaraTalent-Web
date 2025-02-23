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

interface IUserDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    avatar: string;
    name: string;
    job: string;
    location: string;
    experience: string;
    availability: string;
    skills: string[];
    educations: { school: string, degree: string }[];
    status: { label: string, value: string }[];
}

export default function UserDialog(props: IUserDialogProps) {
    return (
        <Dialog open={props.open} onOpenChange={(isOpen) => props.setOpen(isOpen)}>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-stretch justify-start gap-3">
                            <Avatar className="!size-36">
                                <AvatarFallback>{props.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-5 font-normal">
                                <div>
                                    <TypographyH4>{props.name}</TypographyH4>
                                    <TypographyMuted>{props.job}</TypographyMuted>
                                </div>
                                <div className="space-y-2">
                                    <Label text={props.location} icon={<LucideMapPin className="!size-5"/>}/>
                                    <Label text={props.experience} icon={<LucideUser className="!size-5"/>}/>
                                    <Label text={props.availability} icon={<LucideClock className="!size-5"/>}/>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col items-start gap-5 text-primary !mt-5">
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Education</TypographyP>
                                <div className="flex flex-col items-start gap-5">
                                    {props.educations.map((education) => (
                                        <div key={education.school} className="flex flex-col items-start gap-2">
                                            <Label text={education.school} icon={<LucideUniversity className="!size-5"/>}/>
                                            <Label text={education.degree} icon={<LucideGraduationCap className="!size-5"/>}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Skills</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {props.skills.map((skill) => (
                                        <div key={skill}>
                                            <Tag label={skill}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-start gap-3">
                                <TypographyP className="font-medium">Status</TypographyP>
                                <div className="w-full flex items-stretch gap-3">
                                    {props.status.map((item, index) => (
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