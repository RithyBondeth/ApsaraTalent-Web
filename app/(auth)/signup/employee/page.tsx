"use client";

import AvatarStepForm from "@/components/employee/employee-signup-form/avatar-step";
import EmployeeCareerScopeStepForm from "@/components/employee/employee-signup-form/career-scope-step";
import EducationStepForm from "@/components/employee/employee-signup-form/education-step";
import ExperienceStepForm from "@/components/employee/employee-signup-form/experience-step";
import ProfessionStepForm from "@/components/employee/employee-signup-form/profession-step";
import SkillReferenceStepForm from "@/components/employee/employee-signup-form/skill-reference-step";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useEmployeeSignupStore } from "@/stores/apis/auth/employee-signup.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useUploadEmployeeAvatarStore } from "@/stores/apis/employee/upload-emp-avatar.store";
import { useUploadEmployeeCoverLetter } from "@/stores/apis/employee/upload-emp-coverletter.store";
import { useUploadEmployeeResumeStore } from "@/stores/apis/employee/upload-emp-resume.store";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { TGender } from "@/utils/types/gender.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { employeeSignUpSchema, TEmployeeSignUp } from "./validation";
import { DEFAULT_REDIRECT_DELAY_MS } from "@/utils/constants/config.constant";

export default function EmployeeSignup() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;
  const [uploadsComplete, setUploadsComplete] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  // Get user basic data from Basic, Phone, Google, Github, LinkedIn, Facebook
  const { basicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  // Upload Avatar, Resume, CoverLetter
  const uploadAvatar = useUploadEmployeeAvatarStore();
  const uploadResume = useUploadEmployeeResumeStore();
  const uploadCoverLetter = useUploadEmployeeCoverLetter();

  // Employee Register
  const empSignup = useEmployeeSignupStore();

  /* ------------------ React Hook Form: Employee Signup Form ----------------- */
  const methods = useForm<TEmployeeSignUp>({
    mode: "onChange",
    resolver: zodResolver(employeeSignUpSchema),
    defaultValues: {
      profession: {
        job: "",
        yearOfExperience: "",
        availability: "",
        description: "",
      },
      experience: [],
      educations: [
        {
          school: "",
          degree: "",
          year: undefined as unknown as number,
        },
      ],
      skillAndReference: {
        skills: [],
        resume: undefined,
        coverLetter: undefined,
      },
      avatar: null,
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
  const stepFieldMap: Record<number, (keyof TEmployeeSignUp)[]> = {
    1: ["profession"],
    2: ["experience"],
    3: ["educations"],
    4: ["skillAndReference"],
    5: ["avatar"],
    6: ["careerScopes"],
  };

  // ── Navigation Helpers ─────────────────────────────────────────
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

    /* --------------------------------- Methods --------------------------------- */
    // ── Final Submit: Employee Registration ────────────────────────────
    handleSubmit(async (data) => {
      try {
        setUploadsComplete(false);

        // Register with regular email-password
        if (basicSignupData) {
          // Signup employee first to get employeeID
          const employeeId = await empSignup.signup({
            authEmail: true,
            email: basicSignupData.email ?? null,
            password: basicSignupData.password ?? null,
            firstname: basicSignupData.firstName ?? null,
            lastname: basicSignupData.lastName ?? null,
            dob: basicSignupData.dob ?? undefined,
            username: basicSignupData.username ?? null,
            gender: (basicSignupData.gender as TGender) ?? ("other" as TGender),
            job: data.profession.job,
            yearsOfExperience: data.profession.yearOfExperience,
            availability: data.profession.availability,
            description: data.profession.description,
            location: basicSignupData.selectedLocation ?? null,
            phone: basicSignupData.phone!,
            educations: data.educations.map((edu) => ({
              school: edu.school,
              degree: edu.degree,
              year: new Date(edu.year, 0, 1).toISOString(),
            })),
            experiences: data.experience.map((exp) => ({
              title: exp.title,
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

          if (!employeeId) {
            console.error("Employee ID not found after signup");
            return;
          }

          // Upload files avatar, resume and coverLetter
          if (data.avatar instanceof File)
            await uploadAvatar.uploadAvatar(employeeId, data.avatar);

          if (data.skillAndReference.resume instanceof File)
            await uploadResume.uploadResume(
              employeeId,
              data.skillAndReference.resume,
            );

          if (data.skillAndReference.coverLetter instanceof File)
            await uploadCoverLetter.uploadCoverLetter(
              employeeId,
              data.skillAndReference.coverLetter,
            );

          setUploadsComplete(true);
          return;
        }

        // Register with phone-otp
        if (basicPhoneSignupData) {
          // Signup employee first to get employeeID
          const employeeId = await empSignup.signup({
            authEmail: false,
            email: null,
            password: null,
            firstname: null,
            lastname: null,
            dob: undefined,
            username: null,
            gender: "other" as TGender,
            job: data.profession.job,
            yearsOfExperience: data.profession.yearOfExperience,
            availability: data.profession.availability,
            description: data.profession.description,
            location: null,
            phone: basicPhoneSignupData.phone!,
            educations: data.educations.map((edu) => ({
              school: edu.school,
              degree: edu.degree,
              year: new Date(edu.year).toISOString(),
            })),
            experiences: data.experience.map((exp) => ({
              title: exp.title,
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

          if (!employeeId) {
            console.error("Employee ID not found after signup");
            return;
          }

          // Upload files sequentially to avoid race conditions
          if (data.avatar instanceof File)
            await uploadAvatar.uploadAvatar(employeeId, data.avatar);

          if (data.skillAndReference.resume instanceof File)
            await uploadResume.uploadResume(
              employeeId,
              data.skillAndReference.resume,
            );

          if (data.skillAndReference.coverLetter instanceof File)
            await uploadCoverLetter.uploadCoverLetter(
              employeeId,
              data.skillAndReference.coverLetter,
            );

          setUploadsComplete(true);
          return;
        }
      } catch (error) {
        console.error("Employee Registration Error:", error);
      }
    })();
  };

  /* --------------------------------- Effects --------------------------------- */
  // ── Employee Signup Effect ───────────────────────────────────────
  useEffect(() => {
    if (
      empSignup.accessToken &&
      empSignup.refreshToken &&
      uploadsComplete &&
      !empSignup.loading &&
      !uploadAvatar.loading &&
      !uploadCoverLetter.loading &&
      !uploadResume.loading
    ) {
      toast.dismiss();
      toast.success(empSignup.message ?? "Signup successful!", {
        duration: 1000,
      });
      setTimeout(() => router.replace("/login"), DEFAULT_REDIRECT_DELAY_MS);
      return;
    }

    const errorList = [
      { error: empSignup.error, message: empSignup.message },
      { error: uploadAvatar.error, message: uploadAvatar.message },
      { error: uploadResume.error, message: uploadResume.message },
      { error: uploadCoverLetter.error, message: uploadCoverLetter.message },
    ];

    errorList.forEach(({ error, message }) => {
      if (error) {
        toast.dismiss();
        toast.error(message ?? "An error occurred", {
          action: { label: "Retry", onClick: () => {} },
        });
      }
    });
  }, [
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
    empSignup.accessToken,
    empSignup.refreshToken,
    uploadsComplete,
    uploadAvatar.message,
    router,
  ]);

  // Log Basic Signup Data: Regular, Phone and Socials
  useEffect(() => {
    console.log("Basic Signup Data: ", basicSignupData);
    console.log("Basic Phone Signup Data: ", basicPhoneSignupData);
    console.log("Basic Google Signup Data: ", {
      firstname: googleUserData.firstname,
      lastname: googleUserData.lastname,
      email: googleUserData.email,
      picture: googleUserData.picture,
      role: googleUserData.role,
    });
    console.log("Basic Github Signup Data: ", {
      username: githubUserData.username,
      email: githubUserData.email,
      picture: githubUserData.picture,
      role: githubUserData.role,
    });
    console.log("Basic LinkedIn Signup Data: ", {
      firstname: linkedInUserData.firstname,
      lastname: linkedInUserData.lastname,
      email: linkedInUserData.email,
      picture: linkedInUserData.picture,
      role: linkedInUserData.role,
    });
    console.log("Basic Facebook Signup Data: ", {
      firstname: facebookUserData.firstname,
      lastname: facebookUserData.lastname,
      email: facebookUserData.email,
      picture: facebookUserData.picture,
      role: facebookUserData.role,
    });
  }, [
    basicSignupData,
    basicPhoneSignupData,
    googleUserData,
    githubUserData,
    linkedInUserData,
    facebookUserData,
  ]);

  /* -------------------------------- Loading States -------------------------------- */
  const isSignupLoading =
    empSignup.loading ||
    uploadAvatar.loading ||
    uploadCoverLetter.loading ||
    uploadResume.loading;

  // Signup loading title
  const signupLoadingMessage = empSignup.loading
    ? "Creating your employee account..."
    : uploadAvatar.loading
      ? "Uploading profile avatar..."
      : uploadResume.loading
        ? "Uploading resume..."
        : uploadCoverLetter.loading
          ? "Uploading cover letter..."
          : "Processing your request...";

  /* ----------------------------------- Render UI ----------------------------------- */
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-start gap-4 px-1 py-2 tablet-lg:max-w-full tablet-lg:px-2">
      {/* Navigate Back Button Section */}
      <Button
        type="button"
        className="mb-1"
        variant="outline"
        onClick={() => router.push("/signup")}
      >
        <LucideArrowLeft />
      </Button>

      {/* Header Section */}
      <div className="mb-2">
        <TypographyH2>Sign up as employee</TypographyH2>
        <TypographyMuted className="text-md">
          Explore your dream job with our platform, Apsara Talent.
        </TypographyMuted>
      </div>

      {/* Step Progress Indicator Section */}
      <div className="w-full overflow-x-auto pb-1 mb-4">
        <div className="w-full min-w-[360px] flex items-center">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (st, index) => {
              const isSkipped =
                st === 2 &&
                methods.watch("profession.yearOfExperience") ===
                  "no_experience";
              const isActive = step >= st && !isSkipped;
              return (
                <div key={st} className="w-full flex items-center">
                  <div
                    className={`size-7 text-xs sm:size-8 sm:text-sm flex items-center justify-center rounded-full text-muted font-bold transition-all ${
                      isSkipped
                        ? "bg-muted text-muted-foreground opacity-40 line-through"
                        : isActive
                          ? "bg-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {st}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className="flex-1 h-0.5 sm:h-1 bg-muted relative">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                          step > st && !isSkipped
                            ? "bg-primary w-full"
                            : "bg-muted w-0"
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
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          {step === 1 && (
            <ProfessionStepForm
              register={register}
              control={control}
              errors={errors}
            />
          )}
          {step === 2 && (
            <ExperienceStepForm
              register={register}
              errors={errors}
              control={control}
            />
          )}
          {step === 3 && (
            <EducationStepForm
              register={register}
              errors={errors}
              control={control}
            />
          )}
          {step === 4 && (
            <SkillReferenceStepForm
              register={register}
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

          {/* Next & Previous Step Section */}
          {/* Navigation Buttons Section */}
          <div className="my-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <Button
                type="button"
                onClick={prevStep}
                className="w-full sm:w-auto"
              >
                <LucideArrowLeft />
                Back
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={nextStep}
              disabled={
                empSignup.loading ||
                uploadAvatar.loading ||
                uploadResume.loading ||
                uploadCoverLetter.loading
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
        subTitle="Please wait while we complete your employee signup."
      />
    </div>
  );
}
