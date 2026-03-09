"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LabelInput from "@/components/utils/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IOpenPositionFormProps } from "./props";
import { Controller } from "react-hook-form";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LucidePlus, LucideTrash2, LucideXCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Tag from "@/components/utils/tag";
import { getRandomBadgeColor } from "@/utils/extensions/get-random-badge-color";

export default function OpenPositionForm(props: IOpenPositionFormProps) {
  // Utils
  const { register, control, getValues, setValue } = props.form;
  const { toast } = useToast();

  // Skill States
  const initialSkill = getValues(`openPositions.${props.index}.skills`) || "";
  const [skills, setSkills] = useState<string>(initialSkill);
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  // Handle Add Skill
  const addSkill = () => {
    const trimmed = skillInput?.trim();
    if (!trimmed) return;

    const currentSkillsArray = skills
      ? skills.split(", ").filter((s) => s.trim() !== "")
      : [];

    const alreadyExists = currentSkillsArray.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Skill",
        description: "This skill already exists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setSkillInput(null);
      setOpenSkillPopOver(false);
      return;
    }

    const updatedSkills = [...currentSkillsArray, trimmed].join(", ");
    setSkills(updatedSkills);

    setValue(`openPositions.${props.index}.skills`, updatedSkills, {
      shouldDirty: true,
    });

    setSkillInput(null);
    setOpenSkillPopOver(false);
  };

  // Handle Remove Skill
  const removeSkill = (skillToRemove: string) => {
    const updatedSkillsArray = skills
      .split(", ")
      .filter((skill) => skill !== skillToRemove);
    const updatedSkills = updatedSkillsArray.join(", ");

    setSkills(updatedSkills);

    setValue(`openPositions.${props.index}.skills`, updatedSkills, {
      shouldDirty: true,
    });
  };

  return (
    <div className="w-full flex flex-col items-start gap-3">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
        <TypographyMuted>Position {Number(props.index) + 1}</TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            onClick={props.onRemove}
            className="cursor-pointer text-red-500"
            width={"18px"}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
        {/* Title Section */}
        <LabelInput
          label="Title"
          input={
            <Input
              placeholder={props.isEdit ? "Title" : props.title}
              id="title"
              {...register(`openPositions.${props.index}.title`)}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Description Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Description</TypographyMuted>
          <Textarea
            autoResize
            placeholder={props.isEdit ? "Description" : props.description}
            id="description"
            {...register(`openPositions.${props.index}.description`)}
            className="placeholder:text-sm"
            disabled={!props.isEdit}
            validationMessage={
              props.form.formState.errors?.openPositions?.[props.index]
                ?.description?.message
            }
          />
        </div>
        {/* Availability Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Type</TypographyMuted>
          <Controller
            name={`openPositions.${props.index}.type`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!props.isEdit}
              >
                <SelectTrigger className="h-12 text-muted-foreground">
                  <SelectValue placeholder={"Select Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"full_time"} value={"full_time"}>
                    Full Time
                  </SelectItem>
                  <SelectItem key={"part_time"} value={"part_time"}>
                    Part Time
                  </SelectItem>
                  <SelectItem key={"contract"} value={"contract"}>
                    Contract
                  </SelectItem>
                  <SelectItem key={"internship"} value={"internship"}>
                    Internship
                  </SelectItem>
                  <SelectItem key={"remote"} value={"remote"}>
                    Remote
                  </SelectItem>
                  <SelectItem key={"freelance"} value={"freelance"}>
                    Freelance
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Experience Requirement Section */}
        <LabelInput
          label="Experience Requirements"
          input={
            <Input
              placeholder={
                props.isEdit ? "Experience" : props.experienceReqirement
              }
              id="experience-requirement"
              {...register(
                `openPositions.${props.index}.experienceRequirement`,
              )}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Education Requirement Section */}
        <LabelInput
          label="Education Requirements"
          input={
            <Input
              placeholder={
                props.isEdit ? "Education" : props.educationRequirement
              }
              id="education-requirement"
              {...register(`openPositions.${props.index}.educationRequirement`)}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Skill Section */}
        <div className="w-full flex flex-col items-start gap-3">
          <TypographyMuted className="text-xs">
            Skill Requirements
          </TypographyMuted>
          {/* Skill List Section */}
          <div className="flex flex-wrap gap-2">
            {skills &&
              skills.length > 0 &&
              skills.split(", ").map((item, index) => {
                const { bg } = getRandomBadgeColor(item);
                return (
                  <div
                    key={index}
                    className={`flex items-center ${props.isEdit && `${bg} pr-2 rounded-2xl`}`}
                  >
                    <Tag label={item} />
                    {props.isEdit && (
                      <LucideXCircle
                        className="text-muted-foreground cursor-pointer text-red-500"
                        width={"18px"}
                        onClick={() => removeSkill(item)}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          {/* Skill Poppver Section */}
          {props.isEdit && (
            <Popover open={openSkillPopOver} onOpenChange={setOpenSkillPopOver}>
              {/* Add Skill Section */}
              <PopoverTrigger asChild>
                <Button className="w-full text-xs" variant="secondary">
                  Add skill
                  <LucidePlus />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                <Input
                  placeholder="Enter your skill (e.g. Figma, Photo shop etc.)"
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <div className="flex items-center gap-1 [&>button]:text-xs">
                  <Button
                    variant="outline"
                    onClick={() => setOpenSkillPopOver(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addSkill}>Save</Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {/* Salary Range Section */}
        <LabelInput
          label="Salary Range"
          input={
            <Input
              placeholder={props.isEdit ? "Salary Range" : props.salary}
              id="salary-range"
              {...register(`openPositions.${props.index}.salary`)}
              disabled={!props.isEdit}
            />
          }
        />
        <LabelInput
          className="hidden"
          label="Open Position ID"
          input={
            <Input
              placeholder={props.isEdit ? "ID" : props.positionUUID}
              id="uuid"
              {...register(`openPositions.${props.index}.uuid`)}
              disabled={!props.isEdit}
            />
          }
        />
        {/* DeadlineDate Section */}
        <div className="w-full flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">Deadline Date</TypographyMuted>
          <Controller
            control={control}
            name={`openPositions.${props.index}.deadlineDate`}
            render={({ field, fieldState }) => (
              <>
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  disabled={!props.isEdit}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
