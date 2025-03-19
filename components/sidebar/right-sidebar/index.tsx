import { cn } from "@/lib/utils";
import { LucideChevronRight, LucideEdit, LucideSearch, LucideUserCheck, LucideUsers } from "lucide-react";
import { TypographyP } from "../../utils/typography/typography-p";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { TypographyMuted } from "../../utils/typography/typography-muted";
import Divider from "../../utils/divider";
import { Button } from "../../ui/button";

export default function RightSidebar({className}: {className?: string}) {
    return (
        <div className={cn('flex flex-col items-start gap-5', className)}>
            {/* Message Section */}
            <div className="w-full flex flex-col items-start gap-3 border border-l-muted p-5">
                <div className='w-full flex flex-col items-start gap-3'>
                    <div className="flex items-center justify-between w-full">
                        <TypographyP>Messages</TypographyP>
                        <LucideEdit/>
                    </div>
                    <Input prefix={<LucideSearch/>} placeholder="Search" className='rounded-3xl'/>
                </div>
                <Divider/>
                <div className="w-full flex flex-col items-start gap-3">
                    {[1,2,3].map((item)=> (
                        <div key={item} className="flex items-center gap-2 py-2 w-full cursor-pointer">
                            <Avatar>
                                <AvatarFallback>BN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-1">
                                <TypographyP className="!m-0 !text-sm">Rithy Bondeth</TypographyP>
                                <TypographyMuted className="text-xs">You: Hello, how are you? <span>10 Feb</span></TypographyMuted>
                            </div>
                        </div>
                    ))}
                    <div className="w-full flex items-center cursor-pointer">
                        <Button variant='secondary' className="w-full text-xs">
                            View all
                            <LucideChevronRight/>
                        </Button>    
                    </div>
                </div>
            </div>

            {/* Applied Employees Section */}
            <div className="w-full flex flex-col items-start gap-3 border border-l-muted p-5 rounded-lg">
                <div className="flex items-center justify-between w-full">
                    <TypographyP>Applied Employees</TypographyP>
                    <LucideUsers/>
                </div>
                <Divider/>
                <div className="w-full flex flex-col items-start gap-3">
                    {[1,2,3].map((item)=> (
                        <div key={item} className="flex items-center gap-2 py-2 w-full cursor-pointer">
                            <Avatar>
                                <AvatarFallback>BN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-1">
                                <TypographyP className="!m-0 !text-sm">Web Developer</TypographyP>
                                <TypographyMuted className="text-xs">Rithy Bondeth</TypographyMuted>
                            </div>
                        </div>
                    ))}
                    <div className="w-full flex items-center cursor-pointer">
                        <Button variant='secondary' className="w-full text-xs">
                            View all
                            <LucideChevronRight/>
                        </Button>    
                    </div>
                </div>
            </div>

            {/* Interested Employees Section */}
            <div className="w-full flex flex-col items-start gap-3 border border-l-muted p-5 rounded-lg">
                <div className="flex items-center justify-between w-full">
                    <TypographyP>Interested Employees</TypographyP>
                    <LucideUserCheck/>
                </div>
                <Divider/>
                <div className="w-full flex flex-col items-start gap-3">
                    {[1,2,3].map((item)=> (
                        <div key={item} className="flex items-center gap-2 py-2 w-full cursor-pointer">
                            <Avatar>
                                <AvatarFallback>BN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-1">
                                <TypographyP className="!m-0 !text-sm">Web Developer</TypographyP>
                                <TypographyMuted className="text-xs">Rithy Bondeth</TypographyMuted>
                            </div>
                        </div>
                    ))}
                    <div className="w-full flex items-center cursor-pointer">
                        <Button variant='secondary' className="w-full text-xs">
                            View all
                            <LucideChevronRight/>
                        </Button>    
                    </div>
                </div>
            </div>
        </div>
    )
}