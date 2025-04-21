import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import IconLabel from "@/components/utils/icon-label";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideAlarmClock, LucideBookmark, LucideBriefcaseBusiness, LucideCalendarDays, LucideCircleCheck, LucideHeartHandshake, LucideUser } from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Carousel } from "@/components/ui/carousel";
import Divider from "@/components/utils/divider";
import { companyList } from "@/data/company-data";
import BlurBackGroundOverlay from "@/components/utils/bur-background-overlay";
import { Button } from "@/components/ui/button";
import Tag from "@/components/utils/tag";
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function CompanyDetailPage() {
    const companyId = 1;
    
    return (
        <div className="flex flex-col gap-5">
            {/* Header Section */}
            <div 
                className="relative h-72 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center tablet-sm:items-start" 
                style={{ backgroundImage: "url(https://plus.unsplash.com/premium_photo-1661962642401-ebd5ae0514ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXBwbGUlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D)" }}
            >
                <BlurBackGroundOverlay/>
                <div className="relative flex items-center gap-5 tablet-sm:flex-col">
                    <Avatar className="size-32 tablet-sm:size-28" rounded="md">
                        <AvatarFallback>BON</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-2 text-muted tablet-sm:items-center">
                        <TypographyH2 className="tablet-sm:text-center tablet-sm:text-xl">TechCorps Solutions</TypographyH2>
                        <TypographyP className="!m-0 tablet-sm:text-center tablet-sm:text-sm">Technology & Software Development</TypographyP>
                    </div>
                </div>
                <div className="z-10 absolute right-3 bottom-3 flex items-center gap-3">
                    <Button variant="outline">
                        <LucideBookmark/>
                        Save to Favorite
                    </Button>  
                    <Button>
                        <LucideHeartHandshake/>
                        Like
                    </Button>
                </div>
            </div>
            <div className="w-full flex items-stretch gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
                <div className="w-2/3 flex flex-col items-stretch gap-5">
                    {/* Description Section */}
                    <div className="w-full flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>About {companyList[companyId].name}</TypographyH4>
                            <Divider/> 
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-full w-2 bg-primary"/>
                            <TypographyMuted className="leading-loose">{companyList[companyId].description}</TypographyMuted>
                        </div>
                    </div>
                    {/* Open Positions Section */}
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Open Positions</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                           {companyList[companyId].openPositions.map((item) => (
                            <div className="border border-muted px-5 py-3 rounded-md" key={item.id}>
                                <div className="flex flex-col items-start gap-5">
                                    <div className="w-full flex items-center justify-between tablet-md:flex-col tablet-md:gap-5 tablet-md:[&>div]:w-full">
                                        <div className="flex flex-col items-start gap-2">
                                            <div className="flex items-center gap-2">
                                                <LucideBriefcaseBusiness strokeWidth="1.5px"/>
                                                <TypographyP className="font-medium !m-0">{item.title}</TypographyP>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Tag icon={<LucideAlarmClock/>} label="Full Time"/>
                                                <Tag icon={<LucideUser/>} label="3+ years"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">
                                            <IconLabel icon={<LucideCalendarDays className="text-muted-foreground"/>} text={`PostedDate ${item.postedDate}`}/>
                                            <IconLabel icon={<LucideCalendarDays className="text-muted-foreground"/>} text={`Deadline ${item.deadlineDate}`}/>
                                        </div>
                                    </div>
                                    <Divider/>
                                    <div className="flex flex-col items-start gap-3">
                                        <div className="flex flex-col items-start gap-2">  
                                            <TypographySmall className="font-medium">Description</TypographySmall>
                                            <TypographyMuted>{item.description}</TypographyMuted>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">  
                                            <TypographySmall className="font-medium">Education</TypographySmall>
                                            <TypographyMuted>{item.education}</TypographyMuted>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">  
                                            <TypographySmall className="font-medium">Skills</TypographySmall>
                                            <div className="flex flex-wrap gap-3">{item.skills.map((skill) => (
                                                <Tag key={skill} label={skill}/>
                                            ))}</div>
                                        </div>
                                        {item.salary && <div className="flex flex-col items-start gap-2">  
                                            <TypographySmall className="font-medium">Salary</TypographySmall>
                                            <TypographyMuted>{item.salary}</TypographyMuted>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                           ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Life at {companyList[companyId].name}</TypographyH4>
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
                                text={companyList[companyId].industry} 
                                className="flex-col items-start"
                            />
                            <IconLabel 
                                icon={<TypographyMuted>Phone</TypographyMuted>} 
                                text={companyList[companyId].phone} className="flex-col items-start"
                            />
                            <IconLabel 
                                icon={<TypographyMuted>Email</TypographyMuted>} 
                                text={companyList[companyId].email} className="flex-col items-start"
                            />
                             <IconLabel 
                                icon={<TypographyMuted>Website</TypographyMuted>} 
                                text={companyList[companyId].website} className="flex-col items-start [&>p]:!text-blue-500"
                            />
                        </div>
                    </div>
                    {/* Culture and Benefit Section */}
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Company Culture</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="w-full flex flex-col items-stretch [&>div]:w-full">
                            <div className="flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                                <TypographyP className="font-medium">Values</TypographyP>
                                <div className="flex flex-col gap-2">
                                    {companyList[companyId].values.map((item: any, index) => (
                                        <IconLabel key={index} icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text={item.label}/>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                                <TypographyP className="font-medium">Benefits</TypographyP>
                                <div className="flex flex-col gap-2">
                                    {companyList[companyId].benefits.map((item: any, index) => (
                                        <IconLabel key={index} icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text={item.label}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}