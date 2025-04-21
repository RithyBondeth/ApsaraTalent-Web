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
      companySize: z.number().positive().optional(),
      foundedYear: z.number().positive().optional(),
      location: selectedValidation("location").optional(),
      avatar: imageValidation('Avatar').optional(),
      cover: imageValidation('Cover').optional(),
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
  images: z.array(imageValidation("images")).optional(),
});

export const benefitAndValueSchema = z.object({
  benefitsAndValues: z.object({
    benefits: z.array(z.string()).optional(),
    values: z.array(z.string()).optional(),
  }).optional(), 
});

export const careerScopesSchema = z.object({
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

export const companyFormSchema = z.object({
  ...basicInfoSchema.shape,
  ...accountSettingSchema.shape,
  ...openPositionSchema.shape,
  ...imagesSchema.shape,
  ...benefitAndValueSchema.shape,
  ...careerScopesSchema.shape,
  ...socialSchema.shape,
})

export type TCompanyProfileForm = z.infer<typeof companyFormSchema>;
