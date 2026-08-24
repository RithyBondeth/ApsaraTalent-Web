"use client";

import AvatarCompanyStepForm from "@/components/company/company-signup-form/avatar-step";
import BasicInfoStepForm from "@/components/company/company-signup-form/basic-info-step";
import BenefitValueStepForm from "@/components/company/company-signup-form/benefit-value-step";
import CompanyCareerScopeStepForm from "@/components/company/company-signup-form/career-scope-step";
import CoverCompanyStepForm from "@/components/company/company-signup-form/cover-step";
import OpenPositionStepForm from "@/components/company/company-signup-form/open-position-step";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { useCompanySignupStore } from "@/stores/apis/auth/company-signup.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  /* ------------------------------ All States -------------------------------- */
  const [step, setStep] = useState<number>(1);
  const [uploadsComplete, setUploadsComplete] = useState<boolean>(false);

  // Get User Basic Data
  const { basicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();

  /* ----------------------------- API Integration ---------------------------- */
  // Upload Avatar, Cover
  const uploadAvatar = useUploadCompanyAvatarStore();
  const uploadCover = useUploadCompanyCoverStore();

  // Company Register
  const cmpSignup = useCompanySignupStore();

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
            "founded year": tv("fieldLabelFoundedYear"),
            "experience level": tv("fieldLabelExperienceReq"),
            "position type": tv("fieldLabelType"),
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
        websiteUrl: "",
        companyType: "",
      },
      openPositions: [
        {
          title: "",
          description: "",
          experienceRequirement: "",
          educationRequirement: "",
          skills: [],
          languagesRequired: [],
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
  // ── Build Company Payload ──────────────────────────────────────
  // Everything the form collects that is not tied to how the account was
  // authenticated. Shared by the email and phone paths below so a field added
  // to the wizard cannot reach one path and silently miss the other.
  const buildCompanyPayload = (data: TCompanySignup) => ({
    name: data.basicInfo.name,
    description: data.basicInfo.description,
    industry: data.basicInfo.industry,
    location: data.basicInfo.location,
    companySize: Number(data.basicInfo.companySize),
    foundedYear: Number(data.basicInfo.foundedYear),
    websiteUrl: data.basicInfo.websiteUrl || null,
    companyType: data.basicInfo.companyType || null,
    openPositions: data.openPositions?.map((job) => ({
      title: job.title,
      description: job.description,
      type: job.types,
      experience: job.experienceRequirement,
      education: job.educationRequirement,
      skills: job.skills,
      languagesRequired: job.languagesRequired ?? [],
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryCurrency: job.salaryCurrency ?? "USD",
      workMode: job.workMode ?? null,
      location: job.location || null,
      openingsCount: job.openingsCount ?? null,
      deadlineDate: job.deadlineDate.toISOString(),
    })),
    benefits:
      data.benefitsAndValues.benefits?.map((bf) => ({ label: bf })) ?? [],
    values:
      data.benefitsAndValues.values?.map((value) => ({ label: value })) ?? [],
    careerScopes: data.careerScopes.map((cs) => ({ name: cs })),
    socials: [],
  });

  // ── Navigation Helpers Function ────────────────────────────────
  // Handle Previous Step
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle Next Step and Final Submit
  const nextStep = async () => {
    const fieldsToValidate = stepFieldMap[step];
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (isValid) {
      if (step === totalSteps) {
        // Final Submit: Company Registration
        handleSubmit(async (data) => {
          // Register with regular email-password
          if (basicSignupData) {
            // Signup company first to get companyID
            const companyId = await cmpSignup.signup({
              ...buildCompanyPayload(data),
              authEmail: true,
              email: basicSignupData.email!,
              password: basicSignupData.password!,
              phone: basicSignupData.phone!,
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
              ...buildCompanyPayload(data),
              authEmail: false,
              email: null,
              password: null,
              phone: basicPhoneSignupData.phone!,
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
      // An email signup is not finished until the address is verified, and
      // the mail now carries a code rather than a link — so this redirect is
      // the only way the person reaches the page. Phone signups have nothing
      // to verify and go straight to the feed.
      const pendingEmail = basicSignupData?.email ?? null;
      const destination = pendingEmail
        ? `/login/email-verification?email=${encodeURIComponent(pendingEmail)}`
        : "/feed";

      setTimeout(() => router.replace(destination), DEFAULT_REDIRECT_DELAY_MS);
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
    basicSignupData?.email,
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
    <div className="auth-wizard mx-auto flex w-full max-w-4xl flex-col gap-4 px-1 py-2 tablet-lg:max-w-full tablet-lg:px-2">
      {/* Step Progress Indicator Section */}
      <div className="auth-wizard-progress w-full overflow-x-auto border border-border bg-card p-4 shadow-hard">
        <div className="flex w-full min-w-[280px] items-center gap-0">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (st, index) => (
              <div key={st} className="flex w-full items-center">
                {/* Step Circle Section */}
                <div
                  className={`flex size-8 items-center justify-center rounded-none text-xs font-bold transition-all sm:size-9 sm:text-sm ${
                    step >= st
                      ? "bg-primary text-primary-foreground shadow-hard-xs"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {st}
                </div>
                {/* Line Between Steps Section (Only Render Before Last Step) */}
                {index < totalSteps - 1 && (
                  <div className="relative h-1 flex-1 rounded-none bg-muted">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-none bg-primary transition-all duration-300 ${
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
      <FormProvider {...cmpForm}>
        <form
          className="auth-wizard-form w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="auth-wizard-step">
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
          <div className="auth-wizard-actions auth-action-row mt-5">
            <AuthBackButton
              className="w-full"
              onClick={() =>
                step > 1 ? prevStep() : router.replace("/signup")
              }
            >
              {t("back")}
            </AuthBackButton>

            <Button
              type="button"
              className="w-full"
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
