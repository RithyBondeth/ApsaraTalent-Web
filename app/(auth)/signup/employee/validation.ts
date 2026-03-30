import {
  dateValidation,
  optionalFileValidation,
  optionalImageValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validation/form-schemas";
import * as z from "zod";

// Define schema for step 1: Professtion
export const professionStepSchema = z.object({
  profession: z.object({
    job: textValidation("Profession", 50),
    yearOfExperience: z
      .string({ required_error: "Please select your years of experince" })
      .min(1, { message: "Please select your years of experince" }),
    availability: selectedValidation("availability"),
    description: textValidation("Description", 1000),
  }),
});

// Define schema for step 2: Experience
export const experienceStepSchema = z.object({
  experience: z
    .object({
      title: textValidation("Title", 50),
      description: textValidation("Description", 500),
      startDate: dateValidation("Start date"),
      endDate: dateValidation("End date"),
    })
    .refine((data) => data.startDate < data.endDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    })
    .array()
    .optional()
    .default([]),
});

// Define schema for step 3: Education
export const educationStepSchema = z.object({
  educations: z
    .object({
      school: textValidation("School", 50),
      degree: textValidation("Degree", 100),
      year: z
        .number({
          required_error: "Graduation year is required",
          invalid_type_error: "Graduation year is required",
        })
        .int()
        .min(1900)
        .max(new Date().getFullYear() + 10),
      isStudying: z.boolean().optional(),
    })
    .array(),
});

// Define schema for step 4: SkillReference
export const skillReferenceStepSchema = z.object({
  skillAndReference: z.object({
    skills: z
      .array(z.string())
      .min(1, { message: "At least one skill is required" }),
    resume: optionalFileValidation("Resume"),
    coverLetter: optionalFileValidation("Cover letter"),
  }),
});

// Define schema for step 5: Avatar
export const avatarStepSchema = z.object({
  avatar: optionalImageValidation("Avatar"),
});

// Define schema for step 6: Career Scopes
export const careerScopesStepSchema = z.object({
  careerScopes: z
    .array(z.string())
    .min(1, { message: "Please select at least one career option" }),
});

// FormSchema
export const employeeSignUpSchema = z.object({
  ...professionStepSchema.shape,
  ...experienceStepSchema.shape,
  ...educationStepSchema.shape,
  ...skillReferenceStepSchema.shape,
  ...avatarStepSchema.shape,
  ...careerScopesStepSchema.shape,
});

export type TProfessionStepInfo = z.infer<typeof professionStepSchema>;
export type TExperienceStepInfo = z.infer<typeof experienceStepSchema>;
export type TEducationStepInfo = z.infer<typeof educationStepSchema>;
export type TSkillReferenceStepInfo = z.infer<typeof skillReferenceStepSchema>;
export type TAvatarStepInfo = z.infer<typeof avatarStepSchema>;
export type TCareerScopeStepInfo = z.infer<typeof careerScopesStepSchema>;

export type TEmployeeSignUp = z.infer<typeof employeeSignUpSchema>;
