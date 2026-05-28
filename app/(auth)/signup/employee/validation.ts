import {
  dateValidation,
  optionalFileValidation,
  optionalImageValidation,
} from "@/utils/functions/validation/form-schemas";
import * as z from "zod";

const makeDateRequired = (requiredError: string) =>
  z.preprocess(
    (arg) => {
      if (typeof arg === "string" && arg.trim() === "") return undefined;
      if (arg instanceof Date) return arg;
      if (typeof arg === "string" || typeof arg === "number")
        return new Date(arg);
      return arg;
    },
    z.date({
      required_error: requiredError,
      invalid_type_error: requiredError,
    }),
  );

// ─── Define schema for step 1: Profession ───────────────────────
export const makeProfessionStepSchema = (m: {
  yearsOfExperienceRequired: string;
  availabilityRequired: string;
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
}) =>
  z.object({
    profession: z.object({
      job: z
        .string()
        .min(1, m.fieldRequired("Profession"))
        .max(50, m.fieldTooLong("Profession", 50)),
      yearOfExperience: z
        .string({ required_error: m.yearsOfExperienceRequired })
        .min(1, { message: m.yearsOfExperienceRequired }),
      availability: z
        .string({ required_error: m.availabilityRequired })
        .min(1, { message: m.availabilityRequired }),
      description: z
        .string()
        .min(1, m.fieldRequired("Description"))
        .max(1000, m.fieldTooLong("Description", 1000)),
      workMode: z.enum(["remote", "on_site", "hybrid", "flexible"]).optional(),
      noticePeriod: z.enum(["immediate", "2_weeks", "1_month"]).optional(),
      portfolioUrl: z
        .string()
        .url({ message: "Please enter a valid URL (e.g. https://...)" })
        .optional()
        .or(z.literal("")),
      linkedinUrl: z
        .string()
        .url({ message: "Please enter a valid URL (e.g. https://...)" })
        .optional()
        .or(z.literal("")),
      languages: z.array(z.string()).optional().default([]),
      expectedSalaryCurrency: z.string().optional().default("USD"),
      expectedSalaryMin: z.number().positive().optional(),
      expectedSalaryMax: z.number().positive().optional(),
    }),
  });

// ─── Define schema for step 2: Experience ───────────────────────
export const makeExperienceStepSchema = (m: {
  endDateAfterStart: string;
  startDateRequired: string;
  endDateRequired: string;
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
}) =>
  z.object({
    experience: z
      .object({
        title: z
          .string()
          .min(1, m.fieldRequired("Title"))
          .max(50, m.fieldTooLong("Title", 50)),
        description: z
          .string()
          .min(1, m.fieldRequired("Description"))
          .max(500, m.fieldTooLong("Description", 500)),
        startDate: makeDateRequired(m.startDateRequired),
        endDate: makeDateRequired(m.endDateRequired),
      })
      .refine((data) => data.startDate < data.endDate, {
        message: m.endDateAfterStart,
        path: ["endDate"],
      })
      .array()
      .optional()
      .default([]),
  });

// ─── Define schema for step 3: Education ───────────────────────
export const makeEducationStepSchema = (m: {
  graduationYearRequired: string;
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
}) =>
  z.object({
    educations: z
      .object({
        school: z
          .string()
          .min(1, m.fieldRequired("School"))
          .max(50, m.fieldTooLong("School", 50)),
        degree: z
          .string()
          .min(1, m.fieldRequired("Degree"))
          .max(100, m.fieldTooLong("Degree", 100)),
        year: z
          .number({
            required_error: m.graduationYearRequired,
            invalid_type_error: m.graduationYearRequired,
          })
          .int()
          .min(1900)
          .max(new Date().getFullYear() + 10),
        isStudying: z.boolean().optional(),
      })
      .array(),
  });

// ─── Define schema for step 4: Skill and Reference ─────────────
export const makeSkillReferenceStepSchema = (m: { atLeastOneSkill: string }) =>
  z.object({
    skillAndReference: z.object({
      skills: z.array(z.string()).min(1, { message: m.atLeastOneSkill }),
      resume: optionalFileValidation("Resume"),
      coverLetter: optionalFileValidation("Cover letter"),
    }),
  });

// ─── Define schema for step 5: Avatar ───────────────────────────
export const avatarStepSchema = z.object({
  avatar: optionalImageValidation("Avatar"),
});

// ─── Define schema for step 6: Career Scopes ─────────────────────
export const makeCareerScopesStepSchema = (m: { atLeastOneCareer: string }) =>
  z.object({
    careerScopes: z.array(z.string()).min(1, { message: m.atLeastOneCareer }),
  });

// ─── Define schema for step 7: Employee Sign Up ──────────────────
export const makeEmployeeSignUpSchema = (m: {
  yearsOfExperienceRequired: string;
  availabilityRequired: string;
  endDateAfterStart: string;
  startDateRequired: string;
  endDateRequired: string;
  graduationYearRequired: string;
  atLeastOneSkill: string;
  atLeastOneCareer: string;
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
  [key: string]: unknown;
}) =>
  z.object({
    ...makeProfessionStepSchema(m).shape,
    ...makeExperienceStepSchema(m).shape,
    ...makeEducationStepSchema(m).shape,
    ...makeSkillReferenceStepSchema(m).shape,
    ...avatarStepSchema.shape,
    ...makeCareerScopesStepSchema(m).shape,
  });

export type TProfessionStepInfo = z.infer<
  ReturnType<typeof makeProfessionStepSchema>
>;
export type TExperienceStepInfo = z.infer<
  ReturnType<typeof makeExperienceStepSchema>
>;
export type TEducationStepInfo = z.infer<
  ReturnType<typeof makeEducationStepSchema>
>;
export type TSkillReferenceStepInfo = z.infer<
  ReturnType<typeof makeSkillReferenceStepSchema>
>;
export type TAvatarStepInfo = z.infer<typeof avatarStepSchema>;
export type TCareerScopeStepInfo = z.infer<
  ReturnType<typeof makeCareerScopesStepSchema>
>;

export type TEmployeeSignUp = z.infer<
  ReturnType<typeof makeEmployeeSignUpSchema>
>;
