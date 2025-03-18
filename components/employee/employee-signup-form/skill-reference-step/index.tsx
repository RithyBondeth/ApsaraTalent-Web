"use client"

import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "../validation";
import Tag from "@/components/utils/tag";
import { Input } from "@/components/ui/input";
import LabelInput from "@/components/utils/label-input";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react";

export default function SkillReferenceStepForm({ register }: IStepFormProps<TEmployeeSignUp>) {
  const [openPopOver, setOpenPopOver] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col items-start gap-8">
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your skills</TypographyH4>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => (
            <Tag key={skill} label="Typescript" />
          ))}      
        </div>
        <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full" variant='secondary'>
              Add Skill
              <LucidePlus/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input placeholder="Enter your skill (e.g. PhotoShop, Microsoft World etc.)" {...register("skillAndReference.skills")}/>
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenPopOver(false)}>Cancel</Button>
              <Button>Save</Button> 
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your references</TypographyH4>
        <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
          <LabelInput
              label="Upload Resume"
              input={<Input type='file' {...register("skillAndReference.resume")} />}
          />
          <LabelInput
              label="Upload Cover Letter"
              input={<Input type='file' {...register("skillAndReference.coverLetter")}/>}
          />
        </div>
      </div>
    </div>
  );
}
