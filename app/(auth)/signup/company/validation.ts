import { dateValidation, imageValidation, selectedValidation, textValidation } from "@/utils/validations";
import * as z from "zod";

// Define Schema for step 1
export const basicInfoStepSchema = z.object({
    basicInfo: z.object({
        name: textValidation("Name", 20),
        description: textValidation("Description", 100),
        industry: textValidation("Industry", 100),
        companySize: textValidation("Company size", 20),
        foundedYear: textValidation("Founded Year", 10),
        location: selectedValidation("location"),
    })
});

// Define schema for step 2
export const openPositionStepSchema = z.object({
    openPositions: z.array(
        z.object({
          title: textValidation("title", 30),
          description: textValidation("description", 100),
          experienceRequirement: textValidation("experience requirement", 20),
          educationRequirement: textValidation("education requirement", 20),
          skill: z.array(textValidation("skill", 20)),
          salary: textValidation("salary", 20),
          postedDate: dateValidation("postedDate"),
          deadlineDate: dateValidation("datelineDate"),
        })
    )
});

// Define schema for step 3
export const benefitAndValueStepSchema = z.object({
    benefits: textValidation("Benefit", 20).array(),
    values: textValidation("Value", 20).array(),
});

// Define schema for step 4
export const companyAvatarStepSchema = z.object({
    avatar: imageValidation("avatar")
})

// Define schema for step 5
export const companyCoverStepSchema = z.object({
    cover: imageValidation("cover")  
})

// FormSchema
export const companySignupSchema = z.object({
    ...basicInfoStepSchema.shape,
    ...openPositionStepSchema.shape,
    ...benefitAndValueStepSchema.shape,
    ...companyAvatarStepSchema.shape,
    ...companyCoverStepSchema.shape,  
});

export type TBasicInfoStep = z.infer<typeof basicInfoStepSchema>;
export type TOpenPositionStep = z.infer<typeof openPositionStepSchema>;
export type TBenefitAndValueStep = z.infer<typeof benefitAndValueStepSchema>;
export type TCompanyAvatarStep = z.infer<typeof companyAvatarStepSchema>;
export type TCompanyCoverStep = z.infer<typeof companyCoverStepSchema>;

export type TCompanySignup = z.infer<typeof companySignupSchema>;