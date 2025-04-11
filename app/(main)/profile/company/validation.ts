import {
  dateValidation,
  emailValidation,
  imageValidation,
  khmerPhoneNumberValidation,
  passwordValidation,
  selectedValidation,
  textValidation,
} from "@/utils/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
  basicInfo: z.object({
      name: textValidation("Name", 20).optional(),
      description: textValidation("Description", 100).optional(),
      industry: textValidation("Industry", 100).optional(),
      companySize: textValidation("Company size", 100).optional(),
      foundedYear: textValidation("Founded Year", 100).optional(),
      location: selectedValidation("location").optional(),
    }).optional(),
});

export const accountSettingSchema = z.object({
  accountSetting: z.object({
      email: emailValidation.optional(),
      phone: khmerPhoneNumberValidation.optional(),
      currentPassword: passwordValidation.optional(),
      newPassword: passwordValidation.optional(),
      confirmPassword: z.string().min(1, "Confirm password is required").optional(),
    }).optional() 
    .superRefine((data, ctx) => {
      // Access password and confirmPassword from the object schema
      if (data?.confirmPassword !== data?.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password and Confirm password don't match",
          path: ["confirmPassword"],
        });
      }
    }),
});

export const openPositionSchema = z.object({
  openPositions: z
    .array(
      z.object({
        title: textValidation("Title", 100).optional(),
        description: textValidation("Description", 100).optional(),
        experienceRequirement: textValidation("Experience requirement",100).optional(),
        educationRequirement: textValidation("Education requirement",100).optional(),
        skills: z.array(z.string()).optional(),
        salary: textValidation("Salary", 100).optional(),
        deadlineDate: dateValidation("Deadline").optional(),
      })
    ).optional(),
});

export const imagesSchema = z.object({
  images: z.array(imageValidation("images").optional()).optional(),
});

export const benefitAndValueSchema = z.object({
  benefitsAndValues: z.object({
    benefits: z.array(z.string()).optional(),
    values: z.array(z.string()).optional(),
  }).optional(), 
});

export const careerScopesStepSchema = z.object({
  careerScopes: z.array(z.string()).min(1, { message: "Please select at least one career option" }).optional(), 
});

export const socialSchema = z.object({
  socials: z
    .array(
      z.object({
        social: z.string().url().optional(),
        link: z.string().url().optional(),
      }).optional()
    ).optional(),
});

export type TOpenPositionForm = z.infer<typeof openPositionSchema>;
