"use client"

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LabelInput from "@/components/utils/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { locationConstant } from "@/utils/constant";
import { TLocations } from "@/utils/types/location.type";
import { useState } from "react";

export default function BasicInfoStepForm() {
 const [selectedLocation, setSelectedLocation] = useState<TLocations | null>(null);

  return (
    <div className="flex flex-col items-start gap-5">
      <TypographyH4>Add Basic information</TypographyH4>
      <LabelInput
        label="Company Name"
        input={
          <Input
            placeholder="Company Name"
            id="company-name"
          />
        }
      />
      <div className="w-full flex flex-col items-start gap-2">
        <TypographyMuted className="text-xs">
          Company Description
        </TypographyMuted>
        <Textarea placeholder="Company Description" className="placeholder:text-sm"/>
      </div>
      <div className="w-full flex justify-between items-center gap-3 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <LabelInput
          label="Industry "
          input={<Input placeholder="Industry" id="industry" />}
        />
        <LabelInput
          label="Company Size"
          input={
            <Input
              type="number"
              placeholder="Number of employee"
              id="company-size"
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
                />
            }
        />
        <div className="flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">Locations</TypographyMuted>
          <Select
            onValueChange={(value: TLocations) => setSelectedLocation(value)}
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
      </div>
    </div>
  );
}
