"use client";

import AvatarCompanyStepForm from "@/components/company/company-signup-form/avatar-step";
import BasicInfoStepForm from "@/components/company/company-signup-form/basic-info-step";
import BenefitValueStepForm from "@/components/company/company-signup-form/benefit-value-step";
import CompanyCareerScopeStepForm from "@/components/company/company-signup-form/career-scope-step";
import CoverCompanyStepForm from "@/components/company/company-signup-form/cover-step";
import OpenPositionStepForm from "@/components/company/company-signup-form/open-position-step";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useCompanySignupStore } from "@/stores/apis/auth/company-signup.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { companySignupSchema, TCompanySignup } from "./validation";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function CompanySignup() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("auth");

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;
  const [uploadsComplete, setUploadsComplete] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  // Get user basic data from Basic, Phone
  const { basicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();

  // Upload Avatar, Cover
  const uploadAvatar = useUploadCompanyAvatarStore();
  const uploadCover = useUploadCompanyCoverStore();

  // Company Register
  const cmpSignup = useCompanySignupStore();

  /* ------------------- React Hook Form: Company Signup Form ------------------ */
  const methods = useForm<TCompanySignup>({
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
          salary: "",
          types: "",
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
  } = methods;

  // Field groups per step for selective validation
  const stepFieldMap: Record<number, (keyof TCompanySignup)[]> = {
    1: ["basicInfo"],
    2: ["openPositions"],
    3: ["benefitsAndValues"],
    4: ["avatar"],
    5: ["cover"],
    6: ["careerScopes"],
  };

  // ── Navigation Helpers ─────────────────────────────────────────
  // Handle Previous Step
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle Next Step and Final Submit
  const nextStep = async () => {
    const fieldsToValidate = stepFieldMap[step];
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (isValid) {
      if (step === totalSteps) {
        /* --------------------------------- Methods --------------------------------- */
        // ── Final Submit: Company Registration ────────────────────
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
                salary: job.salary,
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
                salary: job.salary,
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
  // ── Company Signup Effect ──────────────────────────────────
  useEffect(() => {
    if (
      cmpSignup.accessToken &&
      cmpSignup.refreshToken &&
      uploadsComplete &&
      !cmpSignup.loading &&
      !uploadAvatar.loading &&
      !uploadCover.loading
    ) {
      toast.dismiss();
      toast.success(t("signupSuccessful"), {
        duration: 1000,
      });
      setTimeout(() => router.replace("/login"), DEFAULT_REDIRECT_DELAY_MS);
    }

    const errorList = [
      { error: cmpSignup.error, message: cmpSignup.message },
      { error: uploadAvatar.error, message: uploadAvatar.message },
      { error: uploadCover.error, message: uploadCover.message },
    ];

    errorList.forEach(({ error, message }) => {
      if (error) {
        toast.dismiss();
        toast.error(t("anErrorOccurred"), {
          action: { label: t("retry"), onClick: () => {} },
        });
      }
    });
  }, [
    cmpSignup.loading,
    cmpSignup.error,
    cmpSignup.message,
    cmpSignup.refreshToken,
    cmpSignup.accessToken,
    cmpSignup.signup,
    uploadAvatar.loading,
    uploadAvatar.error,
    uploadAvatar.message,
    uploadAvatar.uploadAvatar,
    uploadCover.loading,
    uploadCover.error,
    uploadCover.message,
    uploadCover.uploadCover,
    uploadsComplete,
    router,
  ]);

  /* -------------------------------- Loading State -------------------------------- */
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

  /* ---------------------------------- Render UI ---------------------------------- */
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 px-1 py-2 tablet-lg:max-w-full tablet-lg:px-2">
      {/* Navigate Back Button Section */}
      <button
        type="button"
        onClick={() => router.push("/signup")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <LucideArrowLeft className="size-4" />
        Back to basic info
      </button>

      {/* Title Section */}
      <div>
        <TypographyH2>Sign up as company</TypographyH2>
        <TypographyMuted className="text-md">
          Find your potential candidate, Apsara Talent.
        </TypographyMuted>
      </div>

      {/* Step Progress Indicator Section */}
      <div className="w-full overflow-x-auto pb-2 mb-2">
        <div className="w-full min-w-[360px] flex items-center gap-0">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (st, index) => (
              <div key={st} className="w-full flex items-center">
                {/* Step Circle */}
                <div
                  className={`size-8 text-xs sm:size-9 sm:text-sm flex items-center justify-center rounded-full font-bold transition-all ${
                    step >= st
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {st}
                </div>
                {/* Line Between Steps (Only Render Before Last Step) */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-1 bg-muted rounded-full relative">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-300 ${
                        step > st ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Form Section */}
      <FormProvider {...methods}>
        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <BasicInfoStepForm
              register={register}
              control={control}
              errors={errors}
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

          {/* Navigation Buttons Section */}
          <div className="mt-6 mb-4 flex gap-3 sm:justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 sm:flex-initial sm:min-w-[140px]"
              >
                <LucideArrowLeft />
                Back
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <Button
              type="button"
              className="flex-1 sm:flex-initial sm:min-w-[140px]"
              onClick={nextStep}
              disabled={
                cmpSignup.loading || uploadAvatar.loading || uploadCover.loading
              }
            >
              {step === totalSteps ? "Submit" : "Next"}
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
