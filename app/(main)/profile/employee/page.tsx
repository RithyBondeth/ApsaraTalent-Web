"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Divider from "@/components/utils/divider";
import LabelInput from "@/components/utils/label-input";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideEye, LucideEyeClosed, LucideLock, LucideMail, LucidePhone } from "lucide-react";
import { useState } from "react";

export default function EmployeeProfilePage() {

    const [isShowPassword, setIsShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });


    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border border-muted rounded-md p-5">
                <div className="flex items-center justify-start gap-5">
                    <Avatar className="size-28">
                        <AvatarFallback>BN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                        <TypographyH3>Rithy Bondeth</TypographyH3>
                        <TypographyMuted>Software Engineer</TypographyMuted>
                    </div>
                </div>
                <Button>Edit Profile</Button>
            </div>
            <div className="flex items-start gap-5">
                <div className="w-[60%] flex flex-col gap-5">
                    <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
                        <div className="flex flex-col gap-1">
                            <TypographyH4>Personal Information</TypographyH4>
                            <Divider/>
                        </div>
                        <form action="" className="flex flex-col items-start gap-5">
                            <div className="w-full flex items-center justify-between gap-5">
                                <LabelInput 
                                    label="Firstname" 
                                    input={<Input placeholder="Firstname" id="firstname" name="firstname"/>} 
                                />
                                <LabelInput 
                                    label="Lastname" 
                                    input={<Input placeholder="Lastname" id="lastname" name="lastname"/>} 
                                />
                                <LabelInput 
                                    label="Username" 
                                    input={<Input placeholder="Username" id="username" name="username"/>} 
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
                    <div className="border border-muted rounded-md p-5">
                        <div className="flex flex-col gap-1">
                            <TypographyH4>Contact Information</TypographyH4>
                            <Divider/>
                        </div>
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
                                    />}
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
                    <div className="border border-muted rounded-md p-5">
                        <div className="flex flex-col gap-1">
                            <TypographyH4>Privacy Settings</TypographyH4>
                            <Divider/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}