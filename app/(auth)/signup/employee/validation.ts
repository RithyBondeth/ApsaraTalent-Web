import {
  dateValidation,
  fileValidation,
  imageValidation,
  positiveNumberValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validations";
import * as z from "zod";

// Define schema for step 1
export const professionStepSchema = z.object({
  profession: z.object({
    job: textValidation("Profession", 50),
    yearOfExperience: positiveNumberValidation("Year of experiences"),
    availability: selectedValidation("availability"),
    description: textValidation("Description", 500),
  }),
});

// Define schema for step 2
export const experienceStepSchema = z.object({
  experience: z
    .object({
      title: textValidation("Title", 50),
      description: textValidation("Description", 200),
      startDate: dateValidation("Start date"),
      endDate: dateValidation("End date"),
    })
    .array(),
});

// Define schema for step 3
export const educationStepSchema = z.object({
  educations: z
    .object({
      school: textValidation("School", 50),
      degree: textValidation("Degree", 50),
      year: dateValidation("Graduation year"),
    })
    .array(),
});

// Define schema for step 4
export const skillReferenceStepSchema = z.object({
  skillAndReference: z.object({
    skills: z.array(z.string()).min(1, { message: "At least one skill is required" }),
    resume: fileValidation('Resume'),
    coverLetter: fileValidation('Cover letter'),
  }),
});

// Define schema for step 5
export const avatarStepSchema = z.object({
  avatar: imageValidation('Avatar')
});

export const careerScopesStepSchema = z.object({
  careerScopes: z.array(z.string()).min(1, { message: "Please select at least one career option" }),
})

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
