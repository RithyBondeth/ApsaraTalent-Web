import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Label from "@/components/utils/label";
import Tag from "@/components/utils/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideAtSign, LucideCalendar, LucideDownload, LucideEye, LucideGraduationCap, LucideMail, LucideMapPin, LucidePhone, LucideSchool, LucideUser } from "lucide-react";
import facebookIcon from '@/assets/socials/facebook.png';
import linkedInIcon from '@/assets/socials/linkedin.png';
import githubIcon from '@/assets/socials/github.png';
import emailIcon from '@/assets/socials/email.png';
import browserIcon from '@/assets/socials/browser.png';
import Image from "next/image";
import Divider from "@/components/utils/divider";

export default function UserDetailPage() {
    const connectList = [
        { id: 1, label: 'Benx', icon: facebookIcon, link: '' },
        { id: 2, label: 'Rithy Bondeth', icon: linkedInIcon, link: '' },
        { id: 3, label: 'Rithy Bondeth', icon: githubIcon, link: '' },
        { id: 4, label: 'rithybondeth@gmail.com', icon: emailIcon, link: '' },
        { id: 5, label: 'codehub.dev', icon: browserIcon, link: '' },
    ]

    return (
        <div className="flex flex-col gap-5">
            <div className="w-full flex items-stretch justify-between border border-muted py-5 px-10">
                <div className="flex flex-col items-center gap-5">
                    <Avatar className="size-40">
                        <AvatarFallback>BN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-1">
                        <TypographyH4>Hem RithyBondeth</TypographyH4>
                        <TypographyMuted>Software Engineer</TypographyMuted>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Firstname</TypographyMuted>
                        <Label icon={<LucideUser className="!size-5"/>} text="Hem"/>        
                    </div>
                   <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Lastname</TypographyMuted>
                        <Label icon={<LucideUser className="!size-5"/>} text="RithyBondeth" />        
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Username</TypographyMuted>
                        <Label icon={<LucideAtSign className="!size-5"/>} text="_benx123_" />        
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Email</TypographyMuted>
                        <Label icon={<LucideMail className="!size-5"/>} text="rithybondeth@gmail.com" />        
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Phone</TypographyMuted>
                        <Label icon={<LucidePhone className="!size-5"/>} text="085872582" />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <TypographyMuted>Address</TypographyMuted>
                        <Label icon={<LucideMapPin className="!size-5"/>} text="Phnom Penh, Cambodia" />
                    </div>
                </div>
            </div>
            <div className="flex items-stretch gap-5">
                <div className="w-2/3 flex flex-col gap-5">
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Education</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-col gap-2 border-l-4 border-primary pl-4">
                            <Label icon={<LucideSchool className="!size-5"/>} text="Cambodia Academic Digital and Technology (CADT)"/>
                            <Label icon={<LucideGraduationCap className="!size-5"/>} text="Bachelor Degree of Computer Science"/>
                            <Label icon={<LucideCalendar className="!size-5"/>} text="2020 - 2024"/>
                        </div>
                        <div className="flex flex-col gap-2 border-l-4 border-primary pl-4">
                            <Label icon={<LucideSchool className="!size-5"/>} text="Royal University of Phnom Penh (RUPP)"/>
                            <Label icon={<LucideGraduationCap className="!size-5"/>} text="Bachelor Degree of English"/>
                            <Label icon={<LucideCalendar className="!size-5"/>} text="2020 - 2024"/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Experience</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-col gap-5">
                           <div className="border-l-4 border-primary pl-4 space-y-2"> 
                                <div className="flex flex-col gap-1">
                                    <TypographyP>Software Engineer at Google Inc.</TypographyP>
                                    <TypographyMuted>2020 - 2024</TypographyMuted>
                                </div>
                                <TypographyMuted className="text-primary">Team Lead of Dart and Flutter framework.</TypographyMuted>
                           </div>
                           <div className="border-l-4 border-primary pl-4 space-y-2"> 
                                <div className="flex flex-col gap-1">
                                    <TypographyP>Software Engineer at Google Inc.</TypographyP>
                                    <TypographyMuted>2020 - 2024</TypographyMuted>
                                </div>
                                <TypographyMuted className="text-primary">Team Lead of Dart and Flutter framework.</TypographyMuted>
                           </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Skills</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => <Tag key={item} label="Mobile Development" />)}
                        </div>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col gap-5">
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Resume</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                            <TypographyMuted>Bondeth-Resume.pdf</TypographyMuted>
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
                            <TypographyMuted>Bondeth-coverletter.pdf</TypographyMuted>
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
                    <div className="flex flex-col gap-5 border border-muted p-5">
                        <div className="flex flex-col gap-2">
                            <TypographyH4>Contact</TypographyH4>
                            <Divider/>
                        </div>
                        <div className="flex flex-col gap-5">
                            {connectList.map((item) => (
                                <div className="flex items-center gap-2 cursor-pointer" key={item.id}>
                                    <Image src={item.icon} alt={item.label} height={undefined} width={25} className="rounded-full"/>
                                    <TypographyP className="!m-0 text-sm">{item.label}</TypographyP>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}