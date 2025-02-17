"use client"

import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideArrowLeft, LucideArrowRight, LucideEye, LucideEyeClosed, LucideLockKeyhole, LucideMail, LucidePhone, LucideUser } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import LogoComponent from "@/components/utils/logo";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'employer' | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="size-[70%] flex flex-col items-start gap-3">
      {/* Title Section */}
      <div className="mb-5">
        <LogoComponent/>
        <TypographyH2>Welcome to Apsara Talent</TypographyH2>
        <TypographyMuted className="text-md">Connect with professional community around the world.</TypographyMuted>
      </div>
      {/* End Title Section */}
      {/* Form Section */}
      <div className="w-full flex flex-col items-stretch gap-5">
        <div className="flex items-center gap-3">
          <Input placeholder="Firstname" type="text" name="firstname"/>
          <Input placeholder="Lastname" type="text" name="lastname"/>
        </div>
        <div className="flex items-center gap-3">
          <Input
            prefix={<LucideUser/>}
            type="text"
            placeholder="Username"
            name="username"
          />
          <Select onValueChange={(value: 'freelancer' | 'employer') => setSelectedRole(value)} value={selectedRole || ""}>
            <SelectTrigger className="h-12 text-muted-foreground">
              <SelectValue placeholder="Who are you looking for?" />
            </SelectTrigger>    
            <SelectContent>
              <SelectItem value="freelancer">Freelancer (Employee)</SelectItem>
              <SelectItem value="employer">Employer (Company)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-stretch gap-5">
          <Input 
            prefix={<LucidePhone/>}
            type="number"
            placeholder="Mobile"
            name="mobile"
          />   
          <Input 
            prefix={<LucideMail/>}
            type="email"
            placeholder="Email"
            name="email"
          />   
          <Input 
            prefix={<LucideLockKeyhole/>}
            suffix={passwordVisibility 
              ? <LucideEyeClosed onClick={() => setPasswordVisibility(false)}/> 
              : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
            type={passwordVisibility ? "text" : "password"}
            placeholder="Password"
            name="password"
          />                
          <Input 
            prefix={<LucideLockKeyhole/>}
            suffix={confirmPassVisibility 
              ? <LucideEyeClosed onClick={() => setConfirmPassVisibility(false)}/> 
              : <LucideEye onClick={() => setConfirmPassVisibility(true)}/>}
            type={confirmPassVisibility ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirm-password"
          />                
        </div>
        <div className="flex items-center gap-3">
            <Button 
              className="flex-1" 
              variant="outline" 
              preffix={<LucideArrowLeft/>} 
              onClick={() => router.push('/login')}
            >Back
            </Button>
            <Button 
              className="flex-1" 
              suffix={<LucideArrowRight/>} 
              onClick={() => router.push('/signup/career-scope')}
            >Next
            </Button>
        </div>
      </div>
      {/* End Form Section */}
    </div>
  )
}