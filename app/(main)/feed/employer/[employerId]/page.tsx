import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import IconLabel from "@/components/utils/icon-label";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideBookmark, LucideBuilding, LucideCircleCheck, LucideHeartHandshake, LucideMapPin, LucideUsers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Carousel } from "@/components/ui/carousel";
import Divider from "@/components/utils/divider";

export default function EmployerDetailPage() {

    const positions = [
        { position: 'Software Engineer', shift: 'Full Time' },
        { position: 'QA Tester', shift: 'Intern' },
        { position: 'DevOps Engineer', shift: 'Part Time' },
        { position: 'UI/UX Designer', shift: 'Remote' },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Personal Information Section */}
            <div className="w-full flex items-stretch justify-between border border-muted py-5 px-10">
                <div className="flex items-start gap-5">
                    <Avatar className="size-32">
                        <AvatarFallback>BON</AvatarFallback>  
                    </Avatar>
                    <div className="h-full flex flex-col items-start justify-between">
                       <div className="flex flex-col items-start gap-1">
                            <TypographyH2>TechCorp Solutions</TypographyH2>
                            <TypographyMuted className="text-md">Software Development & IT Services</TypographyMuted>
                       </div>
                        <div className="flex items-center gap-3 [&>div>p]:text-primary [&>div>p]:font-medium">
                            <IconLabel icon={<LucideMapPin/>} text="San Francisco, CA"/>
                            <IconLabel icon={<LucideUsers/>} text="100+ Employees"/>
                            <IconLabel icon={<LucideBuilding/>} text="Founded in 2010"/>   
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" prefixIcon={<LucideBookmark/>}>Save to Favorite</Button>  
                    <Button prefixIcon={<LucideHeartHandshake/>}>Like</Button>
                </div>
            </div>
            <div className="w-full flex items-stretch gap-5">
                <div className="w-2/3 flex flex-col items-stretch gap-5">
                    <div className="w-full flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>About TechCorp Solutions</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-full w-2 bg-primary"/>
                            <TypographyMuted className="leading-loose">
                                TechCorp Solutions is a software development and IT services company that provides a wide range of services to its clients. 
                                We are a team of experienced professionals who are dedicated to providing the best possible services to our clients.
                            </TypographyMuted>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Company Culture</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="w-full flex justify-between items-start gap-3">
                            <div className="w-1/2 flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                                <TypographyP className="font-medium">Values</TypographyP>
                                <div className="flex flex-col gap-2">
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text="Innovation"/>
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text="Collaboration"/>
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text="Customer Satisfaction"/>
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                                <TypographyP className="font-medium">Benefits</TypographyP>
                                <div className="flex flex-col gap-2">
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text="Health Insurance"/>
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text="Dental Insurance"/>
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text="Vision Insurance"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Life at TechCorp Solutions</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="w-full">
                            <Carousel className="w-full">
                                <CarouselContent className="w-full">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <CarouselItem key={item} className="max-w-[280px]">
                                            <div 
                                                className="h-[180px] bg-muted rounded-md my-2 ml-2 bg-cover bg-center" 
                                                // style={{backgroundImage: `url(${item})`}}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="ml-3"/>
                                <CarouselNext className="mr-3"/>      
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col items-stretch gap-5">
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Company Information</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-col gap-3 [&>div>p]:text-primary [&>div>p]:font-medium [&>div>p]:text-md">
                            <IconLabel 
                                icon={<TypographyMuted>Industry</TypographyMuted>} 
                                text="Software Development & IT Services" 
                                className="flex-col items-start"
                            />
                            <IconLabel 
                                icon={<TypographyMuted>Phone</TypographyMuted>} 
                                text="+123 456 7890" className="flex-col items-start"
                            />
                            <IconLabel 
                                icon={<TypographyMuted>Email</TypographyMuted>} 
                                text="techcorp@gmail.com" className="flex-col items-start"
                            />
                             <IconLabel 
                                icon={<TypographyMuted>Website</TypographyMuted>} 
                                text="https://techcorp.com" className="flex-col items-start [&>p]:!text-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Open Positions</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                           {positions.map((item) => (
                            <div className="border border-muted px-5 py-3 rounded-md" key={item.position}>
                                <TypographyP className="font-medium">{item.position}</TypographyP>
                                <TypographyMuted className="text-sm">{item.shift}</TypographyMuted>
                            </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}