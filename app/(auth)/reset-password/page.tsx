"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideEye, LucideEyeClosed, LucideLockKeyhole } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import resetPasswordWhiteSvg from "@/assets/svg/reset-password-white.svg"

export default function ResetPasswordPage() {
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
    const [confirmPassVisibility, setConfirmPassVisibility] = useState<boolean>(false);

    return (
        <div className="h-screen w-screen flex justify-between items-stretch">
            <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
                <div className="size-[60%] flex flex-col items-stretch gap-3">
                    {/* Title Section */}
                    <div className="mb-5">
                        <TypographyH2>Set Up Your New Password</TypographyH2>
                        <TypographyMuted className="text-md">Create a strong password to keep your account safe.</TypographyMuted>
                    </div>

                    {/* Form Section */}
                    <form action="" className="flex flex-col gap-3">
                        <Input 
                            preffix={<LucideLockKeyhole/>}
                            suffix={passwordVisibility 
                            ? <LucideEyeClosed onClick={() => setPasswordVisibility(false)}/> 
                            : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
                            type={passwordVisibility ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                        />                
                        <Input 
                            preffix={<LucideLockKeyhole/>}
                            suffix={confirmPassVisibility 
                            ? <LucideEyeClosed onClick={() => setConfirmPassVisibility(false)}/> 
                            : <LucideEye onClick={() => setConfirmPassVisibility(true)}/>}
                            type={confirmPassVisibility ? "text" : "password"}
                            placeholder="Confirm Password"
                            name="confirm-password"
                        />    
                        <Button type="submit">Continue</Button>           
                    </form>
                </div>
            </div>
            <div className="w-1/2 flex justify-center items-center bg-primary">
                <Image src={resetPasswordWhiteSvg} alt="" height={undefined} width={600}/>
            </div>
        </div>
    )
}