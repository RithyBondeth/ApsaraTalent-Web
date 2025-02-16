"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideArrowLeft, LucideMail, LucidePhone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import forgotPasswordWhiteSvg from "@/assets/svg/forgot-password-white.svg";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState<string>("");

    // Check if input is a number (mobile) or contains "@" (email)
    const isEmailInput = /^[a-zA-Z@.\-_]+$/.test(inputValue) || inputValue.includes("@");
    const isNumberInput = /^\d+$/.test(inputValue) && inputValue.length > 0;

    return (
        <div className="h-screen w-screen flex justify-between items-stretch">
            <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
                <div className="size-[60%] flex flex-col items-stretch gap-3">
                    {/* Title Section */}
                    <div className="mb-5">
                        <TypographyH2>Forgot your Password?</TypographyH2>
                        <TypographyMuted className="text-md">Enter your Email or Mobile. We will help you reset your passord.</TypographyMuted>
                    </div>

                    {/* Form Section */}
                    <form action="" className="flex flex-col gap-3">
                        <Input 
                            type="text"
                            placeholder="Email or Mobile"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            preffix={isEmailInput ? <LucideMail/> : isNumberInput ? <LucidePhone/> : null}
                        />
                        <div className="flex items-center justify-stretch gap-3 [&>button]:w-1/2">
                            <Button preffix={<LucideArrowLeft/>} type="button" onClick={() => router.push('/login')}>Back</Button>
                            <Button type="submit">Continue</Button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-1/2 flex justify-center items-center bg-primary">
                <Image src={forgotPasswordWhiteSvg} alt="forgot-password" height={undefined} width={600}/>
            </div>
        </div>
    )
}