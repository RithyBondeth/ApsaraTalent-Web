import { MAX_IMAGE_SIZE, ACCEPTED_FILE_TYPES, DOCUMENT_SIZE } from "@/utils/constants/app.constant";
import { dateValidation, emailValidation, khmerPhoneNumberValidation, selectedValidation, textValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
    basicInfo: z.object({
        firstname: textValidation().optional(),
        lastname: textValidation().optional(),
        username: textValidation().optional(),
        gender: selectedValidation().optional(),
        location: selectedValidation().optional(),
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
        phone: khmerPhoneNumberValidation.optional(),
        // currentPassword: z.string().optional(),
        // newPassword: z.string().optional(),
        // confirmPassword: z.string().optional(),
    }).optional()
});

export const professionInfoSchema = z.object({
    profession: z.object({
        job: textValidation().optional(),
        yearOfExperience: textValidation().optional(),
        availability: textValidation().optional(),
        description: textValidation().optional(),
    }).optional()
});

export const educationSchema = z.object({
    educations: z.array(
        z.object({
            school: textValidation().optional(),
            degree: textValidation().optional(), 
            year: textValidation().optional(),   
        }).optional()
    ).optional()
});

export const experienceSchema = z.object({
    experiences: z.array(
        z.object({
            title: textValidation().optional(),
            description: textValidation().optional(),
            startDate: dateValidation().optional(),
            endDate: dateValidation().optional()
        }).optional()
    ).optional()  
});

export const skillSchema = z.object({
   skills: z.array(
    z.object({
        name: textValidation().optional(),
        description: textValidation().optional()      
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
      name: textValidation().optional(),
      description: textValidation().optional(),
    })).min(1, { message: "Please select at least one career option" }).optional(), 
});

export const socialSchema = z.object({
    socials: z.array(
     z.object({
        platform: textValidation().optional(),
        url: textValidation().optional(),
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