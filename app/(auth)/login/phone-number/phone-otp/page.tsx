import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import phoneOTPWhiteSvg from "@/assets/svg/phone-otp-white.svg";
import Image from "next/image";

export default function PhoneOTPPage() {

    return (
        <div className="h-screen w-screen flex items-stretch tablet-md:flex-col tablet-md:[&>div]:w-full">
        <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground tablet-md:h-fit">
            <div className="w-[70%] flex flex-col items-stretch gap-3 tablet-md:w-[90%] tablet-md:py-10">
                {/* Title Section */}
                <div className="mb-5">
                    <TypographyH2 className="phone-xl:text-2xl">OTP Verification</TypographyH2>
                    <TypographyMuted className="text-md phone-xl:text-sm">We will sent you an one time password code on your phone number.</TypographyMuted>
                </div>
                
                {/* Form Section */}
                <form action="" className="flex flex-col items-stretch gap-5">
                    <div className="flex flex-col items-start gap-3">
                        <InputOTP maxLength={6}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="input-otp-slot tablet-md:!size-10"/>
                                <InputOTPSlot index={1} className="input-otp-slot tablet-md:!size-10"/>
                                <InputOTPSlot index={2} className="input-otp-slot tablet-md:!size-10"/>
                            </InputOTPGroup>
                            <InputOTPSeparator/>
                            <InputOTPGroup>
                                <InputOTPSlot index={3} className="input-otp-slot tablet-md:!size-10"/>
                                <InputOTPSlot index={4} className="input-otp-slot tablet-md:!size-10"/>
                                <InputOTPSlot index={5} className="input-otp-slot tablet-md:!size-10"/>
                            </InputOTPGroup>
                        </InputOTP>
                        <TypographySmall className="text-muted-foreground phone-xl:text-sm">Enter your one time password code here.</TypographySmall>
                    </div>
                    <Button type="submit">Continue</Button>
                </form>
            </div>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-primary tablet-md:p-10 tablet-md:h-full">
           <Image src={phoneOTPWhiteSvg} alt="phone-otp" height={undefined} width={600}/>
        </div>
    </div>
    )
}