import { dateValidation, imageValidation, selectedValidation, textValidation } from "@/utils/functions/validations";
import * as z from "zod";

// Define Schema for step 1
export const basicInfoStepSchema = z.object({
    basicInfo: z.object({
        name: textValidation("Name", 20),
        description: textValidation("Description", 1000),
        industry: textValidation("Industry", 100),
        companySize: textValidation("Company size", 100),
        foundedYear: textValidation("Founded Year", 100),
        location: selectedValidation("location"),
    })
});

// Define schema for step 2
export const openPositionStepSchema = z.object({
    openPositions: z.array(
        z.object({
          title: textValidation("Title", 100),
          description: textValidation("Description", 1000),
          experienceRequirement: textValidation("Experience requirement", 100),
          educationRequirement: textValidation("Education requirement", 100),
          skills: z.array(z.string()).min(1, { message: "At least one skill is required" }),
          salary: textValidation("Salary", 100),
          types: textValidation("Type", 1000),
          deadlineDate: dateValidation("Deadline"),
        })
    )
});

// Define schema for step 3
export const benefitAndValueStepSchema = z.object({
    benefitsAndValues: z.object({
        benefits: z.array(z.string()).min(1, { message: "At least one benefit is required" }),
        values: z.array(z.string()).min(1, { message: "At least one value is required" }),
    })
});

// Define schema for step 4
export const companyAvatarStepSchema = z.object({
    avatar: imageValidation("Avatar")
})

// Define schema for step 5
export const companyCoverStepSchema = z.object({
    cover: imageValidation("Cover")  
})

export const careerScopesStepSchema = z.object({
    careerScopes: z.array(z.string()).min(1, { message: "Please select at least one career option" }),
})

// FormSchema
export const companySignupSchema = z.object({
    ...basicInfoStepSchema.shape,
    ...openPositionStepSchema.shape,
    ...benefitAndValueStepSchema.shape,
    ...companyAvatarStepSchema.shape,
    ...companyCoverStepSchema.shape,  
    ...careerScopesStepSchema.shape,
});

export type TBasicInfoStep = z.infer<typeof basicInfoStepSchema>;
export type TOpenPositionStep = z.infer<typeof openPositionStepSchema>;
export type TBenefitAndValueStep = z.infer<typeof benefitAndValueStepSchema>;
export type TCompanyAvatarStep = z.infer<typeof companyAvatarStepSchema>;
export type TCompanyCoverStep = z.infer<typeof companyCoverStepSchema>;
export type TCompanyCareerStep = z.infer<typeof careerScopesStepSchema>;

export type TCompanySignup = z.infer<typeof companySignupSchema>;