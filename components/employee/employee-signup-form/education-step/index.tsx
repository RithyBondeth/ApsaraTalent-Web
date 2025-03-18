import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "../validation";
import { Input } from "@/components/ui/input";
import { LucideCalendarDays, LucideGraduationCap, LucidePlus, LucideSchool } from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";

export default function EducationStepForm({ register }: IStepFormProps<TEmployeeSignUp>) {
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
          />
        }
      />
      <div className="w-full flex justify-end">
        <Button variant='secondary' onClick={() => { alert('Add More') }}>
          Add More
          <LucidePlus/>
        </Button>
      </div>
    </div>
  );
}
