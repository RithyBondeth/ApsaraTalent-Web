import { LucideBuilding, LucideCircleCheck, LucideMapPin, LucideUsers } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { TypographyH4 } from "../utils/typography/typography-h4";
import { TypographyMuted } from "../utils/typography/typography-muted";
import { ICompanyDialogProps } from "./props";
import IconLabel from "../utils/icon-label";
import { TypographyP } from "../utils/typography/typography-p";
import { Button } from "../ui/button";
import Link from "next/link";
export default function CompanyDialog(props: ICompanyDialogProps) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-stretch justify-start gap-3">
                            <Avatar className="!size-36">
                                <AvatarFallback>{props.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-5 font-normal">
                                <div>
                                    <TypographyH4>{props.name}</TypographyH4>
                                    <TypographyMuted>{props.description}</TypographyMuted>
                                </div>
                                <div className="space-y-2">
                                    <IconLabel icon={<LucideMapPin/>} text={props.location}/> 
                                    <IconLabel icon={<LucideUsers/>} text={`${props.companySize}+ Employees`}/>
                                    <IconLabel icon={<LucideBuilding/>} text={`Founded in ${props.foundedYear}`}/>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col items-start gap-5 text-primary !mt-5">
                            <div className="space-y-2">
                                <TypographyP className="font-medium">About {props.name}</TypographyP>
                                <TypographyMuted className="leading-loose">{props.description}</TypographyMuted>
                            </div>
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Benefits</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {props.benefits.map((benefit) => (
                                        <div key={benefit.id} className="px-3 py-2 rounded-2xl bg-muted">
                                            <IconLabel icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text={benefit.label}/>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Values</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {props.values.map((value) => (
                                        <div key={value.id} className="px-3 py-2 rounded-2xl bg-muted">
                                            <IconLabel icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text={value.label}/>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                               <Link href={`/feed/employer/1`}>
                                    <Button>View Company</Button>
                               </Link>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}