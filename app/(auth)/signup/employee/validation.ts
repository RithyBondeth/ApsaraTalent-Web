import { DOCUMENT_SIZE } from "@/utils/constant";
import {
  dateValidation,
  positiveNumberValidation,
  textValidation,
} from "@/utils/validations";
import * as z from "zod";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Define schema for step 1
export const professionStepSchema = z.object({
  profession: z.object({
    job: textValidation("job", 50),
    yearOfExperience: positiveNumberValidation("year of experiences"),
    availability: z
      .string()
      .min(1, { message: "Please select your availability" }),
    description: textValidation("description", 200),
  }),
});

// Define schema for step 2
export const experienceStepSchema = z.object({
  experience: z
    .object({
      title: textValidation("title", 50),
      description: textValidation("description", 200),
      startDate: dateValidation("start date"),
      endDate: dateValidation("end date"),
    })
    .array(),
});

// Define schema for step 3
export const educationStepSchema = z.object({
  educations: z
    .object({
      school: textValidation("school", 50),
      degree: textValidation("degree", 50),
      year: textValidation("school", 20),
    })
    .array(),
});

// Define schema for step 4
export const skillReferenceStepSchema = z.object({
  skillAndReference: z.object({
    skills: z.string().array().min(1, { message: "Skill is required" }),
    resume: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Resume is required",
      })
      .refine((file) => file && file.size <= DOCUMENT_SIZE, {
        message: "Max file size is 5MB",
      })
      .refine((file) => file && ACCEPTED_FILE_TYPES.includes(file.type), {
        message: "Only .pdf, .doc, .docx are supported",
      }),

    coverLetter: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Cover letter is required",
      })
      .refine((file) => file && file.size <= DOCUMENT_SIZE, {
        message: "Max file size is 5MB",
      })
      .refine((file) => file && ACCEPTED_FILE_TYPES.includes(file.type), {
        message: "Only .pdf, .doc, .docx are supported",
      }),
  }),
});

// Define schema for step 5
export const avatarStepSchema = z.object({
  avatar: z.string().url(),
});

// FormSchema
export const employeeSignUpSchema = z.object({
  ...professionStepSchema.shape,
  ...experienceStepSchema.shape,
  ...educationStepSchema.shape,
  ...skillReferenceStepSchema.shape,
  ...avatarStepSchema.shape,
});

export type TProfessionStepInfo = z.infer<typeof professionStepSchema>;
export type TExperienceStepInfo = z.infer<typeof experienceStepSchema>;
export type TEducationStepInfo = z.infer<typeof educationStepSchema>;
export type TSkillReferenceStepInfo = z.infer<typeof skillReferenceStepSchema>;
export type TAvatarStepInfo = z.infer<typeof avatarStepSchema>;

export type TEmployeeSignUp = z.infer<typeof employeeSignUpSchema>;
