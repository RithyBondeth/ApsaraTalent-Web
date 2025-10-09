import { MAX_IMAGE_SIZE } from "@/utils/constants/app.constant";
import {
  dateValidation,
  emailValidation,
  imageValidation,
  khmerPhoneNumberValidation,
  positiveNumberValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
  basicInfo: z
    .object({
      name: textValidation().optional(),
      description: textValidation().optional(),
      industry: textValidation().optional(),
      companySize: positiveNumberValidation().optional(),
      foundedYear: positiveNumberValidation().optional(),
      location: selectedValidation().optional(),
      avatar: z
        .union([
          z.custom<File>(
            (file) => {
              if (!(file instanceof File)) return false;
              const validTypes = ["image/jpeg", "image/png", "image/webp"];
              return (
                validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE
              );
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
            file === null ||
            file === undefined ||
            file instanceof File ||
            typeof file === "string",
          {
            message: `Please upload a valid file, URL, or leave it empty.`,
          }
        )
        .optional(),
      cover: z
        .union([
          z.custom<File>(
            (file) => {
              if (!(file instanceof File)) return false;
              const validTypes = ["image/jpeg", "image/png", "image/webp"];
              return (
                validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE
              );
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
            file === null ||
            file === undefined ||
            file instanceof File ||
            typeof file === "string",
          {
            message: `Please upload a valid file, URL, or leave it empty.`,
          }
        )
        .optional(),
    })
    .optional(),
});

export const accountSettingSchema = z.object({
  accountSetting: z
    .object({
      email: emailValidation.optional(),
      phone: khmerPhoneNumberValidation.optional(),
      currentPassword: z.string().optional(),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .optional()
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
        title: textValidation().optional(),
        description: textValidation().optional(),
        experienceRequirement: textValidation().optional(),
        educationRequirement: textValidation().optional(),
        skills: z.array(textValidation()).optional(),
        salary: textValidation().optional(),
        deadlineDate: dateValidation().optional(),
      })
    )
    .optional(),
});

export const imagesSchema = z.object({
  images: z.array(imageValidation("images")).optional(),
});

export const benefitAndValueSchema = z.object({
  benefitsAndValues: z
    .object({
      benefits: z
        .array(
          z.object({
            label: z.string(),
          })
        )
        .optional(),
      values: z
        .array(
          z.object({
            label: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
});

export const careerScopesSchema = z.object({
  careerScopes: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .min(1, { message: "Please select at least one career option" })
    .optional(),
});

export const socialSchema = z.object({
  socials: z
    .array(
      z
        .object({
          platform: z.string().optional(),
          url: z.string().optional(),
        })
        .optional()
    )
    .optional(),
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
