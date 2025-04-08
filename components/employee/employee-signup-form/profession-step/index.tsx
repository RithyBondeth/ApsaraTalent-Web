"use client";
import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availabilityConstant } from "@/utils/constant";
import { TAvailability } from "@/utils/types/availability.type";
import { useState } from "react";
import ErrorMessage from "@/components/utils/error-message";

export default function ProfessionStepForm({
  register,
  setValue,
  trigger,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  const [selectedAvailability, setSelectedAvailability] = useState<TAvailability | null>(null);

  return (
    <div className="flex flex-col items-start gap-5">
      <TypographyH4>Add profession information</TypographyH4>
      <LabelInput
        label="Profession"
        input={
          <Input
            placeholder="Profession"
            id="profession"
            {...register("profession.job")}
            validationMessage={errors!.profession?.job?.message}
          />
        }
      />
      <div className="w-full flex justify-between items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <LabelInput
          label="Year of Experience"
          input={
            <Input
              placeholder="Year of Experience"
              id="yearOfExperience"
              {...register("profession.yearOfExperience")}
              validationMessage={errors!.profession?.yearOfExperience?.message}
            />
          }
        />
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">Availability</TypographyMuted>
            <Select
              onValueChange={(value: TAvailability) => {
                  setSelectedAvailability(value)
                  setValue?.("profession.availability", value, { shouldValidate: true });  
                  trigger?.("profession.availability");      
                } 
              }
              value={selectedAvailability || ""}
            >
              <SelectTrigger className="h-12 text-muted-foreground">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityConstant.map((availability) => (
                  <SelectItem key={availability.id} value={availability.value}>
                    {availability.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
         <ErrorMessage>{errors!.profession?.availability?.message}</ErrorMessage>
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-1">
        <TypographyMuted className="text-xs">Description</TypographyMuted>
        <div className="w-full flex flex-col items-start gap-2">
          <Textarea
            placeholder="Description"
            {...register("profession.description")}
            className="placeholder:text-sm"
          />
          <ErrorMessage>{errors!.profession?.description?.message}</ErrorMessage>
        </div>
      </div>
    </div>
  );
}
