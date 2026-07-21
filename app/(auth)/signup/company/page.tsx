"use client";

import AvatarCompanyStepForm from "@/components/company/company-signup-form/avatar-step";
import BasicInfoStepForm from "@/components/company/company-signup-form/basic-info-step";
import BenefitValueStepForm from "@/components/company/company-signup-form/benefit-value-step";
import CompanyCareerScopeStepForm from "@/components/company/company-signup-form/career-scope-step";
import CoverCompanyStepForm from "@/components/company/company-signup-form/cover-step";
import OpenPositionStepForm from "@/components/company/company-signup-form/open-position-step";
import { SignupStepProgress } from "@/components/auth/signup-step-progress";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useCompanySignupStore } from "@/stores/apis/auth/company-signup.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { makeCompanySignupSchema, TCompanySignup } from "./validation";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

export default function CompanySignup() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const totalSteps = 6;
  const stepLabels = [
    t("companyStepDetails"),
    t("companyStepPositions"),
    t("companyStepCulture"),
    t("companyStepPhoto"),
    t("companyStepCover"),
    t("companyStepCareer"),
  ];

  /* ------------------------------ All States -------------------------------- */
  const [step, setStep] = useState<number>(1);
  const [uploadsComplete, setUploadsComplete] = useState<boolean>(false);
  const stepBodyRef = useRef<HTMLDivElement>(null);

  // Get User Basic Data
  const { basicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();

  /* ----------------------------- API Integration ---------------------------- */
  // Upload Avatar, Cover
  const uploadAvatar = useUploadCompanyAvatarStore();
  const uploadCover = useUploadCompanyCoverStore();

  // Company Register
  const cmpSignup = useCompanySignupStore();

  /* ------------------------------- All Effects ------------------------------ */
  useEffect(() => {
    stepBodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  /* ------------------- React Hook Form: Company Signup Form ------------------ */
  // ── Define Schema For Company Signup Form ───────────────────────────
  const companySignupSchema = useMemo(
    () =>
      makeCompanySignupSchema({
        atLeastOneSkill: tv("atLeastOneSkill"),
        atLeastOnePosition: tv("atLeastOnePosition"),
        atLeastOneCareer: tv("atLeastOneCareer"),
        deadlineRequired: tv("deadlineRequired"),
        fieldRequired: (field) => {
          const labels: Record<string, string> = {
            Name: tv("fieldLabelName"),
            Description: tv("fieldLabelDescription"),
            Industry: tv("fieldLabelIndustry"),
            "Company size": tv("fieldLabelCompanySize"),
            "Founded Year": tv("fieldLabelFoundedYear"),
            Title: tv("fieldLabelTitle"),
            "Experience requirement": tv("fieldLabelExperienceReq"),
            "Education requirement": tv("fieldLabelEducationReq"),
            Type: tv("fieldLabelType"),
          };
          return tv("fieldRequired", { field: labels[field] ?? field });
        },
        fieldTooLong: (field, max) => {
          const labels: Record<string, string> = {
            Name: tv("fieldLabelName"),
            Description: tv("fieldLabelDescription"),
            Industry: tv("fieldLabelIndustry"),
            "Company size": tv("fieldLabelCompanySize"),
            "Founded Year": tv("fieldLabelFoundedYear"),
            Title: tv("fieldLabelTitle"),
            "Experience requirement": tv("fieldLabelExperienceReq"),
            "Education requirement": tv("fieldLabelEducationReq"),
            Type: tv("fieldLabelType"),
          };
          return tv("fieldTooLong", { field: labels[field] ?? field, max });
        },
        selectRequired: (field) => {
          const labels: Record<string, string> = {
            location: tv("fieldLabelLocation"),
          };
          return tv("selectRequired", { field: labels[field] ?? field });
        },
      }),
    [tv],
  );

  // ── Initialize Company Form with Default Values ─────────────────────
  const cmpForm = useForm<TCompanySignup>({
    mode: "onChange",
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      basicInfo: {
        name: "",
        description: "",
        industry: "",
        companySize: "",
        foundedYear: "",
        location: "",
      },
      openPositions: [
        {
          title: "",
          description: "",
          experienceRequirement: "",
          educationRequirement: "",
          skills: [],
          types: "",
          salaryMin: undefined,
          salaryMax: undefined,
          salaryCurrency: "USD",
          workMode: undefined,
          location: "",
          openingsCount: undefined,
          deadlineDate: "" as unknown as Date,
        },
      ],
      benefitsAndValues: {
        benefits: [],
        values: [],
      },
      avatar: null,
      cover: null,
      careerScopes: [],
    },
  });

  const {
    handleSubmit,
    register,
    trigger,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = cmpForm;

  // ── Field Groups Per Step For Selective Validation ──────────────────
  const stepFieldMap: Record<number, (keyof TCompanySignup)[]> = {
    1: ["basicInfo"],
    2: ["openPositions"],
    3: ["benefitsAndValues"],
    4: ["avatar"],
    5: ["cover"],
    6: ["careerScopes"],
  };

  /* --------------------------------- Methods --------------------------------- */
  // ── Navigation Helpers Function ────────────────────────────────
  // Handle Previous Step
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle Next Step and Final Submit
  const nextStep = async () => {
    const fieldsToValidate = stepFieldMap[step];
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (!isValid) return;

    if (isValid) {
      if (step === totalSteps) {
        // Final Submit: Company Registration
        handleSubmit(async (data) => {
          // Register with regular email-password
          if (basicSignupData) {
            // Signup company first to get companyID
            const companyId = await cmpSignup.signup({
              authEmail: true,
              email: basicSignupData.email!,
              password: basicSignupData.password!,
              name: data.basicInfo.name,
              description: data.basicInfo.description,
              phone: basicSignupData.phone!,
              industry: data.basicInfo.industry,
              location: data.basicInfo.location,
              companySize: Number(data.basicInfo.companySize),
              foundedYear: Number(data.basicInfo.foundedYear),
              openPositions: data.openPositions?.map((job) => ({
                title: job.title,
                description: job.description,
                type: job.types,
                experience: job.experienceRequirement,
                education: job.educationRequirement,
                skills: job.skills,
                deadlineDate: job.deadlineDate.toISOString(),
              })),
              benefits:
                data.benefitsAndValues.benefits?.map((bf) => ({
                  label: bf,
                })) ?? [],
              values:
                data.benefitsAndValues.values?.map((value) => ({
                  label: value,
                })) ?? [],
              careerScopes: data.careerScopes.map((cs) => ({
                name: cs,
              })),
              socials: [],
            });

            if (!companyId) {
              console.error("Company ID not found after signup");
              return;
            }

            // Upload files in parallel
            const uploadTasks = [];

            if (data.avatar instanceof File)
              uploadTasks.push(
                uploadAvatar.uploadAvatar(companyId, data.avatar),
              );

            if (data.cover instanceof File)
              uploadTasks.push(uploadCover.uploadCover(companyId, data.cover));

            // Upload all avatar and cover together
            await Promise.all(uploadTasks);
            setUploadsComplete(true);
          }

          // Register with phone-otp
          if (basicPhoneSignupData) {
            // Signup company first to get companyID
            const companyId = await cmpSignup.signup({
              authEmail: false,
              email: null,
              password: null,
              name: data.basicInfo.name,
              description: data.basicInfo.description,
              phone: basicPhoneSignupData.phone!,
              industry: data.basicInfo.industry,
              location: data.basicInfo.location,
              companySize: Number(data.basicInfo.companySize),
              foundedYear: Number(data.basicInfo.foundedYear),
              openPositions: data.openPositions?.map((job) => ({
                title: job.title,
                description: job.description,
                type: job.types,
                experience: job.experienceRequirement,
                education: job.educationRequirement,
                skills: job.skills,
                deadlineDate: job.deadlineDate.toISOString(),
              })),
              benefits:
                data.benefitsAndValues.benefits?.map((bf) => ({
                  label: bf,
                })) ?? [],
              values:
                data.benefitsAndValues.values?.map((value) => ({
                  label: value,
                })) ?? [],
              careerScopes: data.careerScopes.map((cs) => ({
                name: cs,
              })),
              socials: [],
            });

            if (!companyId) {
              console.error("Company ID not found after signup");
              return;
            }

            // Upload files in parallel
            const uploadTasks: Promise<unknown>[] = [];

            if (data.avatar instanceof File)
              uploadTasks.push(
                uploadAvatar.uploadAvatar(companyId, data.avatar),
              );

            if (data.cover instanceof File)
              uploadTasks.push(uploadCover.uploadCover(companyId, data.cover));

            // Upload all avatar and cover together
            await Promise.all(uploadTasks);
            setUploadsComplete(true);
          }
        })();
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  /* --------------------------------- Effects --------------------------------- */
  // ── Company Signup Effect ──────────────────────────────────────
  useEffect(() => {
    if (
      cmpSignup.isAuthenticated &&
      uploadsComplete &&
      !cmpSignup.loading &&
      !uploadAvatar.loading &&
      !uploadCover.loading
    ) {
      toast.dismiss();
      toast.success(t("signupSuccessful"), {
        duration: TOAST_DURATION_MS.SHORT,
      });
      setTimeout(() => router.replace("/feed"), DEFAULT_REDIRECT_DELAY_MS);
    }

    const errorList = [
      { error: cmpSignup.error, message: cmpSignup.message },
      { error: uploadAvatar.error, message: uploadAvatar.message },
      { error: uploadCover.error, message: uploadCover.message },
    ];

    errorList.forEach(({ error }) => {
      if (error) {
        toast.dismiss();
        toast.error(t("anErrorOccurred"), {
          action: { label: t("retry"), onClick: () => {} },
        });
      }
    });
  }, [
    t,
    cmpSignup.loading,
    cmpSignup.error,
    cmpSignup.message,
    cmpSignup.isAuthenticated,
    uploadAvatar.loading,
    uploadAvatar.error,
    uploadAvatar.message,
    uploadCover.loading,
    uploadCover.error,
    uploadCover.message,
    uploadsComplete,
    router,
  ]);

  /* ------------------------------ Loading State ------------------------------ */
  const isSignupLoading =
    cmpSignup.loading || uploadAvatar.loading || uploadCover.loading;

  // Signup loading title
  const signupLoadingMessage = cmpSignup.loading
    ? t("creatingCompanyAccount")
    : uploadAvatar.loading
      ? t("uploadingCompanyAvatar")
      : uploadCover.loading
        ? t("uploadingCompanyCover")
        : t("processingRequest");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="advanced-signup-page company-signup-page mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col gap-3 px-1 tablet-lg:max-w-full tablet-lg:px-2">
      {/* Navigate Back Button Section */}
      <button
        type="button"
        onClick={() => router.replace("/signup")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <LucideArrowLeft className="size-4" />
        {t("backToBasicInfo")}
      </button>

      {/* Title Section */}
      <div className="auth-heading-group">
        <TypographyH2>{t("signupAsCompany")}</TypographyH2>
        <TypographyMuted className="text-md">
          {t("companySignupSubtitle")}
        </TypographyMuted>
      </div>

      {/* Step Progress Section */}
      <SignupStepProgress
        currentStep={step}
        labels={stepLabels}
        progressLabel={t("signupStepProgress", {
          current: step,
          total: totalSteps,
        })}
        skippedLabel={t("signupStepSkipped")}
      />

      {/* Form Section */}
      <FormProvider {...cmpForm}>
        <form
          className="advanced-signup-form flex min-h-0 w-full flex-1 flex-col overflow-hidden"
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            ref={stepBodyRef}
            className="advanced-signup-step-body min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
          >
            {step === 1 && (
              <BasicInfoStepForm
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
              />
            )}
            {step === 2 && (
              <OpenPositionStepForm
                register={register}
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
                control={control}
              />
            )}
            {step === 3 && (
              <BenefitValueStepForm
                register={register}
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
                errors={errors}
              />
            )}
            {step === 4 && (
              <AvatarCompanyStepForm
                register={register}
                setValue={setValue}
                getValues={getValues}
              />
            )}
            {step === 5 && (
              <CoverCompanyStepForm
                register={register}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
              />
            )}
            {step === 6 && (
              <CompanyCareerScopeStepForm
                register={register}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
              />
            )}
          </div>

          {/* Navigation Buttons Section */}
          <div className="advanced-signup-nav mt-3 flex shrink-0 gap-3 border-t border-border/70 bg-background/95 pt-3 sm:justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="auth-secondary-action flex-1 sm:flex-initial sm:min-w-[140px]"
              >
                <LucideArrowLeft />
                {t("back")}
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <Button
              type="button"
              className="auth-primary-action flex-1 sm:flex-initial sm:min-w-[140px]"
              onClick={nextStep}
              disabled={
                cmpSignup.loading || uploadAvatar.loading || uploadCover.loading
              }
            >
              {step === totalSteps ? t("submit") : t("next")}
              <LucideArrowRight />
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={isSignupLoading}
        title={signupLoadingMessage}
        subTitle={t("pleaseWaitCompanySignup")}
      />
    </div>
  );
}
