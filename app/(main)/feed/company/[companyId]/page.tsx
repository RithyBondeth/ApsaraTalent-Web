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
import { companyList } from "@/data/company-data";
import { ILabelItem } from "@/utils/interfaces/company.interface";

export default function CompanyDetailPage() {
    const companyId = 1;

    return (
        <div className="flex flex-col gap-5">
            {/* Personal Information Section */}
            <div className="w-full flex items-stretch justify-between border border-muted py-5 px-10">
                <div className="flex items-start gap-5">
                    <Avatar className="size-32">
                        <AvatarFallback>{companyList[companyId].avatar}</AvatarFallback>  
                    </Avatar>
                    <div className="h-full flex flex-col items-start justify-between">
                       <div className="flex flex-col items-start gap-1">
                            <TypographyH2>{companyList[companyId].name}</TypographyH2>
                            <TypographyMuted className="text-md">{companyList[companyId].industry}</TypographyMuted>
                       </div>
                        <div className="flex items-center gap-3 [&>div>p]:text-primary [&>div>p]:font-medium">
                            <IconLabel icon={<LucideMapPin/>} text={companyList[companyId].location}/>
                            <IconLabel icon={<LucideUsers/>} text={`${companyList[companyId].companySize}+ Employees`}/>
                            <IconLabel icon={<LucideBuilding/>} text={`Founded in ${companyList[companyId].foundedYear}`}/>   
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
                            <TypographyH4>About {companyList[companyId].name}</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-full w-2 bg-primary"/>
                            <TypographyMuted className="leading-loose">{companyList[companyId].description}</TypographyMuted>
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
                                    {companyList[companyId].values.map((item: ILabelItem) => (
                                        <IconLabel key={item.id} icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text={item.label}/>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-3 border border-muted px-5 py-3 rounded-md">
                                <TypographyP className="font-medium">Benefits</TypographyP>
                                <div className="flex flex-col gap-2">
                                    {companyList[companyId].benefits.map((item: ILabelItem) => (
                                        <IconLabel key={item.id} icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text={item.label}/>
                                    ))}
                                </div>
                            </div>
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
                    <div className="flex flex-col items-start gap-3 border border-muted py-5 px-10">
                        <div className="w-full flex flex-col gap-2">
                            <TypographyH4>Open Positions</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                           {companyList[companyId].openPositions.map((item) => (
                            <div className="border border-muted px-5 py-3 rounded-md" key={item.id}>
                                <TypographyP className="font-medium">{item.title}</TypographyP>
                                <TypographyMuted className="text-sm">{item.type}</TypographyMuted>
                            </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}