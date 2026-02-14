"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { userRoleConstant } from "@/utils/constants/app.constant";
import { TUserRole } from "@/utils/types/role.type";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signupOptionSchema, TSignupOptionSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/utils/error-message";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";

export default function SingUpOption() {
  // Utils
  const router = useRouter();

  // Signup Option Helpers
  const [selectedRole, setSelectedRole] = useState<TUserRole | null>(null);
  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData, setBasicPhoneSignupData } = useBasicPhoneSignupDataStore();

  // API Integration: Social Data
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  // React Hook Form: Signup Option Form
  const {
    handleSubmit,
    setValue,
    trigger,
    register,
    formState: { errors },
  } = useForm<TSignupOptionSchema>({
    resolver: zodResolver(signupOptionSchema),
  });

  // Set Role For Signup Option Function 
  const onSubmit = (data: TSignupOptionSchema) => {
    console.log("Form Submitted With role:", data.selectedRole);
    console.log("Store States:", {
      basicPhoneSignupData: !!basicPhoneSignupData,
      basicSignupData: !!basicSignupData,
      googleNewUser: googleUserData.newUser && !googleUserData.isAuthenticated,
      linkedInNewUser:
        linkedInUserData.newUser && !linkedInUserData.isAuthenticated,
      githubNewUser: githubUserData.newUser && !githubUserData.isAuthenticated,
      facebookNewUser:
        facebookUserData.newUser && !facebookUserData.isAuthenticated,
    });

    // Check different signup flows and navigate accordingly
    if (basicPhoneSignupData) {
      setBasicPhoneSignupData({
        ...basicPhoneSignupData,
        role: data.selectedRole,
      });
      router.push(`/signup/${data.selectedRole}`);
      return;
    }

    if (googleUserData.newUser && !googleUserData.isAuthenticated) {
      googleUserData.setRole(data.selectedRole as TUserRole);
      router.push(`/signup`);
      return;
    }

    if (linkedInUserData.newUser && !linkedInUserData.isAuthenticated) {
      linkedInUserData.setRole(data.selectedRole as TUserRole);
      router.push(`/signup`);
      return;
    }

    if (githubUserData.newUser && !githubUserData.isAuthenticated) {
      githubUserData.setRole(data.selectedRole as TUserRole);
      router.push(`/signup`);
      return;
    }

    if (facebookUserData.newUser && !facebookUserData.isAuthenticated) {
      facebookUserData.setRole(data.selectedRole as TUserRole);
      router.push(`/signup`);
      return;
    }

    setBasicSignupData({ selectedRole: data.selectedRole });
    router.push("/signup");
  };

  return (
    <div className="h-[80%] w-[85%] flex flex-col items-center justify-start gap-3 tablet-lg:w-full tablet-lg:p-5">
      <form
        className="flex flex-col items-start gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TypographyH2>Who do you wanna be in our platform?</TypographyH2>
        <div className="w-full flex flex-col items-start gap-2">
          <Select
            onValueChange={(value: TUserRole) => {
              setSelectedRole(value);
              setValue("selectedRole", value, { shouldValidate: true });
              trigger("selectedRole");
            }}
            value={selectedRole || ""}
            {...register("selectedRole")}
          >
            <SelectTrigger className="h-12 text-muted-foreground">
              <SelectValue placeholder="Who do you wanna be?" />
            </SelectTrigger>
            <SelectContent>
              {userRoleConstant.map((role) => (
                <SelectItem key={role.id} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage>{errors.selectedRole?.message}</ErrorMessage>
        </div>
        <div className="w-full flex items-center gap-5">
          <Button
            className="w-1/2"
            type="button"
            onClick={() => router.push("/login")}
          >
            <LucideArrowLeft />
            Back
          </Button>
          <Button className="w-1/2" type="submit">
            Next
            <LucideArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
