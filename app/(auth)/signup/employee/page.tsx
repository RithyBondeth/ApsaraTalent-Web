"use client";

import AvatarStepForm from "@/components/employee/employee-signup-form/avatar-step";
import EmployeeCareerScopeStepForm from "@/components/employee/employee-signup-form/career-scope-step";
import EducationStepForm from "@/components/employee/employee-signup-form/education-step";
import ExperienceStepForm from "@/components/employee/employee-signup-form/experience-step";
import ProfessionStepForm from "@/components/employee/employee-signup-form/profession-step";
import SkillReferenceStepForm from "@/components/employee/employee-signup-form/skill-reference-step";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { useEmployeeSignupStore } from "@/stores/apis/auth/employee-signup.store";
import { useParseResumeStore } from "@/stores/apis/auth/parse-resume.store";
import { useUploadEmployeeAvatarStore } from "@/stores/apis/employee/upload-emp-avatar.store";
import { useUploadEmployeeCoverLetter } from "@/stores/apis/employee/upload-emp-coverletter.store";
import { useUploadEmployeeResumeStore } from "@/stores/apis/employee/upload-emp-resume.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { TGender } from "@/utils/types/user/gender.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowRight, LucideCheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { makeEmployeeSignUpSchema, TEmployeeSignUp } from "./validation";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  TOAST_DURATION_MS,
} from "@/utils/constants/config.constant";

export default function EmployeeSignup() {
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
  // Upload Avatar, Resume, CoverLetter
  const uploadAvatar = useUploadEmployeeAvatarStore();
  const uploadResume = useUploadEmployeeResumeStore();
  const uploadCoverLetter = useUploadEmployeeCoverLetter();

  // SmartResumeUpload
  const { data: parsedData, file: parsedFile } = useParseResumeStore();

  // Employee Register
  const empSignup = useEmployeeSignupStore();

  /* ------------------ React Hook Form: Employee Signup Form ----------------- */
  // ── Define Schema For Employee Signup Form ─────────────────────────
  const employeeSignUpSchema = useMemo(
    () =>
      makeEmployeeSignUpSchema({
        yearsOfExperienceRequired: tv("yearsOfExperienceRequired"),
        availabilityRequired: tv("availabilityRequired"),
        endDateAfterStart: tv("endDateAfterStart"),
        startDateRequired: tv("startDateRequired"),
        endDateRequired: tv("endDateRequired"),
        graduationYearRequired: tv("graduationYearRequired"),
        atLeastOneSkill: tv("atLeastOneSkill"),
        atLeastOneCareer: tv("atLeastOneCareer"),
        fieldRequired: (field) => {
          const labels: Record<string, string> = {
            Profession: tv("fieldLabelProfession"),
            Description: tv("fieldLabelDescription"),
            Title: tv("fieldLabelTitle"),
            School: tv("fieldLabelSchool"),
            Degree: tv("fieldLabelDegree"),
          };
          return tv("fieldRequired", { field: labels[field] ?? field });
        },
        fieldTooLong: (field, max) => {
          const labels: Record<string, string> = {
            Profession: tv("fieldLabelProfession"),
            Description: tv("fieldLabelDescription"),
            Title: tv("fieldLabelTitle"),
            School: tv("fieldLabelSchool"),
            Degree: tv("fieldLabelDegree"),
          };
          return tv("fieldTooLong", { field: labels[field] ?? field, max });
        },
      }),
    [tv],
  );

  // ── Pre-fill Employee Form from Resume Parsed ──────────────────────
  const defaultFormValues = useMemo(
    (): TEmployeeSignUp => ({
      profession: {
        job: parsedData?.jobTitle ?? "",
        yearOfExperience: parsedData?.yearsOfExperience ?? "",
        availability: parsedData?.availability ?? "",
        description: parsedData?.description ?? "",
        workMode: undefined,
        noticePeriod: undefined,
        languages: [],
      },
      experience: parsedData?.experiences?.length
        ? parsedData.experiences.map((exp) => ({
            title: exp.title,
            company: exp.company ?? "",
            description: exp.description,
            startDate: exp.startDate
              ? new Date(exp.startDate)
              : ("" as unknown as Date),
            endDate: exp.endDate
              ? new Date(exp.endDate)
              : ("" as unknown as Date),
          }))
        : [],
      educations: parsedData?.educations?.length
        ? parsedData.educations.map((edu) => ({
            school: edu.school,
            degree: edu.degree,
            year: edu.year,
          }))
        : [{ school: "", degree: "", year: undefined as unknown as number }],
      skillAndReference: {
        skills: parsedData?.skills ?? [],
        resume: parsedFile ?? undefined,
        coverLetter: undefined,
      },
      avatar: null,
      careerScopes: parsedData?.careerScopes ?? [],
    }),
    [parsedData, parsedFile],
  );

  // ── Initialize Employee Form with Default Values ───────────────────
  const empForm = useForm<TEmployeeSignUp>({
    mode: "onChange",
    resolver: zodResolver(employeeSignUpSchema),
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    register,
    trigger,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = empForm;

  // ── Field Groups Per Step For Selective Validation ─────────────────
  const stepFieldMap: Record<number, (keyof TEmployeeSignUp)[]> = {
    1: ["profession"],
    2: ["experience"],
    3: ["educations"],
    4: ["skillAndReference"],
    5: ["avatar"],
    6: ["careerScopes"],
  };

  /* --------------------------------- Methods --------------------------------- */
  // ── Build Employee Payload ─────────────────────────────────────────
  // Everything the wizard collects that is not tied to how the account was
  // authenticated. Shared by the email and phone paths below so a field added
  // to the wizard cannot reach one path and silently miss the other.
  const buildEmployeePayload = (data: TEmployeeSignUp) => ({
    job: data.profession.job,
    yearsOfExperience: data.profession.yearOfExperience,
    availability: data.profession.availability,
    description: data.profession.description,
    workMode: data.profession.workMode ?? null,
    noticePeriod: data.profession.noticePeriod ?? null,
    languages: data.profession.languages ?? [],
    educations: data.educations.map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      year: new Date(edu.year, 0, 1).toISOString(),
    })),
    experiences: data.experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      description: exp.description,
      startDate: new Date(exp.startDate).toISOString(),
      endDate: new Date(exp.endDate).toISOString(),
    })),
    skills: data.skillAndReference.skills.map((skill) => ({
      name: skill,
      description: skill,
    })),
    careerScopes: data.careerScopes.map((cs) => ({
      name: cs,
      description: cs,
    })),
    socials: [],
  });

  // ── Navigation Helpers Function ────────────────────────────────────
  // Check if user has no experience (to skip step 2)
  const hasNoExperience = () =>
    getValues("profession.yearOfExperience") === "No Experience";

  // Step navigation helper – skips step 2 for no-experience users
  const resolveNextStep = (current: number) => {
    if (current === 1 && hasNoExperience()) return 3;
    return current + 1;
  };
  const resolvePrevStep = (current: number) => {
    if (current === 3 && hasNoExperience()) return 1;
    return current - 1;
  };

  // Handle Previous Step
  const prevStep = () => setStep((prev) => resolvePrevStep(prev));

  // Handle Next Step and Final Submit
  const nextStep = async () => {
    const fieldsToValidate = stepFieldMap[step];
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) return;

    // When moving away from step 1 with no experience, clear experience array
    if (step === 1 && hasNoExperience()) {
      setValue("experience", []);
    }

    if (step !== totalSteps) {
      setStep((prev) => resolveNextStep(prev));
      return;
    }

    // ── Final Submit: Employee Registration ────────────────────────────
    handleSubmit(async (data) => {
      try {
        setUploadsComplete(false);

        // Register with regular email-password
        if (basicSignupData) {
          // Signup employee first to get employeeID
          const employeeId = await empSignup.signup({
            ...buildEmployeePayload(data),
            authEmail: true,
            email: basicSignupData.email ?? null,
            password: basicSignupData.password ?? null,
            firstname: basicSignupData.firstName ?? null,
            lastname: basicSignupData.lastName ?? null,
            dob: basicSignupData.dob ?? undefined,
            username: basicSignupData.username ?? null,
            gender: (basicSignupData.gender as TGender) ?? ("other" as TGender),
            location: basicSignupData.selectedLocation ?? null,
            phone: basicSignupData.phone!,
          });

          if (!employeeId) {
            console.error("Employee ID not found after signup");
            return;
          }

          // Upload files in parallel for faster registration
          const uploadTasks: Promise<unknown>[] = [];

          if (data.avatar instanceof File)
            uploadTasks.push(
              uploadAvatar.uploadAvatar(employeeId, data.avatar),
            );

          if (data.skillAndReference.resume instanceof File)
            uploadTasks.push(
              uploadResume.uploadResume(
                employeeId,
                data.skillAndReference.resume,
              ),
            );

          if (data.skillAndReference.coverLetter instanceof File)
            uploadTasks.push(
              uploadCoverLetter.uploadCoverLetter(
                employeeId,
                data.skillAndReference.coverLetter,
              ),
            );

          await Promise.all(uploadTasks);
          setUploadsComplete(true);
          return;
        }

        // Register with phone-otp
        if (basicPhoneSignupData) {
          // Signup employee first to get employeeID
          const employeeId = await empSignup.signup({
            ...buildEmployeePayload(data),
            authEmail: false,
            email: null,
            password: null,
            firstname: null,
            lastname: null,
            dob: undefined,
            username: null,
            gender: "other" as TGender,
            location: null,
            phone: basicPhoneSignupData.phone!,
          });

          if (!employeeId) {
            console.error("Employee ID not found after signup");
            return;
          }

          // Upload files in parallel for faster registration
          const uploadTasks: Promise<unknown>[] = [];

          if (data.avatar instanceof File)
            uploadTasks.push(
              uploadAvatar.uploadAvatar(employeeId, data.avatar),
            );

          if (data.skillAndReference.resume instanceof File)
            uploadTasks.push(
              uploadResume.uploadResume(
                employeeId,
                data.skillAndReference.resume,
              ),
            );

          if (data.skillAndReference.coverLetter instanceof File)
            uploadTasks.push(
              uploadCoverLetter.uploadCoverLetter(
                employeeId,
                data.skillAndReference.coverLetter,
              ),
            );

          await Promise.all(uploadTasks);
          setUploadsComplete(true);
          return;
        }
      } catch (error) {
        console.error("Employee Registration Error:", error);
      }
    })();
  };

  /* ----------------------------------- Effects ----------------------------------- */
  // ── Employee Signup Effect ─────────────────────────────────────────
  useEffect(() => {
    if (
      empSignup.isAuthenticated &&
      uploadsComplete &&
      !empSignup.loading &&
      !uploadAvatar.loading &&
      !uploadCoverLetter.loading &&
      !uploadResume.loading
    ) {
      toast.dismiss();
      toast.success(t("signupSuccessful"), {
        duration: TOAST_DURATION_MS.SHORT,
      });
      setTimeout(() => router.replace("/feed"), DEFAULT_REDIRECT_DELAY_MS);
      return;
    }

    const errorList = [
      { error: empSignup.error, message: empSignup.message },
      { error: uploadAvatar.error, message: uploadAvatar.message },
      { error: uploadResume.error, message: uploadResume.message },
      { error: uploadCoverLetter.error, message: uploadCoverLetter.message },
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
    empSignup.loading,
    uploadAvatar.loading,
    uploadCoverLetter.loading,
    uploadResume.loading,
    uploadAvatar.error,
    empSignup.error,
    uploadCoverLetter.error,
    uploadResume.error,
    uploadCoverLetter.message,
    uploadResume.message,
    empSignup.message,
    empSignup.isAuthenticated,
    uploadsComplete,
    uploadAvatar.message,
    router,
  ]);

  /* -------------------------------- Loading States -------------------------------- */
  const isSignupLoading =
    empSignup.loading ||
    uploadAvatar.loading ||
    uploadCoverLetter.loading ||
    uploadResume.loading;

  // Signup loading title
  const signupLoadingMessage = empSignup.loading
    ? t("creatingEmployeeAccount")
    : uploadAvatar.loading
      ? t("uploadingAvatar")
      : uploadResume.loading
        ? t("uploadingResume")
        : uploadCoverLetter.loading
          ? t("uploadingCoverLetter")
          : t("processingRequest");

  /* ----------------------------------- Render UI ---------------------------------- */
  return (
    <div className="auth-wizard mx-auto flex w-full max-w-4xl flex-col gap-4 px-1 py-2 tablet-lg:max-w-full tablet-lg:px-2">
      {/* SmartResumeUpload Chip Title Section */}
      {!!parsedData && (
        <div className="auth-wizard-notice flex w-fit items-center gap-1.5 rounded-none border border-l-[4px] border-success-border border-l-success bg-success-subtle px-3 py-1.5 text-xs text-success-accent">
          <LucideCheckCircle2 size={13} className="shrink-0" />
          {t("smartUploadDataApplied")}
        </div>
      )}

      {/* Step Progress Indicator Section */}
      <div className="auth-wizard-progress w-full overflow-x-auto border border-t-[5px] border-border border-t-foreground bg-card p-4 shadow-[4px_4px_0_hsl(var(--foreground)/0.05)]">
        <div className="flex w-full min-w-[280px] items-center gap-0">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (st, index) => {
              const isSkipped =
                st === 2 &&
                empForm.watch("profession.yearOfExperience") ===
                  "no_experience";
              const isActive = step >= st && !isSkipped;
              return (
                <div key={st} className="flex w-full items-center">
                  <div
                    className={`flex size-8 items-center justify-center rounded-none text-xs font-bold transition-all sm:size-9 sm:text-sm ${
                      isSkipped
                        ? "bg-muted text-muted-foreground line-through opacity-40"
                        : isActive
                          ? "bg-primary text-primary-foreground shadow-[2px_2px_0_hsl(var(--foreground)/0.16)]"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {st}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className="relative h-1 flex-1 rounded-none bg-muted">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-none bg-primary transition-all duration-300 ${
                          step > st && !isSkipped ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Form Section */}
      <FormProvider {...empForm}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="auth-wizard-form w-full"
        >
          <div className="auth-wizard-step">
            {step === 1 && (
              <ProfessionStepForm
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
              />
            )}
            {step === 2 && (
              <ExperienceStepForm
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
                getValues={getValues}
              />
            )}
            {step === 3 && (
              <EducationStepForm
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
                getValues={getValues}
              />
            )}
            {step === 4 && (
              <SkillReferenceStepForm
                register={register}
                control={control}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
              />
            )}
            {step === 5 && (
              <AvatarStepForm
                register={register}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
              />
            )}
            {step === 6 && (
              <EmployeeCareerScopeStepForm
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
                empSignup.loading ||
                uploadAvatar.loading ||
                uploadResume.loading ||
                uploadCoverLetter.loading
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
        subTitle={t("pleaseWaitSignup")}
      />
    </div>
  );
}
