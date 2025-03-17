import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEducationStepInfo } from "../validation";
import { Input } from "@/components/ui/input";
import { LucideCalendarDays, LucideGraduationCap, LucideSchool } from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";

export default function EducationStepForm({ register }: IStepFormProps<TEducationStepInfo>) {
  return (
    <div className="w-full flex flex-col items-start gap-5">
      <TypographyH4>Add your educations information</TypographyH4>
      <LabelInput
        label="School"
        input={
          <Input
            placeholder="School"
            id="school"
            name="school"
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
            name="degree"
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
            name="year"
            prefix={<LucideCalendarDays />}
          />
        }
      />
    </div>
  );
}
