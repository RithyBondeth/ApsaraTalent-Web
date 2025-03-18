"use client"

import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideArrowLeft, LucideArrowRight, LucideEye, LucideEyeClosed, LucideLockKeyhole, LucideMail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import LogoComponent from "@/components/utils/logo";
import { useThemeStore } from "@/stores/theme-store";
import { TUserRole } from "@/utils/types/role.type";
import { genderConstant, userRoleConstant } from "@/utils/constant";
import { TGender } from "@/utils/types/gender.type";
import { useRoleStore } from "@/stores/role-store";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<TUserRole | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] = useState<boolean>(false);
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<TGender | null>(null);

  const { theme } = useThemeStore();
  const { role } = useRoleStore(); 

  return (
    <div className="size-[70%] flex flex-col items-start gap-3">
      {/* Title Section */}
      <div className="mb-5">
        <LogoComponent isBlackLogo={theme === 'light' ? false : true}/>
        <TypographyH2>Welcome to Apsara Talent</TypographyH2>
        <TypographyMuted className="text-md">Connect with professional community around the world.</TypographyMuted>
      </div>
      {/* End Title Section */}
      {/* Form Section */}
      <div className="w-full flex flex-col items-stretch gap-5">
        <div className="flex items-center gap-3">
          <Input placeholder="Firstname" type="text" name="first-name"/>
          <Input placeholder="Lastname" type="text" name="last-name"/>
        </div>
        <div className="flex items-center gap-3">
          <Input type="text" placeholder="Username" name="username"/>
          <Select onValueChange={(value: TUserRole) => setSelectedRole(value)} value={selectedRole || ""}>
            <SelectTrigger className="h-12 text-muted-foreground">
              <SelectValue placeholder="Who are you looking for?"/>
            </SelectTrigger>    
            <SelectContent>
              {userRoleConstant.map((role) => (
                <SelectItem key={role.id} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-stretch gap-5">
          <div className="flex gap-3">
              <Select onValueChange={(value: TGender) => setSelectedGender(value)} value={selectedGender || ''}>
                <SelectTrigger className="h-12 text-muted-foreground">
                <SelectValue placeholder="Gender" />
                </SelectTrigger>    
                <SelectContent>
                  {genderConstant.map((gender) => 
                    <SelectItem key={gender.id} value={gender.value}>{gender.label}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Mobile" name="mobile"/>   
          </div>
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
            <Button className="flex-1" variant="outline" onClick={() => router.push('/login')}> 
              <LucideArrowLeft/>
              Back
            </Button>
            <Button className="flex-1"  onClick={() => router.push(`/signup/${role}`)}> 
              <LucideArrowRight/>
              Next
            </Button>
        </div>
      </div>
      {/* End Form Section */}
    </div>
  )
}