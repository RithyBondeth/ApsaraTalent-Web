"use client";
import AvatarStepForm from "@/components/employee/employee-signup-form/avatar-step";
import EmployeeCareerScopeStepForm from "@/components/employee/employee-signup-form/career-scope-step";
import EducationStepForm from "@/components/employee/employee-signup-form/education-step";
import ExperienceStepForm from "@/components/employee/employee-signup-form/experience-step";
import ProfessionStepForm from "@/components/employee/employee-signup-form/profession-step";
import SkillReferenceStepForm from "@/components/employee/employee-signup-form/skill-reference-step";
import { Button } from "@/components/ui/button";
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

export default function EmployeeSignup() {
  // Utils
  const router = useRouter();

  // Employee Form Helpers
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Employee Data: Regular and Phone
  const { basicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();

  // API Integration - Employee Socials Data
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  // API Integration - Employee Signup
  const empSignup = useEmployeeSignupStore();

  // API Integration - Employee Avatar, Resume and CoverLetter
  const uploadAvatar = useUploadEmployeeAvatarStore();
  const uploadResume = useUploadEmployeeResumeStore();
  const uploadCoverLetter = useUploadEmployeeCoverLetter();
  const [uploadsComplete, setUploadsComplete] = useState<boolean>(false);

  // React Hook Form: Employee Signup Form
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

    handleSubmit(async (data) => {
      try {
        setUploadsComplete(false);

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

          console.log("Employee ID: ", employeeId);

          // Upload files sequentially to avoid race conditions
          if (data.avatar instanceof File) {
            console.log(
              "Attempting to upload avatar for employeeId:",
              employeeId,
            );
            console.log("Avatar: ", data.avatar);
            await uploadAvatar.uploadAvatar(employeeId, data.avatar);
          }

          if (data.skillAndReference.resume instanceof File) {
            console.log("Resume: ", data.skillAndReference.resume);
            await uploadResume.uploadResume(
              employeeId,
              data.skillAndReference.resume,
            );
          }

          if (data.skillAndReference.coverLetter instanceof File) {
            console.log("CoverLetter: ", data.skillAndReference.coverLetter);
            await uploadCoverLetter.uploadCoverLetter(
              employeeId,
              data.skillAndReference.coverLetter,
            );
          }

          setUploadsComplete(true);
          return;
        }

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

          console.log("Employee ID from Phone Signup: ", employeeId);

          // Upload files sequentially to avoid race conditions
          if (data.avatar instanceof File) {
            await uploadAvatar.uploadAvatar(employeeId, data.avatar);
          }

          if (data.skillAndReference.resume instanceof File) {
            await uploadResume.uploadResume(
              employeeId,
              data.skillAndReference.resume,
            );
          }

          if (data.skillAndReference.coverLetter instanceof File) {
            await uploadCoverLetter.uploadCoverLetter(
              employeeId,
              data.skillAndReference.coverLetter,
            );
          }

          setUploadsComplete(true);
        }
      } catch (error) {
        console.error("Employee signup failed:", error);
      }
    })();
  };

  // Handle Previous Step
  const prevStep = () => setStep((prev) => resolvePrevStep(prev));

  // Employee Singup Effect
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
      setTimeout(() => router.replace("/login"), 1000);
      return;
    }

    if (
      empSignup.loading ||
      uploadAvatar.loading ||
      uploadCoverLetter.loading ||
      uploadResume.loading
    ) {
      toast.dismiss();
      toast.loading("Loading...");
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

  return (
    <div className="h-[80%] w-[85%] flex flex-col items-start gap-3 tablet-lg:w-full tablet-lg:p-5">
      {/* Navigate Back Button Section */}
      <Button
        type="button"
        className="absolute top-5 left-5"
        variant="outline"
        onClick={() => router.push("/signup")}
      >
        <LucideArrowLeft />
      </Button>

      {/* Header Section */}
      <div className="mb-5">
        <TypographyH2>Sign up as employee</TypographyH2>
        <TypographyMuted className="text-md">
          Explore your dream job with our platform, Apsara Talent.
        </TypographyMuted>
      </div>

      {/* Step Progress Indicator Section */}
      <div className="w-full flex items-center mb-5">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
          (st, index) => {
            const isSkipped =
              st === 2 &&
              methods.watch("profession.yearOfExperience") === "no_experience";
            const isActive = step >= st && !isSkipped;
            return (
              <div key={st} className="w-full flex items-center">
                <div
                  className={`size-8 flex items-center justify-center rounded-full text-muted font-bold transition-all ${
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
                  <div className="flex-1 h-1 bg-muted relative">
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
          <div className="flex justify-between my-8">
            {step > 1 ? (
              <Button type="button" onClick={prevStep}>
                <LucideArrowLeft />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
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
    </div>
  );
}
