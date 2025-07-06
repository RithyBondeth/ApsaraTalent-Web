"use client";

import AvatarCompanyStepForm from "@/components/company/company-signup-form/avatar-step";
import BasicInfoStepForm from "@/components/company/company-signup-form/basic-info-step";
import BenefitValueStepForm from "@/components/company/company-signup-form/benefit-value-step";
import CoverCompanyStepForm from "@/components/company/company-signup-form/cover-step";
import OpenPositionStepForm from "@/components/company/company-signup-form/open-position-step";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCheck,
  LucideInfo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { companySignupSchema, TCompanySignup } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import CompanyCareerScopeStepForm from "@/components/company/company-signup-form/career-scope-step";
import { useBasicSignupDataStore } from "@/stores/contexts/basic-signup-data.store";
import { useToast } from "@/hooks/use-toast";
import { useCompanySignupStore } from "@/stores/apis/auth/company-signup.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { ClipLoader } from "react-spinners";
import { ToastAction } from "@/components/ui/toast";
import { useBasicPhoneSignupDataStore } from "@/stores/contexts/basic-phone-signup-data.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";

export default function CompanySignup() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;
  const { basicSignupData } = useBasicSignupDataStore();
  const { basicPhoneSignupData } = useBasicPhoneSignupDataStore();
  const googleUserData = useGoogleLoginStore();
  const githubUserData = useGithubLoginStore();
  const linkedInUserData = useLinkedInLoginStore();
  const facebookUserData = useFacebookLoginStore();

  const { toast } = useToast();
  const cmpSignup = useCompanySignupStore();
  const uploadAvatar = useUploadCompanyAvatarStore();
  const uploadCover = useUploadCompanyCoverStore();
  const [uploadsComplete, setUploadsComplete] = useState<boolean>(false);

  const methods = useForm<TCompanySignup>({
    mode: "onChange",
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
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

  // Handles next step or final submit
  const nextStep = async () => {
    const fieldsToValidate = stepFieldMap[step];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (step === totalSteps) {
        handleSubmit(async (data) => {
          if (basicSignupData) {
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
              benefits: data.benefitsAndValues.benefits.map((bf) => ({
                label: bf,
              })),
              values: data.benefitsAndValues.values.map((value) => ({
                label: value,
              })),
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

            if (data.avatar instanceof File) {
              uploadTasks.push(
                uploadAvatar.uploadAvatar(companyId, data.avatar)
              );
            }

            if (data.cover instanceof File) {
              uploadTasks.push(uploadCover.uploadCover(companyId, data.cover));
            }

            await Promise.all(uploadTasks);
            setUploadsComplete(true);
          }

          if (basicPhoneSignupData) {
            const companyId = await cmpSignup.signup({
              authEmail: false,
              email: null,
              password: null,
              name: data.basicInfo.description,
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
              benefits: data.benefitsAndValues.benefits.map((bf) => ({
                label: bf,
              })),
              values: data.benefitsAndValues.values.map((value) => ({
                label: value,
              })),
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

            if (data.avatar instanceof File) {
              uploadTasks.push(
                uploadAvatar.uploadAvatar(companyId, data.avatar)
              );
            }

            if (data.cover instanceof File) {
              uploadTasks.push(uploadCover.uploadCover(companyId, data.cover));
            }

            await Promise.all(uploadTasks);
            setUploadsComplete(true);
          }
        })();
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (
      cmpSignup.accessToken &&
      cmpSignup.refreshToken &&
      uploadsComplete &&
      !cmpSignup.loading &&
      !uploadAvatar.loading &&
      !uploadCover.loading
    ) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <LucideCheck />
            <TypographySmall className="font-medium leading-relaxed">
              {cmpSignup.message}
            </TypographySmall>
          </div>
        ),
        duration: 1000,
      });
      setTimeout(() => router.replace("/login"), 1000);
    }

    if (cmpSignup.loading || uploadAvatar.loading || uploadCover.loading) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <ClipLoader />
            <TypographySmall className="font-medium">
              Loading...
            </TypographySmall>
          </div>
        ),
      });
    }

    const errors = [
      { error: cmpSignup.error, message: cmpSignup.message },
      { error: uploadAvatar.error, message: uploadAvatar.message },
      { error: uploadCover.error, message: uploadCover.message },
    ];

    errors.forEach(({ error, message }) => {
      if (error) {
        toast({
          variant: "destructive",
          description: (
            <div className="flex items-center gap-2">
              <LucideInfo />
              <TypographySmall className="font-medium leading-relaxed">
                {message}
              </TypographySmall>
            </div>
          ),
          action: <ToastAction altText="Try again">Retry</ToastAction>,
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
  ]);

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
    linkedInUserData,
    githubUserData,
    facebookUserData,
  ]);

  return (
    <div className="h-[80%] w-[85%] flex flex-col items-start gap-3 tablet-lg:w-full tablet-lg:p-5 tablet-xl:mb-5">
      {/* Back Button Section */}
      <Button
        className="absolute top-5 left-5"
        variant="outline"
        onClick={() => router.push("/signup")}
      >
        <LucideArrowLeft />
      </Button>
      {/* Title Section */}
      <div className="mb-5">
        <TypographyH2>Sign up as company</TypographyH2>
        <TypographyMuted className="text-md">
          Find your potential candidate, Apsara Talent.
        </TypographyMuted>
      </div>
      <div className="w-full">
        {/* Step Progress Section */}
        <div className="w-full flex items-center mb-5">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (st, index) => (
              <div key={st} className="w-full flex items-center">
                {/* Step Circle */}
                <div
                  className={`size-8 flex items-center justify-center rounded-full text-muted font-bold transition-all ${
                    step >= st ? "bg-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {st}
                </div>
                {/* Line Between Steps (Only Render Before Last Step) */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-1 bg-muted relative">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                        step > st ? "bg-primary w-full" : "bg-muted w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Form Section */}
        <FormProvider {...methods}>
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <BasicInfoStepForm
                register={register}
                setValue={setValue}
                trigger={trigger}
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
                errors={errors}
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

            {/* Next & Previous Step */}
            {/* Navigation Buttons */}
            <div className="flex justify-between my-8">
              {step > 1 && (
                <Button type="button" onClick={prevStep}>
                  <LucideArrowLeft />
                  Back
                </Button>
              )}
              <Button type="button" onClick={nextStep}>
                {step === totalSteps ? "Submit" : "Next"}
                <LucideArrowRight />
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
