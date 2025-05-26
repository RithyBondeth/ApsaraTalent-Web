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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneLoginSchema, TPhoneLoginForm } from "./validation";
import { useRouter } from "next/navigation";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";

export default function PhoneNumberPage() {
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
    const router = useRouter();
    const { setBasicPhoneSignupData } = useBasicPhoneSignupDataStore();
    

    const { handleSubmit, register, formState: { errors } } = useForm<TPhoneLoginForm>({
        resolver: zodResolver(phoneLoginSchema)
    });

    const onSubmit = (data: TPhoneLoginForm) => {
        setBasicPhoneSignupData({ phone: data.phone, password: data.password });
        router.push('/signup/option');
    }

   return (
    <div className="h-screen w-screen flex justify-between items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
        <div className="h-screen w-1/2 flex justify-center items-center">
            <div className="h-fit w-[70%] flex flex-col items-stretch gap-3 tablet-lg:w-[85%] tablet-md:w-[95%] tablet-md:py-10">
                {/* Title Section */}
                <div className="mb-5">
                    <LogoComponent/>
                    <TypographyH2 className="phone-xl:text-xl">Sign in with Your Phone Number</TypographyH2>
                    <TypographyMuted className="text-md phone-xl:text-sm">Enter your phone number and password to access your account.</TypographyMuted>
                </div>
                
                {/* Form Section */}
                <form action="" className="flex flex-col items-stretch gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        prefix={<LucidePhone/>}
                        type="number"  
                        placeholder="phone"
                        {...register('phone')}
                        validationMessage={errors.phone?.message}
                    />
                   <Input
                        prefix={<LucideLockKeyhole/>}
                        suffix={passwordVisibility 
                            ? <LucideEyeClosed onClick={() => setPasswordVisibility(false)}/> 
                            : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
                        placeholder="Password"
                        type={passwordVisibility ? "text" : "password"}
                        {...register('password')}
                        validationMessage={errors.password?.message}
                    />
                    <Button>Login</Button>
                </form>
            </div>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-primary tablet-sm:p-10">
            <Image src={phoneNumberWhiteSvg} alt="phone-number" height={undefined} width={600}/>
        </div>
    </div>
   )
}