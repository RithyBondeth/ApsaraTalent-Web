"use client";

import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/error-message";
import LabelInput from "@/components/utils/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { locationConstant } from "@/utils/constant";
import { TLocations } from "@/utils/types/location.type";
import { useState } from "react";

export default function BasicInfoStepForm({
  register,
  setValue,
  trigger,
  errors,
}: IStepFormProps<TCompanySignup>) {
  const [selectedLocation, setSelectedLocation] = useState<TLocations | null>(
    null
  );

  return (
    <div className="flex flex-col items-start gap-5">
      <TypographyH4>Add Basic information</TypographyH4>
      <LabelInput
        label="Company Name"
        input={
          <Input
            placeholder="Company Name"
            id="company-name"
            {...register("basicInfo.name")}
            validationMessage={errors!.basicInfo?.name?.message}
          />
        }
      />
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            Company Description
          </TypographyMuted>
          <Textarea
            placeholder="Company Description"
            className="placeholder:text-sm"
            {...register("basicInfo.description")}
          />
        </div>
        <ErrorMessage>{errors!.basicInfo?.description?.message}</ErrorMessage>
      </div>
      <div className="w-full flex justify-between items-center gap-3 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <LabelInput
          label="Industry "
          input={
            <Input
              placeholder="Industry"
              id="industry"
              {...register("basicInfo.industry")}
              validationMessage={errors!.basicInfo?.industry?.message}
            />
          }
        />
        <LabelInput
          label="Company Size"
          input={
            <Input
              type="number"
              placeholder="Number of employee"
              id="company-size"
              {...register("basicInfo.companySize")}
              validationMessage={errors!.basicInfo?.companySize?.message}
            />
          }
        />
      </div>
      <div className="w-full flex justify-between items-center gap-3 [&>div]:w-1/2 phone-xl:flex-col phone-xl:[&>div]:w-full">
        <LabelInput
          label="Founded Year"
          input={
            <Input
              type="number"
              placeholder="Founded Year"
              id="founded-year"
              {...register("basicInfo.foundedYear")}
              validationMessage={errors!.basicInfo?.foundedYear?.message}
            />
          }
        />
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-3">
            <TypographyMuted className="text-xs">Locations</TypographyMuted>
            <Select
              onValueChange={(value: TLocations) => {
                setSelectedLocation(value)
                setValue?.("basicInfo.location", value, { shouldValidate: true })
                trigger?.('basicInfo.location')
              }}
              value={selectedLocation || ""}
            >
              <SelectTrigger className="h-12 text-muted-foreground">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locationConstant.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ErrorMessage>{errors!.basicInfo?.location?.message}</ErrorMessage>
        </div>
      </div>
    </div>
  );
}
