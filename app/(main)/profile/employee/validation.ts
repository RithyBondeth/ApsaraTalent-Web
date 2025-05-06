import { MAX_IMAGE_SIZE } from "@/utils/constants/app.constant";
import { emailValidation, selectedValidation } from "@/utils/validations";
import * as z from "zod";

export const basicInfoSchema = z.object({
    basicInfo: z.object({
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        username: z.string().optional(),
        gender: selectedValidation('gender'),
        location: selectedValidation('location'),
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
    })
});

export const educationSchema = z.object({
    
})