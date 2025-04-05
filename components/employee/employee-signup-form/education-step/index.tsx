import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Input } from "@/components/ui/input";
import { LucideCalendarDays, LucideGraduationCap, LucidePlus, LucideSchool } from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";

export default function EducationStepForm({ register, errors }: IStepFormProps<TEmployeeSignUp>) {
  return (
    <div className="w-full flex flex-col items-start gap-5">
      <TypographyH4>Add your educations information</TypographyH4>
      <LabelInput
        label="School"
        input={
          <Input
            placeholder="School"
            id="school"
            {...register(`educations.${0}.school`)}
            prefix={<LucideSchool />}
            validationMessage={errors!.educations?.[0]?.school?.message}
          />
        }
      />
      <LabelInput
        label="Degree"
        input={
          <Input
            placeholder="Degree"
            id="degree"
            {...register(`educations.${0}.degree`)}
            prefix={<LucideGraduationCap />}
            validationMessage={errors!.educations?.[0]?.degree?.message}
          />
        }
      />
      <LabelInput
        label="Graduation Year"
        input={
          <Input
            placeholder="Year"
            id="year"
            {...register(`educations.${0}.year`)} 
            prefix={<LucideCalendarDays />}
            validationMessage={errors!.educations?.[0]?.year?.message}
          />
        }
      />
      <div className="w-full flex justify-end">
        <Button variant='secondary' className="text-xs" onClick={() => { alert('Add More') }}>
          Add More
          <LucidePlus/>
        </Button>
      </div>
    </div>
  );
}
