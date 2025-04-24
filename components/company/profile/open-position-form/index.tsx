"use client"

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
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function OpenPositionForm(props: IOpenPositionFormProps) {
  const { register, control, getValues } = props.form;
  const { toast } = useToast();

  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>("") 
  const initialSkill = getValues(`openPositions.${props.index}.skills`) || [];
  const [skills, setSkills] = useState<string[]>(initialSkill);

  const addSkills = () => {
    const trimmed = skillInput.trim();
    if(!trimmed) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase()
    );
    
    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Benefit",
        description: "Please input another benefit.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setSkillInput("");
      setOpenSkillPopOver(false);
      return;
    }

    const updated = [ ...skills, trimmed ];
    setSkills(updated);

    setSkillInput("");
    setOpenSkillPopOver(false);        
  }  

  const removeSkills = (skillToRemove: string) => {
    const updatedSkills = skills.filter(
      (skill) => skill !== skillToRemove
    );
    setSkills(updatedSkills);
  }


  return (
    <div className="w-full flex flex-col items-start gap-3">
      <div className="w-full flex items-center justify-between">
        <TypographyMuted>{props.positionLabel}</TypographyMuted>
        {props.isEdit && (
          <LucideTrash2 
            onClick={() => props.onRemove(props.positionId)} 
            className="cursor-pointer text-red-500"
            width={'18px'}
          />
        )}
      </div>
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
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
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Description</TypographyMuted>
          <Textarea
            placeholder={props.isEdit ? "Description" : props.description}
            id="description"
            {...register(`openPositions.${props.index}.description`)}
            className="placeholder:text-sm"
            disabled={!props.isEdit}
          />
        </div>
        <LabelInput
          label="Experience Requirement"
          input={
            <Input
              placeholder={props.isEdit ? "Experience" : props.experience}
              id="experience-requirement"
              {...register(`openPositions.${props.index}.experienceRequirement`)}
              disabled={!props.isEdit}
            />
          }
        />
        <LabelInput
          label="Education Requirement"
          input={
            <Input
              placeholder={props.isEdit ? "Education" : props.education}
              id="education-requirement"
              {...register(`openPositions.${props.index}.educationRequirement`)}
              disabled={!props.isEdit}
            />
          }
        />
        <div className="w-full flex flex-col items-start gap-3">
          <TypographyMuted className="text-xs">
            Skill Requirements
          </TypographyMuted>
          <div className="flex flex-wrap gap-2">
            {skills?.map((item, index) => (
              <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted"
            >
              <TypographySmall>{item}</TypographySmall>
              {props.isEdit && <LucideXCircle
                className="text-muted-foreground cursor-pointer text-red-500"
                width={"18px"}
                onClick={() => removeSkills(item)}
              />}
            </div>
            ))}
          </div>
          {props.isEdit && <Popover open={openSkillPopOver} onOpenChange={setOpenSkillPopOver}>
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
              value={skillInput}
            />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenSkillPopOver(false)}>
                Cancel
              </Button>
              <Button onClick={addSkills}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>}
        </div> 
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
                    <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
      </div>
    </div>
  );
}
