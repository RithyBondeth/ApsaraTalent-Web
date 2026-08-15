import { MAX_IMAGE_SIZE } from "@/utils/constants/config.constant";
import { COMPANY_TYPE_MAX_LENGTH } from "@/utils/constants/ui.constant";
import {
  dateValidation,
  emailValidation,
  khmerPhoneNumberValidation,
  positiveNumberValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validation";
import * as z from "zod";

const basicInfoSchema = z.object({
  basicInfo: z
    .object({
      name: textValidation().optional(),
      description: textValidation().optional(),
      industry: textValidation().optional(),
      companySize: positiveNumberValidation().optional(),
      foundedYear: positiveNumberValidation().optional(),
      location: selectedValidation().optional(),
      websiteUrl: z
        .string()
        .url({ message: "Please enter a valid URL (e.g. https://...)" })
        .optional()
        .nullable()
        .or(z.literal("")),
      // Free text: `companyTypeConstant` is suggested, not enforced.
      companyType: z
        .string()
        .max(COMPANY_TYPE_MAX_LENGTH)
        .optional()
        .nullable()
        .or(z.literal("")),
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
            },
          ),
          z.string(),
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
              message: `Invalid file: cover must be an image (jpeg, png, webp) and < 5MB`,
            },
          ),
          z.string(),
          z.null(),
        ])
        .optional(),
    })
    .optional(),
});

const accountSettingSchema = z.object({
  accountSetting: z
    .object({
      email: emailValidation.optional(),
      phone: khmerPhoneNumberValidation(),
    })
    .optional(),
});

const openPositionSchema = z.object({
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
        salaryMin: z.coerce.number().positive().optional().nullable(),
        salaryMax: z.coerce.number().positive().optional().nullable(),
        salaryCurrency: z.string().optional().default("USD"),
        workMode: z
          .enum(["remote", "on_site", "hybrid", "flexible"])
          .optional()
          .nullable(),
        location: z.string().optional().nullable().or(z.literal("")),
        // Mirrors the employee `languages` list so the two are comparable.
        languagesRequired: z.array(z.string()).optional().nullable(),
        openingsCount: z.number().int().positive().optional().nullable(),
        deadlineDate: dateValidation().optional(),
      }),
    )
    .optional(),
});

const imagesSchema = z.object({
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
                },
              ),
              z.string(), // existing image URLs
            ])
            .optional(),
        })
        .optional(),
    )
    .optional(),
});

const benefitAndValueSchema = z.object({
  benefitsAndValues: z
    .object({
      benefits: z
        .array(
          z.object({
            id: z.number().optional(),
            label: z.string(),
          }),
        )
        .optional(),
      values: z
        .array(
          z.object({
            id: z.number().optional(),
            label: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
});

const careerScopesSchema = z.object({
  careerScopes: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .default([]),
});

const socialSchema = z.object({
  socials: z
    .array(
      z
        .object({
          id: z.string().optional(),
          platform: z.string().optional(),
          url: z.string().optional(),
        })
        .optional(),
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
