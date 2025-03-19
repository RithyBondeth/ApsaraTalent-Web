"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import BlurBackGroundOverlay from "@/components/utils/bur-background-overlay";
import Divider from "@/components/utils/divider";
import IconLabel from "@/components/utils/icon-label";
import LabelInput from "@/components/utils/label-input";
import Tag from "@/components/utils/tag";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { locationConstant, platformConstant } from "@/utils/constant";
import { TLocations } from "@/utils/types/location.type";
import { TPlatform } from "@/utils/types/platform.type";
import { Select } from "@radix-ui/react-select";
import { LucideBuilding, LucideCircleCheck, LucideEye, LucideEyeClosed, LucideLink2, LucideLock, LucideMail, LucidePhone, LucidePlus, LucideUsers } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const [isShowPassword, setIsShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [selectedLocation, setSelectedLocation] = useState<TLocations | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedPlatform, setSelectedPlatform] = useState<TPlatform | null>(null); 

    return (
        <div className="flex flex-col gap-5">
            <div 
                className="relative h-72 w-full flex items-end p-5 bg-center bg-cover bg-no-repeat tablet-sm:justify-center" 
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
            </div>
             <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
                <div className="w-[60%] flex flex-col gap-5">

                    {/* Company Information Form Section */}
                    <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
                        <div className="flex flex-col gap-1">
                            <TypographyH4>Company Information</TypographyH4>
                            <Divider/>
                        </div>
                        <form action="" className="flex flex-col items-start gap-5">
                            <LabelInput 
                                label="Company Name" 
                                input={<Input placeholder="Company Name" id="company-name" name="company-name"/>} 
                            />
                            <div className="w-full flex flex-col items-start gap-2">
                                <TypographyMuted className="text-xs">Company Description</TypographyMuted>
                                <Textarea placeholder="Company Description" id="company-description" name="company-description"/>
                            </div>
                            <LabelInput 
                                label="Username" 
                                input={<Input placeholder="Username" id="username" name="username"/>} 
                            />
                            <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                                <LabelInput 
                                    label="Industry" 
                                    input={<Input placeholder="Industry" id="industry" name="industry"/>} 
                                />
                                <div className="flex flex-col items-start gap-1">
                                    <TypographyMuted className="text-xs">Locations</TypographyMuted>
                                    <Select onValueChange={(value: TLocations) => setSelectedLocation(value)} value={selectedLocation || ''}>
                                        <SelectTrigger className="h-12 text-muted-foreground">
                                        <SelectValue placeholder="Location" />
                                        </SelectTrigger>    
                                        <SelectContent>
                                            {locationConstant.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
                                <LabelInput
                                    label="Company Size"
                                    input={<Input type="number" placeholder="Company Size" id="company-size" name="company-size" prefix={<LucideUsers/>}/>}
                                />
                                <LabelInput 
                                    label="Founded Year"
                                    input={<Input type="number" placeholder="Founded Year" id="company-founded-year" name="company-founded-year" prefix={<LucideBuilding/>}/>}
                                />
                            </div>
                            <LabelInput
                                label="Email"
                                input={<Input placeholder="Email" id="email" name="email" prefix={<LucideMail/>}/>}
                            />
                            <LabelInput 
                                label="Phone Number"
                                input={<Input placeholder="Phone Number" id="phone" name="phone" prefix={<LucidePhone/>}/>}
                            />
                        </form>
                    </div>

                    {/* OpenPosition Information Form Section */}
                    <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <TypographyH4>Open Position Information</TypographyH4>
                                <IconLabel 
                                    text="Add Open Position" 
                                    icon={<LucidePlus className="text-muted-foreground"/>}
                                    className="cursor-pointer"
                                />
                            </div>
                            <Divider/>
                        </div>
                        <form action="" className="flex flex-col items-start gap-5">
                            <div className="w-full flex flex-col items-start gap-3">
                                <TypographyMuted>Position 1</TypographyMuted>
                                <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                                    <LabelInput 
                                        label="Title"
                                        input={<Input placeholder="Title" id="title" name="title"/>}
                                    />
                                    <div className="w-full flex flex-col items-start gap-2">
                                        <TypographyMuted className="text-xs">Description</TypographyMuted>
                                        <Textarea placeholder="Description" id="description" name="description"/>
                                    </div>
                                    <LabelInput 
                                        label="Experience Requirement"
                                        input={<Input placeholder="Experience Requirement" id="experience-requirement" name="experience-requirement"/>}
                                    />
                                     <LabelInput 
                                        label="Education Requirement"
                                        input={<Input placeholder="Education Requirement" id="education-requirement" name="education-requirement"/>}
                                    />
                                    <LabelInput 
                                        label="Skill Requirement"
                                        input={<Input placeholder="Skill Requirement" id="skill-requirement" name="skill-requirement"/>}
                                    />
                                    <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                                        <div className="w-1/2 flex flex-col items-start gap-1">
                                            <TypographyMuted className="text-xs">Announce Date</TypographyMuted>
                                            <DatePicker 
                                                placeholder="Announce Date"
                                                date={selectedDate}
                                                onDateChange={setSelectedDate}
                                            />
                                        </div>
                                        <div className="w-1/2 flex flex-col items-start gap-1">
                                            <TypographyMuted className="text-xs">Deadline Date</TypographyMuted>
                                            <DatePicker 
                                                placeholder="Deadline Date"
                                                date={selectedDate}
                                                onDateChange={setSelectedDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-[40%] flex flex-col gap-5">
                    <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
                        <div className="flex flex-col gap-1">
                            <TypographyH4>Account Settings</TypographyH4>
                            <Divider/>
                        </div>
                        <form action="" className="flex flex-col items-start gap-5">
                            <LabelInput
                                label="Current Password"
                                input={
                                    <Input placeholder="Current Password" 
                                        id="current-password" 
                                        name="current-password" 
                                        type={isShowPassword.current ? "text" : "password"} 
                                        prefix={<LucideLock/>}
                                        suffix={isShowPassword.current 
                                            ? <LucideEyeClosed onClick={() => setIsShowPassword({...isShowPassword, current: false})}/> 
                                            : <LucideEye onClick={() => setIsShowPassword({...isShowPassword, current: true})}
                                        />}
                                    />
                                }
                            />
                            <LabelInput
                                label="New Password"
                                input={
                                    <Input placeholder="New Password" 
                                        id="new-password" 
                                        name="new-password" 
                                        type={isShowPassword.new ? "text" : "password"} 
                                        prefix={<LucideLock/>}
                                        suffix={isShowPassword.new 
                                            ? <LucideEyeClosed onClick={() => setIsShowPassword({...isShowPassword, new: false})}/> 
                                            : <LucideEye onClick={() => setIsShowPassword({...isShowPassword, new: true})}
                                        />}
                                    />
                                }
                            />
                            <LabelInput
                                label="Confirm Password"
                                input={
                                    <Input placeholder="Confirm Password" 
                                        id="confirm-password" 
                                        name="confirm-password" 
                                        type={isShowPassword.confirm ? "text" : "password"} 
                                        prefix={<LucideLock/>}
                                        suffix={isShowPassword.confirm 
                                            ? <LucideEyeClosed onClick={() => setIsShowPassword({...isShowPassword, confirm: false})}/> 
                                            : <LucideEye onClick={() => setIsShowPassword({...isShowPassword, confirm: true})}
                                        />}
                                    />
                                }
                            />
                        </form>
                    </div>
                    
                    {/* Benefits Section */}
                    <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
                        <div className="w-full flex flex-col gap-1">
                            <div className="w-full flex justify-between items-center">
                                <TypographyH4>Benefits</TypographyH4>
                                <IconLabel 
                                    text="Add Benefit" 
                                    icon={<LucidePlus className="text-muted-foreground"/>}
                                    className="cursor-pointer"
                                />
                            </div>
                            <Divider/>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => (
                                <div key={skill} className="px-3 py-2 rounded-2xl bg-muted">
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#0073E6"/>} text="Full Health Coverage"/>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
                        <div className="w-full flex flex-col gap-1">
                            <div className="w-full flex justify-between items-center">
                                <TypographyH4>Values</TypographyH4>
                                <IconLabel 
                                    text="Add Value" 
                                    icon={<LucidePlus className="text-muted-foreground"/>}
                                    className="cursor-pointer"
                                />
                            </div>
                            <Divider/>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => (
                                <div key={skill} className="px-3 py-2 rounded-2xl bg-muted">
                                    <IconLabel icon={<LucideCircleCheck stroke="white" fill="#69B41E"/>} text="Full Health Coverage"/>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CareerScopes Section */}
                    <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
                        <div className="w-full flex flex-col gap-1">
                            <div className="w-full flex justify-between items-center">
                                <TypographyH4>Career Scopes</TypographyH4>
                                <IconLabel 
                                    text="Add Career" 
                                    icon={<LucidePlus className="text-muted-foreground"/>}
                                    className="cursor-pointer"
                                />
                            </div>
                            <Divider/>
                        </div>
                        <div className="flex flex-wrap gap-3">
                         {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => <Tag key={skill} label="AI & Machine Learning"/>)}
                        </div>
                    </div>

                     {/* Social Information Form Section */}
                     <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <TypographyH4>Social Information</TypographyH4>
                                <IconLabel 
                                    text="Add Social" 
                                    icon={<LucidePlus className="text-muted-foreground"/>}
                                    className="cursor-pointer"
                                />
                            </div>
                            <Divider/>
                        </div>
                        <form action="" className="flex flex-col items-start gap-5">
                            <div className="w-full flex flex-col items-start gap-3">
                                <TypographyMuted>Social 1</TypographyMuted>
                                <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                                    <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                                        <div className="flex flex-col items-start gap-1">
                                            <TypographyMuted className="text-xs">Platform</TypographyMuted>
                                            <Select onValueChange={(value: TPlatform) => setSelectedPlatform(value)} value={selectedPlatform || ''}>
                                                <SelectTrigger className="h-12 text-muted-foreground">
                                                <SelectValue placeholder="Platform" />
                                                </SelectTrigger>    
                                                <SelectContent>
                                                    {platformConstant.map((platform) => 
                                                        <SelectItem key={platform.id} value={platform.value}>{platform.label}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <LabelInput 
                                            label="Link"
                                            input={<Input placeholder="Link" id="link" name="link" prefix={<LucideLink2/>}/>}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}