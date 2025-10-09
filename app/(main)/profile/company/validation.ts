import { MAX_IMAGE_SIZE } from "@/utils/constants/app.constant";
import {
  dateValidation,
  emailValidation,
  imageValidation,
} from "@/utils/functions/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
  basicInfo: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      industry: z.string().optional(),
      companySize: z.number().positive().optional(),
      foundedYear: z.number().positive().optional(),
      location: z.string().optional(),
      avatar: z
        .union([
          z.custom<File>(
            (file) => {
              if (!(file instanceof File)) return false;
              const validTypes = ["image/jpeg", "image/png", "image/webp"];
              return validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
            },
            {
              message: `Invalid file: avatar must be an image (jpeg, png, webp) and < 5MB`,
            }
          ),
          z.string(), // for existing image URLs
          z.null(),
          z.undefined(), // Adding undefined to make it optional
        ])
        .refine(
          (file) =>
            file === null || file === undefined || file instanceof File || typeof file === "string",
          {
            message: `Please upload a valid file, URL, or leave it empty.`,
          }
        ).optional(),
      cover: z
      .union([
        z.custom<File>(
          (file) => {
            if (!(file instanceof File)) return false;
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            return validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
          },
          {
            message: `Invalid file: cover must be an image (jpeg, png, webp) and < 5MB`,
          }
        ),
        z.string(), // for existing image URLs
        z.null(),
        z.undefined(), // Adding undefined to make it optional
      ])
      .refine(
        (file) =>
          file === null || file === undefined || file instanceof File || typeof file === "string",
        {
          message: `Please upload a valid file, URL, or leave it empty.`,
        }
      ).optional(),
    }).optional(),
});

export const accountSettingSchema = z.object({
  accountSetting: z.object({
    //   email: emailValidation.optional(),
    //   phone: khmerPhoneNumberValidation.optional(),
    //   currentPassword: passwordValidation.optional(),
    //   newPassword: passwordValidation.optional(),
    //   confirmPassword: z.string().min(1, "Confirm password is required").optional(),
    // }).optional() 
    // .superRefine((data, ctx) => {
    //   // Access password and confirmPassword from the object schema
    //   if (data?.confirmPassword !== data?.newPassword) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "New password and Confirm password don't match",
    //       path: ["confirmPassword"],
    //     });
    //   }
    // }),
      email: emailValidation.optional(),
      phone: z.string().optional(),
      currentPassword: z.string().optional(),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
    }),
});

export const openPositionSchema = z.object({
  openPositions: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        experienceRequirement: z.string().optional(),
        educationRequirement: z.string().optional(),
        skills: z.array(z.string()).optional(),
        salary: z.string().optional(),
        deadlineDate: dateValidation("Deadline").optional(),
      })
    ).optional(),
});

export const imagesSchema = z.object({
  images: z.array(imageValidation("images")).optional(),
});

export const benefitAndValueSchema = z.object({
  benefitsAndValues: z.object({
    benefits: z.array(z.object({
      label: z.string(),
    })).optional(),
    values: z.array(z.object({
      label: z.string(),
    })).optional(),
  }).optional(), 
});

export const careerScopesSchema = z.object({
  careerScopes: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).min(1, { message: "Please select at least one career option" }).optional(), 
});

export const socialSchema = z.object({
  socials: z
    .array(
      z.object({
        platform: z.string().optional(),
        url: z.string().optional(),
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
});

export type TCompanyProfileForm = z.infer<typeof companyFormSchema>;
