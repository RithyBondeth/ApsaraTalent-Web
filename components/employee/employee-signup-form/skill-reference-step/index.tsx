import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { IStepFormProps } from "../props";
import { TSkillReferenceStepInfo } from "../validation";
import Tag from "@/components/utils/tag";
import { Input } from "@/components/ui/input";
import LabelInput from "@/components/utils/label-input";

export default function SkillReferenceStepForm({ register }: IStepFormProps<TSkillReferenceStepInfo>) {
  return (
    <div className="w-full flex flex-col items-start gap-8">
      <div className="flex flex-col items-start gap-3">
        <TypographyH4>Add your skills</TypographyH4>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => (
            <Tag key={skill} label="Typescript" />
          ))}
          
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your references</TypographyH4>
        <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
          <LabelInput
              label="Upload Resume"
              input={<Input type='file'/>}
          />
          <LabelInput
              label="Upload Cover Letter"
              input={<Input type='file'/>}
          />
        </div>
      </div>
    </div>
  );
}
