"use client";

import SmartResumeUpload from "@/components/employee/employee-signup-form/smart-resume-upload";
import { Button } from "@/components/ui/button";
import { AuthSelect } from "@/components/auth/auth-select";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { userRoleConstant } from "@/utils/constants/ui.constant";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TUserRole } from "@/utils/types/auth/role.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowRight, LucideUsers } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { signupOptionSchema, TSignupOptionSchema } from "./validation";

export default function SingUpOption() {
  /* -------------------------------------- Utils -------------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");

  /* ------------------------------------ All States ----------------------------------- */
  const [showResumeDialog, setShowResumeDialog] = useState<boolean>(false);
  const navigatingRef = useRef<boolean>(false);

  // Basic Signup Data
  const { basicSignupData, setBasicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData, setBasicPhoneSignupData } =
    useBasicPhoneSignupDataStore();

  /* -------------------------------- API Integrations --------------------------------- */
  // Get User Basic Data From Socials: Google, Github, LinkedIn, Facebook
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  /* ------------------------ React Hook Form: Signup Option Form ---------------------- */
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

  /* -------------------------------------- Methods -------------------------------------- */
  // ── Navigate To Signup Function (called after upload or skip) ────────────────
  const goToSignup = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setShowResumeDialog(false);
    router.push("/signup");
  };

  // ── Commit Role To Stores Function ───────────────────────────────────────────
  const commitRole = (role: string) => {
    // Basic Phone Signup Data
    if (basicPhoneSignupData)
      setBasicPhoneSignupData({ ...basicPhoneSignupData, role });

    // Social Signup Data
    if (googleUserData.newUser && !googleUserData.isAuthenticated)
      googleUserData.setRole(role as TUserRole);
    if (linkedInUserData.newUser && !linkedInUserData.isAuthenticated)
      linkedInUserData.setRole(role as TUserRole);
    if (githubUserData.newUser && !githubUserData.isAuthenticated)
      githubUserData.setRole(role as TUserRole);
    if (facebookUserData.newUser && !facebookUserData.isAuthenticated)
      facebookUserData.setRole(role as TUserRole);

    setBasicSignupData({ ...basicSignupData, selectedRole: role });
  };

  // ── Commit Signup Option Function ────────────────────────────────────────────
  const onSubmit = (data: TSignupOptionSchema) => {
    commitRole(data.selectedRole);

    if (data.selectedRole === USER_ROLE.EMPLOYEE) {
      // Show the smart resume dialog — navigation happens inside it
      setShowResumeDialog(true);
    } else {
      router.push("/signup");
    }
  };

  /* ---------------------------------------- Render UI ---------------------------------------- */
  return (
    <div className="mx-auto flex w-full max-w-[540px] flex-col items-start gap-6 border border-border bg-card p-6 tablet-lg:my-4 sm:p-8">
      {/* Icon Badge Section */}
      <div className="flex size-14 items-center justify-center rounded-none bg-foreground">
        <LucideUsers className="size-6 text-background" />
      </div>

      {/* Title Section */}
      <TypographyH2>{t("signupOptionTitle")}</TypographyH2>

      {/* Subtitle Section */}
      <TypographyMuted>{t("signupOptionSubtitle")}</TypographyMuted>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Role Selection Section */}
        <div className="flex w-full flex-col items-start">
          <Controller
            name="selectedRole"
            control={control}
            render={({ field }) => (
              <AuthSelect
                label={t("signupOptionPlaceholder")}
                value={field.value || ""}
                onValueChange={field.onChange}
                icon={<LucideUsers className="size-[18px]" strokeWidth={1.6} />}
                options={userRoleConstant.map((role) => ({
                  value: role.value,
                  label:
                    role.value === USER_ROLE.EMPLOYEE
                      ? t("signupOptionRoleEmployee")
                      : t("signupOptionRoleCompany"),
                }))}
                error={
                  errors.selectedRole
                    ? t("signupOptionRoleRequired")
                    : undefined
                }
              />
            )}
          />
        </div>

        {/* Navigate Back Button Section */}
        <div className="auth-action-row w-full">
          <AuthBackButton onClick={() => router.replace("/login")}>
            {t("back")}
          </AuthBackButton>
          <Button className="auth-submit" type="submit">
            {t("next")}
            <LucideArrowRight />
          </Button>
        </div>
      </form>

      {/* Note Section */}
      <div className="flex w-full items-center justify-center">
        <TypographyMuted className="text-xs">
          {t("signupOptionNote")}
        </TypographyMuted>
      </div>

      {/* Smart Resume Upload Dialog Section (Employee Only) */}
      <Dialog
        open={showResumeDialog}
        onOpenChange={(open) => {
          if (!open) goToSignup();
        }}
      >
        <DialogContent className="max-w-lg p-0">
          <div className="flex flex-col gap-5 px-6 pb-5 pt-6">
            {/* Header Section */}
            <DialogHeader>
              <DialogTitle className="text-xl">
                {t("smartUploadDialogTitle")}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {t("smartUploadDialogSubtitle")}
              </DialogDescription>
            </DialogHeader>

            {/* Upload Section */}
            <SmartResumeUpload onParsed={goToSignup} />

            {/* Skip Button Section */}
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-none text-sm text-muted-foreground hover:text-foreground"
              onClick={goToSignup}
            >
              {t("smartUploadDialogSkip")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
