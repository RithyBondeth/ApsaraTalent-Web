"use client";

import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideCircleCheck, LucidePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import IconLabel from "@/components/utils/icon-label";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { TCompanySignup } from "@/app/(auth)/signup/company/validation";

export default function BenefitValueStepForm({ register }: IStepFormProps<TCompanySignup>) {
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);
  const  [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col items-start gap-8">
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add company benefit information</TypographyH4>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((skill) => (
            <IconLabel
              key={skill}
              icon={<LucideCircleCheck stroke="white" fill="#0073E6" />}
              text="Full Health Coverage"
              className="px-3 py-2 rounded-2xl bg-muted"
            />
          ))}
        </div>
        <Popover open={openBenefitPopOver} onOpenChange={setOpenBenefitPopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full text-xs" variant="secondary">
              Add benefit
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input placeholder="Enter your benefit (e.g. Unlimited PTO, Yearly Tech Stipend etc.)" {...register('benefits')}/>
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenBenefitPopOver(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>Add company value information</TypographyH4>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((skill) => (
            <IconLabel
              key={skill}
              icon={<LucideCircleCheck stroke="white" fill="#69B41E" />}
              text="Full Health Coverage"
              className="px-3 py-2 rounded-2xl bg-muted"
            />
          ))}
        </div>
        <Popover open={openValuePopOver} onOpenChange={setOpenValuePopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full text-xs" variant="secondary">
              Add value
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input placeholder="Enter your value (e.g. Insurance, Employee Well-being etc.)" />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenValuePopOver(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
