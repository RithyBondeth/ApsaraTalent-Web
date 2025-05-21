"use client";

import AvatarCompanyStepForm from "@/components/company/company-signup-form/avatar-step";
import BasicInfoStepForm from "@/components/company/company-signup-form/basic-info-step";
import BenefitValueStepForm from "@/components/company/company-signup-form/benefit-value-step";
import CoverCompanyStepForm from "@/components/company/company-signup-form/cover-step";
import OpenPositionStepForm from "@/components/company/company-signup-form/open-position-step";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { companySignupSchema, TCompanySignup } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import CompanyCareerScopeStepForm from "@/components/company/company-signup-form/career-scope-step";
import { useBasicSignupDataStore } from "@/stores/apis/auth/basic-signup-data.store";
import { useToast } from "@/hooks/use-toast";
import { useCompanySignupStore } from "@/stores/apis/auth/company-signup.store";
import { useUploadCompanyAvatarStore } from "@/stores/apis/company/upload-cmp-avatar.store";
import { useUploadCompanyCoverStore } from "@/stores/apis/company/upload-cmp-cover.store";

export default function CompanySignup() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;
  const { basicSignupData } = useBasicSignupDataStore();
  const { toast } = useToast();

  const cmpSignup = useCompanySignupStore();
  const uploadAvatar = useUploadCompanyAvatarStore();
  const uploadResume = useUploadCompanyCoverStore();
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

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
          if(!basicSignupData) return;
          
          // const companyId = await cmpSignup.signup({
          //   email: basicSignupData.email!,
          //   password: basicSignupData.password!,
          //   name: data.basicInfo.name,
          //   description: data.basicInfo.description,
          //   phone: basicSignupData.phone!,
          //   industry: data.basicInfo.industry,
          //   location: data.basicInfo.location,
          //   companySize: Number(data.basicInfo.companySize),
          //   foundedYear: Number(data.basicInfo.foundedYear),
          //   openPositions: data.openPositions?.map((job) => ({
              
          //     title: job.title,
          //     description: job.description,
          //     type: '',
          //     experience: job.experienceRequirement,
          //     education: job.educationRequirement,
          //     skills: job.skills,
          //     salary: job.salary,
          //     postedDate: new Date().toISOString(),
          //     deadlineDate: job.deadlineDate.toISOString()
          //   })),
          //   values: data.benefitsAndValues.values.map((value, index) => ({ id: index + 1, label: value })),
          //   benefits: data.benefitsAndValues.benefits.map((benefit, index) => ({ id: index + 1, label: benefit })),
          //   careerScopes: data.careerScopes.map(cs => ({ id: crypto.randomUUID(), name: cs, description: "" })),
          //   availableTimes: ["FULL_TIME"],
          //   socials: []
          // }) 
        })();
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

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
