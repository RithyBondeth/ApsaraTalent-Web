"use client";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ProfessionStepForm from "@/components/employee/employee-signup-form/profession-step";
import ExperienceStepForm from "@/components/employee/employee-signup-form/experience-step";
import EducationStepForm from "@/components/employee/employee-signup-form/education-step";
import SkillReferenceStepForm from "@/components/employee/employee-signup-form/skill-reference-step";
import AvatarStepForm from "@/components/employee/employee-signup-form/avatar-step";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { employeeSignUpSchema, TEmployeeSignUp } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EmployeeSignup() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  const methods = useForm<TEmployeeSignUp>({
    mode: "onChange",
    resolver: zodResolver(employeeSignUpSchema),
    defaultValues: {
      experience: [
        {
          title: "",
          description: "",
          startDate: "" as unknown as Date,
          endDate: "" as unknown as Date,
        },
      ],
      skillAndReference: {
        skills: [], 
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
    formState: { errors, isSubmitted },
  } = methods;

  // Field groups per step for selective validation
  const stepFieldMap: Record<number, (keyof TEmployeeSignUp)[]> = {
    1: ["profession"],
    2: ["experience"],
    3: ["educations"],
    4: ["skillAndReference"],
    5: ["avatar"],
  };

  // Handles next step or final submit
  const nextStep = async () => {
    const fieldsToValidate = stepFieldMap[step];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (step === totalSteps) {
        handleSubmit((data) => {
          console.log("Final Data:", data);
          router.push("/signup/career-scope");
        })();
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="h-[80%] w-[85%] flex flex-col items-start gap-3 tablet-lg:w-full tablet-lg:p-5">
      {/* Back to main signup page */}
      <Button
        className="absolute top-5 left-5"
        variant="outline"
        onClick={() => router.push("/signup")}
      >
        <LucideArrowLeft />
      </Button>

      {/* Header */}
      <div className="mb-5">
        <TypographyH2>Sign up as employee</TypographyH2>
        <TypographyMuted className="text-md">
          Explore your dream job with our platform, Apsara Talent.
        </TypographyMuted>
      </div>

      {/* Step progress indicator */}
      <div className="w-full flex items-center mb-5">
        {[1, 2, 3, 4, 5].map((st, index) => (
          <div key={st} className="w-full flex items-center">
            <div
              className={`size-8 flex items-center justify-center rounded-full text-muted font-bold transition-all ${
                step >= st ? "bg-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {st}
            </div>
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
        ))}
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          {step === 1 && (
            <ProfessionStepForm
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
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
  );
}
