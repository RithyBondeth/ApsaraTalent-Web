"use client"
import { TEmployeeSignUp } from "@/components/employee/employee-signup-form/validation";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ProfessionStepForm from "@/components/employee/employee-signup-form/profession-step";
import ExperienceStepForm from "@/components/employee/employee-signup-form/experience-step";
import EducationStepForm from "@/components/employee/employee-signup-form/education-step";
import SkillReferenceStepForm from "@/components/employee/employee-signup-form/skill-reference-step";
import AvatarStepForm from "@/components/employee/employee-signup-form/avatar-step";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeSignup() {
    const router = useRouter();
    const [step, setStep] = useState<number>(1);
    const totalSteps = 5;

    const { handleSubmit, register } = useForm<TEmployeeSignUp>({
      mode: 'onChange',
      defaultValues: {
        profession: {
          job: "",
          yearOfExperience: 0,
          availability: "",
          description: "",
        },
        experience: [{
          title: "",
          description: "",
          startDate: "",
          endDate: "",
        }],
        educations: [{
          school: "",
          degree: "",
          year: "",
        }],
        skillAndReference: { 
          skills: [],
          resume: null,
          coverLetter: null,
        },
        avatar: "",
      },
    });

    const onSubmit = (data: TEmployeeSignUp) => {
      if (step === totalSteps) {
        console.log("Final Data:", data);
      } else {
        setStep((prev) => prev + 1);
      }
    };

    const prevStep = () => setStep((prev) => prev - 1);
   
    return (
        <div className="size-[70%] flex flex-col items-start gap-3"> 
        {/* Back Button Section */}
        <Button className="absolute top-5 left-5" variant="outline" onClick={() => router.push('/signup')}>
          <LucideArrowLeft/>
        </Button>
            {/* Title Section */}
            <div className="mb-5">
                <TypographyH2>Sign up as employee</TypographyH2>
                <TypographyMuted className="text-md">Explore your dream job with our platform, Apsara Talent.</TypographyMuted>
            </div>
            <div className="w-full">
              {/* Step Progress Section */}
              <div className="w-full flex items-center mb-5">
                {[1, 2, 3, 4, 5].map((st, index) => (
                    <div key={st} className="w-full flex items-center">
                      {/* Step Circle */}
                      <div className={`size-8 flex items-center justify-center rounded-full text-muted font-bold transition-all ${step >= st ? "bg-primary" : "bg-muted text-muted-foreground"}`}>
                        {st}
                      </div>
                      {/* Line Between Steps (Only Render Before Last Step) */}
                      {index < totalSteps - 1 && (
                        <div className="flex-1 h-1 bg-muted relative">
                          <div className={`absolute top-0 left-0 h-full transition-all duration-300 ${step > st ? "bg-primary w-full" : "bg-muted w-0"}`}/>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && <ProfessionStepForm register={register}/>}
                {step === 2 && <ExperienceStepForm register={register}/>}
                {step === 3 && <EducationStepForm register={register}/>}
                {step === 4 && <SkillReferenceStepForm register={register}/>}
                {step === 5 && <AvatarStepForm register={register}/>}
                
                {/* Next & Previous Step */}
                <div className="flex justify-between mt-8">
                  {step > 1 && <Button type='button' onClick={prevStep}>
                    <LucideArrowLeft/>
                    Back  
                  </Button>}
                  <Button type='submit'>
                    {step === 5 ? "Submit" : "Next"}
                    <LucideArrowRight/>
                  </Button>
                </div>
              </form>
            </div>
        </div>
    )
}