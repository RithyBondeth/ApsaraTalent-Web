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
          z.instanceof(File).refine(
            (file) => {
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
        ])
        .optional(),
      cover: z
        .union([
          z.instanceof(File).refine(
            (file) => {
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
        ])
        .optional(),
    })
    .optional(),
});

export const accountSettingSchema = z.object({
  accountSetting: z
    .object({
      email: emailValidation.optional(),
      phone: khmerPhoneNumberValidation.optional(),
    })
    .optional(),
});

export const openPositionSchema = z.object({
  openPositions: z
    .array(
      z.object({
        uuid: textValidation().optional(),
        title: textValidation().optional(),
        description: textValidation().optional(),
        type: textValidation().optional(),
        experienceRequirement: textValidation().optional(),
        educationRequirement: textValidation().optional(),
        skills: textValidation().optional(),
        salary: textValidation().optional(),
        deadlineDate: dateValidation().optional(),
      })
    )
    .optional(),
});

export const imagesSchema = z.object({
  images: z
    .array(
      z
        .object({
          id: z.string().optional(),
          image: z
            .union([
              z.instanceof(File).refine(
                (file) => {
                  const validTypes = ["image/jpeg", "image/png", "image/webp"];
                  return (
                    validTypes.includes(file.type) &&
                    file.size <= MAX_IMAGE_SIZE
                  );
                },
                {
                  message: "Invalid file: must be jpeg, png, or webp and < 5MB",
                }
              ),
              z.string(), // existing image URLs
            ])
            .optional(),
        })
        .optional()
    )
    .optional(),
});

export const benefitAndValueSchema = z.object({
  benefitsAndValues: z
    .object({
      benefits: z
        .array(
          z.object({
            id: z.number().optional(),
            label: z.string(),
          })
        )
        .optional(),
      values: z
        .array(
          z.object({
            id: z.number().optional(),
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
        id: z.string(),
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
