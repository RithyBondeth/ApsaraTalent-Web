import { LucideClock, LucideGraduationCap, LucideMapPin, LucideUniversity, LucideUser } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog"
import { TypographyMuted } from "../../utils/typography/typography-muted"
import { TypographyP } from "../../utils/typography/typography-p"
import Tag from "../../utils/tag"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import IconLabel from "../../utils/icon-label"
import { TypographyH4 } from "../../utils/typography/typography-h4"
import { TypographySmall } from "../../utils/typography/typography-small"
import { Button } from "../../ui/button"
import { IEmployeeDialogProps } from "./props"
import Link from "next/link"

export default function EmployeeDialog(props: IEmployeeDialogProps) {
    return (
        <Dialog open={props.open} onOpenChange={(isOpen) => props.setOpen(isOpen)}>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-stretch justify-start gap-3 tablet-sm:flex-col">
                            <Avatar className="!size-36">
                                <AvatarImage src={props.avatar!}/>
                                <AvatarFallback className="uppercase">{!props.avatar ? <LucideUser/> : props.avatar.slice(0, 3)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-5 font-normal">
                                <div className="flex flex-col items-start">
                                    <TypographyH4>{props.firstname} {props.lastname}</TypographyH4>
                                    <TypographyMuted>{props.job}</TypographyMuted>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <IconLabel icon={<LucideMapPin/>} text={props.location}/> 
                                    <IconLabel icon={<LucideUser/>} text={props.yearsOfExperience}/>
                                    <IconLabel icon={<LucideClock/>} text={props.availability}/>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col items-start gap-5 text-primary !mt-5">
                            <div className="flex flex-col items-start gap-2 tablet-sm:hidden">
                                <TypographyP className="font-medium">Education</TypographyP>
                                <div className="flex flex-col items-start gap-5">
                                    {props.educations.map((education) => (
                                        <div key={education.school} className="flex flex-col items-start gap-2">
                                            <IconLabel icon={<LucideUniversity/>} text={education.school}/>
                                            <IconLabel icon={<LucideGraduationCap/>} text={education.degree}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-2 tablet-sm:hidden">
                                <TypographyP className="font-medium">Skills</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {props.skills.map((skill) => (
                                        <div key={skill.id}>
                                            <Tag label={skill.name}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-start gap-3 tablet-sm:hidden">
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
                            <div className="w-full flex justify-end">
                               <Link href={`/feed/employee/${props.id}`}>
                                    <Button>View Employee</Button>
                               </Link>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}