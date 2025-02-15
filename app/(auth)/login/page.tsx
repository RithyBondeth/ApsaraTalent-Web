"use client"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SocialButton from "@/components/utils/buttons/social-button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2"
import { TypographyMuted } from "@/components/utils/typography/typography-muted"
import { googleIcon, facebookIcon, linkedinIcon, githubIcon } from '@/constants/asset.constant';
import { LucideEye, LucideEyeOff, LucideLock, LucideMail } from "lucide-react";
import { useState } from "react";

function LoginPage() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);


  return (
    <div className="h-screen w-screen flex justify-between items-stretch">
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
         <div className="size-[60%] flex flex-col items-start gap-3">
            {/* Title Section */}
            <TypographyH2>Log in to your Account</TypographyH2>
            <TypographyMuted className="text-md">Welcome to Apsara Talent! Select method to log in</TypographyMuted>
            {/* End Title Section */}
            {/* Social Button Login Section */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center gap-3">
                <SocialButton image={googleIcon} label="Google" variant="outline" className="w-1/2"/>
                <SocialButton image={facebookIcon} label="Google" variant="outline" className="w-1/2"/>
              </div>
              <div className="flex justify-between items-center gap-3">
                <SocialButton image={linkedinIcon} label="LinkedIn" variant="outline" className="w-1/2"/>
                <SocialButton image={githubIcon} label="Github" variant="outline" className="w-1/2"/>
              </div>
            </div>
            {/* End Social Button Login Section */}
            {/* Divider Section */}
            <div className="w-full flex justify-between items-center">
              <Separator className="w-1/3"/>
              <TypographyMuted className="text-xs">or continue with email</TypographyMuted>
              <Separator className="w-1/3"/>
            </div>
            {/* End Divider Section */}
            {/* Login Form Section Section */}
            <div className="w-full flex flex-col items-start gap-3">
              <Input
                prefix={<LucideMail/>}
                placeholder="Email"
                type="email"
                name="email"
                required
              />
              <Input
                prefix={<LucideLock/>}
                suffix={passwordVisibility 
                  ? <LucideEyeOff onClick={() => setPasswordVisibility(false)}/> 
                  : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
                placeholder="Password"
                type={passwordVisibility ? "text" : "password"}
                name="password"
                required
              />
            </div>
            {/* End Login Form Section Section */}
         </div>
      </div>
      <div className="w-1/2 bg-primary">

      </div>
    </div>
  )
}

export default LoginPage