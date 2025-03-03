import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BlurBackGroundOverlay from "@/components/utils/bur-background-overlay";
import Divider from "@/components/utils/divider";
import IconLabel from "@/components/utils/icon-label";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideCalendar, LucideCircleCheck, LucideEdit, LucideLink, LucideMapPin, LucideUsers } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-5">
            <div className="relative h-72 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url(https://plus.unsplash.com/premium_photo-1661962642401-ebd5ae0514ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXBwbGUlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D)" }}>
                <BlurBackGroundOverlay/>
                <div className="relative z-10 flex items-center gap-5">
                    <Avatar className="size-32" rounded="md">
                        <AvatarFallback>BON</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-2 text-muted">
                        <TypographyH2>TechCorps Solutions</TypographyH2>
                        <TypographyP className="!m-0">Technology & Software Development</TypographyP>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-start gap-5">
                <div className="w-1/4 flex flex-col gap-5 border border-muted p-5 rounded-md">
                    <div className="flex flex-col items-center gap-3">
                        <TypographyMuted>Compnay Status</TypographyMuted>
                        <IconLabel 
                            text="Active" 
                            className="w-fit py-2 px-3 rounded-2xl [&>p]:text-xs [&>p]:text-green-600 bg-green-50" 
                            icon={<LucideCircleCheck className="text-green-600"/>} 
                        />
                    </div>
                    <Divider/>
                    <div className="flex flex-col gap-5">
                        <IconLabel icon={<LucideMapPin/>} text="Phnom Penh, Cambodia"/>
                        <IconLabel icon={<LucideUsers/>} text="100+ Employees"/>
                        <IconLabel icon={<LucideCalendar/>} text="Founded in 2010"/>
                        <IconLabel icon={<LucideLink/>} text="www.techcorps.com" className="[&>p]:text-blue-500 cursor-pointer"/>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5 w-3/4">
                    <div className="w-full flex flex-col items-start gap-5 border border-muted p-5 rounded-md">
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex items-center justify-between w-full">
                                <TypographyH3>Company Information</TypographyH3>
                                <LucideEdit className="text-blue-500 cursor-pointer" />
                            </div>
                            <Divider/>
                        </div>
                        <div className="w-full flex justify-start items-start gap-40">
                            <div className="flex flex-col items-start gap-5">
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Company Name</TypographyMuted>
                                    <TypographyP className="!m-0 text-sm">TechCorps Solutions</TypographyP>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Company Name</TypographyMuted>
                                    <TypographyP className="!m-0 text-sm">TechCorps Solutions</TypographyP>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Company Name</TypographyMuted>
                                    <TypographyP className="!m-0 text-sm">TechCorps Solutions</TypographyP>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-5">
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Company Name</TypographyMuted>
                                    <TypographyP className="!m-0 text-sm">TechCorps Solutions</TypographyP>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Company Name</TypographyMuted>
                                    <TypographyP className="!m-0 text-sm">TechCorps Solutions</TypographyP>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Company Name</TypographyMuted>
                                    <TypographyP className="!m-0 text-sm">TechCorps Solutions</TypographyP>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start gap-5 border border-muted p-5 rounded-md">
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex items-center justify-between w-full">
                                <TypographyH3>About Company</TypographyH3>
                                <LucideEdit className="text-blue-500 cursor-pointer" />
                            </div>
                            <Divider/>
                        </div>
                        <TypographyP className="!m-0 text-sm !leading-loose">
                            TechCorps Solutions is a technology and software development company that provides solutions to businesses. 
                            TechCorps Solutions is a technology and software development company that provides solutions to businesses.
                        </TypographyP>
                    </div>
                    <div className="w-full flex flex-col items-start gap-5 border border-muted p-5 rounded-md">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH3>Security Settings</TypographyH3>
                            <Divider/>
                        </div>
                        <div className="w-full flex flex-col items-start gap-5">
                            <div className="w-full flex items-center justify-between bg-muted p-5 rounded-md">
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyP className="!m-0 font-medium">Email Address</TypographyP>
                                    <TypographyMuted>techcorps@gmail.com</TypographyMuted>
                                </div>
                                <TypographyP className="text-blue-500 text-sm font-medium cursor-pointer !m-0">Change Email</TypographyP>
                            </div>
                            <div className="w-full flex items-center justify-between bg-muted p-5 rounded-md">
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyP className="!m-0 font-medium">Password</TypographyP>
                                    <TypographyMuted>Last updated 2 days ago</TypographyMuted>
                                </div>
                                <TypographyP className="text-blue-500 text-sm font-medium cursor-pointer !m-0">Change Password</TypographyP>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}