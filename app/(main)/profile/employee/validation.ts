import { MAX_IMAGE_SIZE, ACCEPTED_FILE_TYPES, DOCUMENT_SIZE } from "@/utils/constants/app.constant";
import { dateValidation, emailValidation, selectedValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
    basicInfo: z.object({
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        username: z.string().optional(),
        gender: selectedValidation('Gender').optional(),
        location: selectedValidation('Location').optional(),
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
          z.string(),
          z.null(),
          z.undefined(),
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
        email: emailValidation.optional(),
        phone: z.string().optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional(),
    }).optional()
});

export const professionInfoSchema = z.object({
    profession: z.object({
        job: z.string().optional(),
        yearOfExperience: z.string().optional(),
        availability: z.string().optional(),
        description: z.string().optional(),
    }).optional()
});

export const educationSchema = z.object({
    educations: z.array(
        z.object({
            school: z.string().optional(),
            degree: z.string().optional(), 
            year: z.string().optional(),   
        }).optional()
    ).optional()
});

export const experienceSchema = z.object({
    experiences: z.array(
        z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            startDate: dateValidation("Start Date").optional(),
            endDate: dateValidation("End Date").optional()
        }).optional()
    ).optional()  
});

export const skillSchema = z.object({
   skills: z.array(
    z.object({
        name: z.string().optional(),
        description: z.string().optional()      
    }).optional()
   ).optional()
});

export const referenceSchema = z.object({
    references: z.object({
        resume:   z
        .any()
        .optional()
        .refine((file) => !file || file.size <= DOCUMENT_SIZE, {
        message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
        message: "Only .pdf, .doc, .docx are supported",
        }),
        coverLetter:   z
            .any()
            .optional()
            .refine((file) => !file || file.size <= DOCUMENT_SIZE, {
            message: "Max file size is 5MB",
            })
            .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
            message: "Only .pdf, .doc, .docx are supported",
        }),
    }).optional()
});

export const careerScopesSchema = z.object({
    careerScopes: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
    })).min(1, { message: "Please select at least one career option" }).optional(), 
});

export const socialSchema = z.object({
    socials: z.array(
     z.object({
        platform: z.string().optional(),
        url: z.string().optional(),
     }).optional()
    ).optional(),
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

export type TEmployeeProfileForm = z.infer<typeof employeeFormSchema>