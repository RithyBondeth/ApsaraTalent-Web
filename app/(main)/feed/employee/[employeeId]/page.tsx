import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import IconLabel from "@/components/utils/icon-label";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideAtSign, LucideBookmark, LucideCalendar, LucideDownload, LucideEye, LucideFileText, LucideGraduationCap, LucideHeartHandshake, LucideMail, LucideMapPin, LucidePhone, LucideSchool, LucideUser } from "lucide-react";
import Divider from "@/components/utils/divider";
import { IEducation, IExperience, ISkill, ISocial } from "@/utils/interfaces/user-interface/employee.interface";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import Link from "next/link";
import { userList } from "@/data/user-data";

export default function EmployeeDetailPage() {
    const userId = 1;
    const employee = userList.filter((user) => user.role === "employee");
    const employeeList = employee[userId].employee;    

    return (
        <div className="flex flex-col gap-5">
            {/* Personal Information Section */}
            <div className="w-full flex items-stretch justify-between border border-muted py-5 px-10 tablet-xl:flex-col tablet-xl:[&>div]:w-full tablet-xl:gap-5">
                <div className="flex flex-col items-center gap-5">
                    <Avatar className="size-40 tablet-xl:!size-52">
                        <AvatarFallback>
                            { !employeeList?.avatar 
                            ? employeeList?.firstname.slice(0, 2) 
                            : employeeList?.avatar}
                        </AvatarFallback>  
                    </Avatar>
                    <div className="flex flex-col items-center gap-1">
                        <TypographyH4>{employeeList?.firstname} {employeeList?.lastname}</TypographyH4>
                        <TypographyMuted>{employeeList?.job}</TypographyMuted>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Firstname</TypographyMuted>
                        <IconLabel icon={<LucideUser/>} text={employeeList!.firstname}/>          
                    </div>
                   <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Lastname</TypographyMuted>
                        <IconLabel icon={<LucideUser/>} text={employeeList!.lastname} />        
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Username</TypographyMuted>
                        <IconLabel icon={<LucideAtSign/>} text={employeeList!.username} />        
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Email</TypographyMuted>
                        <IconLabel icon={<LucideMail/>} text={employeeList!.email} />            
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Phone</TypographyMuted>
                        <IconLabel icon={<LucidePhone/>} text={employeeList!.phone} />   
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Address</TypographyMuted>
                        <IconLabel icon={<LucideMapPin/>} text={employeeList!.location} />
                    </div>
                </div>
            </div>

            {/* Education, Skill and Experience Section */}     
            <div className="flex items-stretch gap-5 tablet-xl:flex-col tablet-xl:[&>div]:w-full">
                <div className="w-2/3 flex flex-col gap-5">
                    {/* Education Section */}
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Education</TypographyH4>
                            <Divider/>
                        </div>  
                        {employeeList?.educations.map((item: IEducation) => (
                           <div className="flex flex-col gap-2 border-l-4 border-primary pl-4" key={item.id}>
                                <IconLabel icon={<LucideSchool/>} text={item.school}/>      
                                <IconLabel icon={<LucideGraduationCap/>} text={item.degree}/>
                                <IconLabel icon={<LucideCalendar/>} text={item.year}/>
                            </div>
                        ))}
                    </div>

                    {/* Experience Section */}
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Experience</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-col gap-5">
                            {employeeList?.experiences.map((item: IExperience) => (
                               <div className="border-l-4 border-primary pl-4 space-y-2" key={item.id}>  
                                    <div className="flex flex-col gap-1">
                                        <TypographyP>{item.title}</TypographyP>
                                        <TypographyMuted>{item.startDate} - {item.endDate}</TypographyMuted>
                                    </div>
                                    <TypographyMuted className="text-primary">{item.description}</TypographyMuted>
                                </div>
                            ))}
                           
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Skills</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-wrap gap-3">
                                {employeeList?.skills.map((item: ISkill) => <Tag key={item.id} label={item.name} />)}
                        </div>
                    </div>
                </div>

                {/* Resume and Contact Section */}
                <div className="w-1/3 flex flex-col gap-5">
                    {/* Resume Section */}
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Resume</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                            <div className="flex items-center text-muted-foreground gap-1">
                                <LucideFileText/>
                                <TypographyMuted>{employeeList?.resume}</TypographyMuted>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon">
                                    <LucideEye/>
                                </Button>
                                <Button variant="outline" size="icon">
                                <LucideDownload/>
                            </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                            <div className="flex items-center text-muted-foreground gap-1">
                                <LucideFileText/>
                                <TypographyMuted>{employeeList?.coverLetter}</TypographyMuted>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon">
                                    <LucideEye/>
                                </Button>
                                <Button variant="outline" size="icon">
                                <LucideDownload/>
                            </Button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Contact</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-col gap-5">
                            {employeeList?.socials.map((item: ISocial) => (         
                                <div key={item.id} className="flex items-center gap-2">
                                <TypographySmall className="font-medium">{item.platform}:</TypographySmall>
                                <Link href={item.url} className="px-3 bg-blue-100 text-blue-600 rounded-2xl hover:underline">
                                  <TypographySmall>{item.url}</TypographySmall>
                                </Link>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex items-center gap-2">
                <Button variant={'outline'}>
                    <LucideBookmark/>
                    Save to favorite
                </Button>
                <Button>
                    <LucideHeartHandshake/>
                    Like
                </Button>
            </div>
        </div>
    )
}