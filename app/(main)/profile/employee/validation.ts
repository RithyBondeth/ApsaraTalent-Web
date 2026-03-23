import { ACCEPTED_FILE_TYPES, DOCUMENT_SIZE, MAX_IMAGE_SIZE } from "@/utils/constants/config.constant";
import {
  dateValidation,
  emailValidation,
  khmerPhoneNumberValidation,
  selectedValidation,
  textValidation,
} from "@/utils/extensions/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
  basicInfo: z
    .object({
      firstname: textValidation().optional(),
      lastname: textValidation().optional(),
      dob: dateValidation().optional().nullable(),
      username: textValidation().optional(),
      gender: selectedValidation().optional(),
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
              message:
                "Invalid file: avatar must be an image (jpeg, png, webp) and < 5MB",
            },
          ),
          z.string(), // existing image URL
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
      phone: khmerPhoneNumberValidation().optional(),
    })
    .optional(),
});

export const professionInfoSchema = z.object({
  profession: z
    .object({
      job: textValidation().optional(),
      yearOfExperience: textValidation().optional(),
      availability: textValidation().optional(),
      description: textValidation().optional(),
    })
    .optional(),
});

export const educationSchema = z.object({
  educations: z
    .array(
      z
        .object({
          id: z.string().optional(),
          school: textValidation().optional(),
          degree: textValidation().optional(),
          year: z.number().int().optional(),
          isStudying: z.boolean().optional(),
        })
        .optional(),
    )
    .optional(),
});

export const experienceSchema = z.object({
  experiences: z
    .array(
      z
        .object({
          id: z.string().optional(),
          title: textValidation().optional(),
          description: textValidation().optional(),
          startDate: dateValidation().optional(),
          endDate: dateValidation().optional(),
        })
        .refine(
          (data) => {
            if (data.startDate && data.endDate) {
              return data.startDate < data.endDate;
            }
            return true;
          },
          {
            message: "End date must be after start date",
            path: ["endDate"],
          },
        )
        .optional(),
    )
    .optional(),
});

export const skillSchema = z.object({
  skills: z
    .array(
      z
        .object({
          id: z.string().optional(),
          name: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
    )
    .optional(),
});

export const referenceSchema = z.object({
  references: z
    .object({
      resume: z
        .union([
          z
            .instanceof(File)
            .refine((file) => file.size <= DOCUMENT_SIZE, {
              message: "Max file size is 5MB",
            })
            .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
              message: "Only .pdf, .doc, .docx are supported",
            }),
          z.string(),
          z.null(),
        ])
        .optional(),
      coverLetter: z
        .union([
          z
            .instanceof(File)
            .refine((file) => file.size <= DOCUMENT_SIZE, {
              message: "Max file size is 5MB",
            })
            .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
              message: "Only .pdf, .doc, .docx are supported",
            }),
          z.string(),
          z.null(),
        ])
        .optional(),
    })
    .optional(),
});

export const careerScopesSchema = z.object({
  careerScopes: z
    .array(
      z
        .object({
          id: z.string().optional(),
          name: z.string().optional(),
          description: z.string().optional().nullable(),
        })
        .optional(),
    )
    .optional(),
});

export const socialSchema = z.object({
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

export const employeeFormSchema = z.object({
  ...basicInfoSchema.shape,
  ...accountSettingSchema.shape,
  ...professionInfoSchema.shape,
  ...educationSchema.shape,
  ...experienceSchema.shape,
  ...skillSchema.shape,
  ...referenceSchema.shape,
  ...careerScopesSchema.shape,
  ...socialSchema.shape,
});

export type TEmployeeProfileForm = z.infer<typeof employeeFormSchema>;
