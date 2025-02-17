"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SocialButton from "@/components/utils/buttons/social-button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2"
import { TypographyMuted } from "@/components/utils/typography/typography-muted"
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { googleIcon, facebookIcon, linkedinIcon, githubIcon } from '@/constants/asset.constant';
import { LucideEye, LucideEyeClosed, LucideLockKeyhole, LucideMail, LucidePhone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoComponent from "@/components/utils/logo";
import loginWhiteSvg from "@/assets/svg/login-white.svg";
import loginBlackSvg from "@/assets/svg/login-black.svg";
import Image from "next/image";
import { useTheme } from "next-themes";

function LoginPage() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const router = useRouter();

  const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    // Determine which image to display (avoid SSR issues)
    const currentTheme = mounted ? resolvedTheme : "light";
    const loginImage = currentTheme === "dark" ? loginWhiteSvg : loginBlackSvg;

  return (
    <div className="h-screen w-screen flex justify-between items-stretch">
      <div className="h-screen w-1/2 flex justify-center items-center bg-primary-foreground">
         <div className="size-[70%] flex flex-col items-start gap-3">
            {/* Title Section */}
            <div>
              <LogoComponent/>
              <TypographyH2>Log in to your Account</TypographyH2>
              <TypographyMuted className="text-md">Welcome to Apsara Talent! Select method to log in</TypographyMuted>
            </div>
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
              <Button variant="outline" prefixIcon={<LucidePhone/>} onClick={() => router.push('login/phone-number')}>Phone Number</Button>
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
            <form  className="w-full flex flex-col items-stretch gap-5" method="POST">
              <div className="flex flex-col gap-5">
                <Input
                  prefix={<LucideMail/>}
                  placeholder="Email"
                  type="email"
                  name="email"
                  required
                />
                <Input
                  prefix={<LucideLockKeyhole/>}
                  suffix={passwordVisibility 
                    ? <LucideEyeClosed onClick={() => setPasswordVisibility(false)}/> 
                    : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
                  placeholder="Password"
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  required
                />
              </div>
              <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-1">
                      <Checkbox name="remember"/>
                      <TypographyMuted className="text-xs">Remember me</TypographyMuted>
                  </div>
                  <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground">
                    <Link href="/forgot-password">Forgot Password?</Link>
                  </TypographySmall>
              </div>
              <Button type="submit">Login</Button>
              <div className="flex items-center gap-2 mx-auto">
                  <TypographyMuted>Do not have account?</TypographyMuted>
                  <Link href='/signup'>
                    <TypographySmall className="text-xs cursor-pointer hover:text-muted-foreground">Create account</TypographySmall>
                  </Link>
              </div>
            </form>
            {/* End Login Form Section Section */}
         </div>
      </div>
      <div className="w-1/2 flex justify-center items-center bg-primary">
        <Image src={loginImage} alt="login" height={undefined} width={600}/>
      </div>
    </div>
  )
}

export default LoginPage