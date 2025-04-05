"use client";

import { useState } from "react";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import LabelInput from "@/components/utils/label-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LucidePlus, LucideXCircle } from "lucide-react";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { getErrorMessage } from "@/utils/get-error-message";

export default function SkillReferenceStepForm({
  errors,
  setValue,
  getValues,
  trigger
}: IStepFormProps<TEmployeeSignUp>) {
  const [openPopOver, setOpenPopOver] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const initialSkills = getValues?.("skillAndReference.skills") || [];
  const [skills, setSkills] = useState<string[]>(initialSkills);

  const addSkill = async () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const updated = [...skills, trimmed];
    setSkills(updated);

    setValue?.("skillAndReference.skills", updated);

    // Trigger validation for the skills field
    await trigger?.("skillAndReference.skills");

    setSkillInput("");
    setOpenPopOver(false);
  };

  const removeSkill = async (skillToRemove: string) => {
    const updated = skills.filter(skill => skill !== skillToRemove);
    setSkills(updated);
    setValue?.("skillAndReference.skills", updated);
    await trigger?.("skillAndReference.skills");
  };

  return (
    <div className="w-full flex flex-col items-start gap-8">
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your skills</TypographyH4>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-3xl bg-muted">
              <TypographyMuted className="text-xs">{skill}</TypographyMuted>
              <LucideXCircle className="text-muted-foreground cursor-pointer" width={'18px'} onClick={() => removeSkill(skill)}/>
            </div>
          ))}
        </div>
        <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full text-xs" variant="secondary">
              Add Skill
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input
              placeholder="Enter your skill (e.g. PhotoShop, Figma)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenPopOver(false)}>
                Cancel
              </Button>
              <Button onClick={addSkill}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
        {/* {errors?.skillAndReference?.skills && errors.skillAndReference.skills.map((item, i) => (
          <TypographySmall className="text-xs text-red-500" key={i}>
            {item?.message}
          </TypographySmall>
        ))} */}
      </div>

      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your references</TypographyH4>
        <div className="w-full flex items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
          {getValues?.("skillAndReference.resume") ? (
            <div className="flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">Resume</TypographyMuted>
            <div className="w-full flex justify-between items-center p-3 rounded-md bg-muted">
              <TypographyMuted>{getValues('skillAndReference.resume').name.trim()}</TypographyMuted>
              <LucideXCircle strokeWidth='1.3px' className="text-muted-foreground cursor-pointer"
                onClick={() =>
                  setValue?.("skillAndReference.resume", undefined as any, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>
          ) : (
            <LabelInput
              label="Upload Resume"
              input={
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && setValue) {
                      setValue("skillAndReference.resume", file, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  validationMessage={getErrorMessage(
                    errors?.skillAndReference?.resume
                  )}
                />
              }
            />
          )}
          {getValues?.("skillAndReference.coverLetter") ? (
            <div className="flex flex-col items-start gap-2">
              <TypographyMuted className="text-xs">Cover Letter</TypographyMuted>
              <div className="w-full flex justify-between items-center p-3 rounded-md bg-muted">
              <TypographyMuted>{getValues('skillAndReference.coverLetter').name.trim()}</TypographyMuted>
                <LucideXCircle strokeWidth='1.3px' className="text-muted-foreground cursor-pointer"
                  onClick={() =>
                    setValue?.("skillAndReference.coverLetter", undefined as any, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <LabelInput
              label="Upload Cover Letter"
              input={
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && setValue) {
                      setValue("skillAndReference.coverLetter", file, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  validationMessage={getErrorMessage(
                    errors?.skillAndReference?.coverLetter
                  )}
                />
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
