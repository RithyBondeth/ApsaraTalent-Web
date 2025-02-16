"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideEye, LucideEyeClosed, LucideLockKeyhole, LucidePhone } from "lucide-react";
import { useState } from "react";
import LogoComponent from "@/components/utils/logo";
import phoneNumberWhiteSvg from "@/assets/svg/phone-number-white.svg";
import Image from "next/image";

export default function PhoneNumberPage() {
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
    
   return (
    <div className="h-screen w-screen flex justify-between items-stretch">
        <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
            <div className="size-[70%] flex flex-col items-stretch gap-3">
                {/* Title Section */}
                <div className="mb-5">
                    <LogoComponent/>
                    <TypographyH2>Sign in with Your Phone Number</TypographyH2>
                    <TypographyMuted className="text-md">Enter your phone number and password to access your account.</TypographyMuted>
                </div>
                
                {/* Form Section */}
                <form action="" className="flex flex-col items-stretch gap-3">
                    <Input
                        preffix={<LucidePhone/>}
                        type="number"  
                        placeholder="Phone Number"
                        name="phone-number"
                        required
                    />
                   <Input
                        preffix={<LucideLockKeyhole/>}
                        suffix={passwordVisibility 
                            ? <LucideEyeClosed onClick={() => setPasswordVisibility(false)}/> 
                            : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
                        placeholder="Password"
                        type={passwordVisibility ? "text" : "password"}
                        name="password"
                        required
                    />
                    <Button>Login</Button>
                </form>
            </div>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-primary">
            <Image src={phoneNumberWhiteSvg} alt="phone-number" height={undefined} width={600}/>
        </div>
    </div>
   )
}