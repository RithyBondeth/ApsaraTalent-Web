"use client";

import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/extensions/get-error-message";
import { getRandomBadgeColor } from "@/utils/functions/get-random-badge-color";
import { LucidePlus, LucideXCircle } from "lucide-react";
import { useState } from "react";
import { IStepFormProps } from "../props";

export default function SkillReferenceStepForm({
  errors,
  setValue,
  getValues,
  trigger,
}: IStepFormProps<TEmployeeSignUp>) {
  // Utils
  const t = useTranslations("toast");

  // Skill Helpers
  const [openPopOver, setOpenPopOver] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>("");
  const initialSkills = getValues?.("skillAndReference.skills") || [];
  const [skills, setSkills] = useState<string[]>(initialSkills);

  // Handle Add New Skill
  const addSkill = async () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    // Prevent duplicates (case-insensitive)
    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) {
      toast.error(t("duplicatedSkill"), {
        description: t("pleaseInputAnotherSkill"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      return;
    }

    const updated = [...skills, trimmed];
    setSkills(updated);
    setValue?.("skillAndReference.skills", updated);

    // Trigger validation for the skills field
    await trigger?.("skillAndReference.skills");

    setSkillInput("");
    setOpenPopOver(false);
  };

  // Handle Remove Skill
  const removeSkill = async (skillToRemove: string) => {
    const updated = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updated);
    setValue?.("skillAndReference.skills", updated);
    await trigger?.("skillAndReference.skills");
  };

  return (
    <div className="w-full flex flex-col items-start gap-8">
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your skills</TypographyH4>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => {
            const { bg } = getRandomBadgeColor(skill);
            return (
              <div
                key={index}
                className={`flex items-center ${bg} pr-2 rounded-2xl`}
              >
                <Tag label={skill} />
                <LucideXCircle
                  className="text-muted-foreground cursor-pointer text-red-500"
                  width={"18px"}
                  onClick={() => removeSkill(skill)}
                />
              </div>
            );
          })}
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
        {errors?.skillAndReference?.skills && (
          <ErrorMessage>
            {getErrorMessage(errors.skillAndReference.skills)}
          </ErrorMessage>
        )}
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add your references (Optional)</TypographyH4>
        <div className="w-full flex items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
          {getValues?.("skillAndReference.resume") ? (
            <div className="flex flex-col items-start gap-2">
              <TypographyMuted className="text-xs">Resume</TypographyMuted>
              <div className="w-full flex justify-between items-center p-3 rounded-md bg-muted">
                <TypographyMuted>
                  {getValues("skillAndReference.resume").name.trim()}
                </TypographyMuted>
                <LucideXCircle
                  strokeWidth="1.3px"
                  className="text-muted-foreground cursor-pointer"
                  onClick={() =>
                    setValue?.("skillAndReference.coverLetter", undefined, {
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
                    errors?.skillAndReference?.resume,
                  )}
                />
              }
            />
          )}
          {getValues?.("skillAndReference.coverLetter") ? (
            <div className="flex flex-col items-start gap-2">
              <TypographyMuted className="text-xs">
                Cover Letter
              </TypographyMuted>
              <div className="w-full flex justify-between items-center p-3 rounded-md bg-muted">
                <TypographyMuted>
                  {getValues("skillAndReference.coverLetter").name.trim()}
                </TypographyMuted>
                <LucideXCircle
                  strokeWidth="1.3px"
                  className="text-muted-foreground cursor-pointer"
                  onClick={() =>
                    setValue?.("skillAndReference.coverLetter", undefined, {
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
                    errors?.skillAndReference?.coverLetter,
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
