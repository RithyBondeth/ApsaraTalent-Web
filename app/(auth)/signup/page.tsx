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
import { genderConstant, userRoleConstant } from "@/utils/constants/app.constant";
import { TGender } from "@/utils/types/gender.type";
import { useForm } from "react-hook-form";
import { basicSignupSchema, TBasicSignupSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/utils/error-message";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<TUserRole | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPassVisibility, setConfirmPassVisibility] = useState<boolean>(false);
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<TGender | null>(null);
  const { theme } = useThemeStore();

  const { handleSubmit, register, setValue, trigger, formState: { errors } } = useForm<TBasicSignupSchema>({
    resolver: zodResolver(basicSignupSchema)
  });

  const onSubmit = (data: TBasicSignupSchema) => {
    console.log(data);
    router.push(`signup/${data.selectedRole}`);
  }

  return (
    <div className="size-[70%] flex flex-col items-start justify-center gap-3 tablet-sm:w-[90%]">
      {/* Title Section */}
      <div className="mb-5">
        <LogoComponent isBlackLogo={theme === 'light' ? false : true}/>
        <TypographyH2>Welcome to Apsara Talent</TypographyH2>
        <TypographyMuted className="text-md">Connect with professional community around the world.</TypographyMuted>
      </div>
      {/* End Title Section */}
      {/* Form Section */}
      <form className="w-full flex flex-col items-stretch gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-3 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
          <Input placeholder="Firstname" type="text" {...register('firstName')} validationMessage={errors.firstName?.message}/>
          <Input placeholder="Lastname" type="text" {...register('lastName')} validationMessage={errors.lastName?.message}/>
        </div>
        <div className="w-full flex items-center gap-3 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
          <Input type="text" placeholder="Username" className="w-full" {...register('username')} validationMessage={errors.username?.message}/>
          <div className="w-full flex flex-col items-start gap-1">
            <Select 
              onValueChange={(value: TUserRole) => {
                setSelectedRole(value);
                setValue('selectedRole', value, { shouldValidate: true });
                trigger('selectedRole');
              }} 
              value={selectedRole || ""} 
              {...register('selectedRole')}
            >
              <SelectTrigger className="h-12 text-muted-foreground">
                <SelectValue placeholder="Who are you looking for?"/>
              </SelectTrigger>    
              <SelectContent>
                {userRoleConstant.map((role) => (
                  <SelectItem key={role.id} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage>{errors.selectedRole?.message}</ErrorMessage>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-5">
          <div className="flex gap-3 [&>select]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
              <div className="w-full flex flex-col items-start gap-1">
                <Select 
                  onValueChange={(value: TGender) => {
                    setSelectedGender(value);
                    setValue('gender', value, { shouldValidate: true });
                    trigger('gender');
                  }} 
                  value={selectedGender || ''}
                >
                  <SelectTrigger className="h-12 text-muted-foreground">
                  <SelectValue placeholder="Gender" />
                  </SelectTrigger>   
                  <SelectContent>
                    {genderConstant.map((gender) => 
                      <SelectItem key={gender.id} value={gender.value}>{gender.label}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <ErrorMessage>{errors.gender?.message}</ErrorMessage>
              </div>
              <Input type="number" placeholder="Mobile" className="w-full" {...register('phone')} validationMessage={errors.phone?.message}/>   
          </div>
          <Input 
            prefix={<LucideMail/>}
            type="email"
            placeholder="Email"
            {...register('email')}
            validationMessage={errors.email?.message}
          />   
          <Input 
            prefix={<LucideLockKeyhole/>}
            suffix={passwordVisibility 
              ? <LucideEyeClosed onClick={() => setPasswordVisibility(false)}/> 
              : <LucideEye onClick={() => setPasswordVisibility(true)}/>}
            type={passwordVisibility ? "text" : "password"}
            placeholder="Password"
            {...register('password')}
            validationMessage={errors.password?.message}
          />                
          <Input 
            prefix={<LucideLockKeyhole/>}
            suffix={confirmPassVisibility 
              ? <LucideEyeClosed onClick={() => setConfirmPassVisibility(false)}/> 
              : <LucideEye onClick={() => setConfirmPassVisibility(true)}/>}
            type={confirmPassVisibility ? "text" : "password"}
            placeholder="Confirm Password"
            {...register('confirmPassword')}
            validationMessage={errors.confirmPassword?.message}
          />                
        </div>
        <div className="flex items-center gap-3">
            <Button className="flex-1" variant="outline" onClick={() => router.push('/login')}> 
              <LucideArrowLeft/>
              Back
            </Button>
            <Button className="flex-1" type="submit"> 
              <LucideArrowRight/>
              Next
            </Button>
        </div>
      </form>
      {/* End Form Section */}
    </div>
  )
}