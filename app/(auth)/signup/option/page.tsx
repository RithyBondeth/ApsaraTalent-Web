"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { userRoleConstant } from "@/utils/constants/ui.constant";
import { TUserRole } from "@/utils/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowLeft, LucideArrowRight, LucideUsers } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { signupOptionSchema, TSignupOptionSchema } from "./validation";

export default function SingUpOption() {
  /* ---------------------------------- Utils ---------------------------------- */
  const router = useRouter();

  /* -------------------------------- All States ------------------------------- */
  // Signup Option Helpers
  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData, setBasicPhoneSignupData } =
    useBasicPhoneSignupDataStore();

  /* --------------------- API Integration: Social Data ------------------------ */
  // Get user basic data from socials: Google, Github, LinkedIn, Facebook
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  /* -------------------- React Hook Form: Signup Option Form ------------------- */
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TSignupOptionSchema>({
    resolver: zodResolver(signupOptionSchema),
    defaultValues: {
      selectedRole: undefined,
    },
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Signup Option Function ─────────────────────────────────────────
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

      setBasicSignupData({
        ...basicSignupData,
        selectedRole: data.selectedRole,
      });

      router.push("/signup");
      return;
    }

    if (googleUserData.newUser && !googleUserData.isAuthenticated) {
      googleUserData.setRole(data.selectedRole as TUserRole);
      setBasicSignupData({
        ...basicSignupData,
        selectedRole: data.selectedRole,
      });
      router.push("/signup");
      return;
    }

    if (linkedInUserData.newUser && !linkedInUserData.isAuthenticated) {
      linkedInUserData.setRole(data.selectedRole as TUserRole);
      setBasicSignupData({
        ...basicSignupData,
        selectedRole: data.selectedRole,
      });
      router.push("/signup");
      return;
    }

    if (githubUserData.newUser && !githubUserData.isAuthenticated) {
      githubUserData.setRole(data.selectedRole as TUserRole);
      setBasicSignupData({
        ...basicSignupData,
        selectedRole: data.selectedRole,
      });
      router.push("/signup");
      return;
    }

    if (facebookUserData.newUser && !facebookUserData.isAuthenticated) {
      facebookUserData.setRole(data.selectedRole as TUserRole);
      setBasicSignupData({
        ...basicSignupData,
        selectedRole: data.selectedRole,
      });
      router.push("/signup");
      return;
    }

    setBasicSignupData({
      ...basicSignupData,
      selectedRole: data.selectedRole,
    });
    router.push("/signup");
  };

  /* ---------------------------------------- Render UI ---------------------------------------- */
  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col items-start gap-6 py-8 tablet-lg:py-4">
      {/* Icon Badge Section */}
      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <LucideUsers className="size-6 text-primary" />
      </div>

      {/* Title Section */}
      <TypographyH2>Who do you wanna be in our platform?</TypographyH2>

      {/* Subtitle Section */}
      <TypographyMuted>
        Choose your role to get started with Apsara Talent.
      </TypographyMuted>

      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* Role Selection Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <Controller
            name="selectedRole"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
            )}
          />
          <ErrorMessage>{errors.selectedRole?.message}</ErrorMessage>
        </div>

        {/* Button Section */}
        <div className="w-full flex items-center gap-3">
          <Button
            className="flex-1"
            variant="outline"
            type="button"
            onClick={() => router.push("/login")}
          >
            <LucideArrowLeft />
            Back
          </Button>
          <Button className="flex-1" type="submit">
            Next
            <LucideArrowRight />
          </Button>
        </div>
      </form>

      {/* Note Section */}
      <div className="w-full flex items-center justify-center">
        <TypographyMuted className="text-xs">
          You can always update your profile later.
        </TypographyMuted>
      </div>
    </div>
  );
}
