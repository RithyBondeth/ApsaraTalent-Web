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
                                <AvatarFallback>
                                    <LucideBuilding/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-5 font-normal">
                                <div>
                                    <TypographyH4>TechCorp Solutions</TypographyH4>
                                    <TypographyMuted>Software Development & IT Services</TypographyMuted>
                                </div>
                                <div className="space-y-2">
                                    <IconLabel icon={<LucideMapPin/>} text="San Francisco, CA"/> 
                                    <IconLabel icon={<LucideUsers/>} text="100+ Employees"/>
                                    <IconLabel icon={<LucideBuilding/>} text="Founded in 2010"/>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col items-start gap-5 text-primary !mt-5">
                            <div className="space-y-2">
                                <TypographyP className="font-medium">About TechCorp Solutions</TypographyP>
                                <TypographyMuted className="leading-loose">TechCorp Solutions is a software development and IT services company that provides a wide range of services to its clients. 
                                    We are a team of experienced professionals who are dedicated to providing the best possible services to our clients.
                                </TypographyMuted>
                            </div>
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Benefits</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {["Health Insurance", "Dental Insurance", "Vision Insurance", "401(k)", "Paid Time Off"].map((benefit) => (
                                        <div key={benefit} className="px-3 py-2 rounded-2xl bg-muted">
                                            <IconLabel icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text={benefit}/>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                            <div className="space-y-2">
                                <TypographyP className="font-medium">Values</TypographyP>
                                <div className="flex flex-wrap gap-2">
                                    {["Innovation", "Collaboration", "Integrity", "Customer Satisfaction", "Teamwork"].map((benefit) => (
                                        <div key={benefit} className="px-3 py-2 rounded-2xl bg-muted">
                                            <IconLabel icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text={benefit}/>
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