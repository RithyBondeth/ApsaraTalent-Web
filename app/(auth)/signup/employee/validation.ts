import {
  optionalFileValidation,
  optionalImageValidation,
} from "@/utils/functions/validation";
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
const makeProfessionStepSchema = (m: {
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
      // Closed sets on both sides of the platform: these are the values a
      // company's open position is matched and filtered against.
      workMode: z.enum(["remote", "on_site", "hybrid", "flexible"]).optional(),
      noticePeriod: z.enum(["immediate", "2_weeks", "1_month"]).optional(),
      languages: z.array(z.string()).optional().default([]),
    }),
  });

// ─── Define schema for step 2: Experience ───────────────────────
const makeExperienceStepSchema = (m: {
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
        company: z
          .string()
          .min(1, m.fieldRequired("Company"))
          .max(100, m.fieldTooLong("Company", 100)),
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
const makeEducationStepSchema = (m: {
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
const makeSkillReferenceStepSchema = (m: { atLeastOneSkill: string }) =>
  z.object({
    skillAndReference: z.object({
      skills: z.array(z.string()).min(1, { message: m.atLeastOneSkill }),
      resume: optionalFileValidation("Resume"),
      coverLetter: optionalFileValidation("Cover letter"),
    }),
  });

// ─── Define schema for step 5: Avatar ───────────────────────────
const avatarStepSchema = z.object({
  avatar: optionalImageValidation("Avatar"),
});

// ─── Define schema for step 6: Career Scopes ─────────────────────
const makeCareerScopesStepSchema = (m: { atLeastOneCareer: string }) =>
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

export type TEmployeeSignUp = z.infer<
  ReturnType<typeof makeEmployeeSignUpSchema>
>;
