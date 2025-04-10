import { dateValidation, emailValidation, imageValidation, khmerPhoneNumberValidation, selectedValidation, textValidation } from "@/utils/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
  basicInfo: z.object({
      name: textValidation("Name", 20).optional(),
      description: textValidation("Description", 100).optional(),
      industry: textValidation("Industry", 100).optional(),
      companySize: textValidation("Company size", 100).optional(),
      foundedYear: textValidation("Founded Year", 100).optional(),
      location: selectedValidation("location").optional(),
      email: emailValidation.optional(),
      phone: khmerPhoneNumberValidation.optional(),

  })
});

export const openPositionSchema = z.object({
  openPositions: z.array(
      z.object({
        title: textValidation("Title", 100).optional(),
        description: textValidation("Description", 100).optional(),
        experienceRequirement: textValidation("Experience requirement", 100).optional(),
        educationRequirement: textValidation("Education requirement", 100).optional(),
        skills: z.array(z.string()).optional(),
        salary: textValidation("Salary", 100).optional(),
        deadlineDate: dateValidation("Deadline").optional(),
      })
  )
});

export const imagesSchema = z.object({
    images: z.array(imageValidation('images').optional())
})

export const benefitAndValueSchema = z.object({
  benefitsAndValues: z.object({
      benefits: z.array(z.string()).optional(),
      values: z.array(z.string()).optional(),
  })
});

export type TOpenPositionForm = z.infer<typeof openPositionSchema>;
