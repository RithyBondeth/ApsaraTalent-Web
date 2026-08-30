import { optionalImageValidation } from "@/utils/functions/validation";
import {
  COMPANY_TYPE_MAX_LENGTH,
  FOUNDED_YEAR_MIN,
} from "@/utils/constants/ui.constant";
import * as z from "zod";

// ─── Helper Validation ──────────────────────────────────────────
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

// ─── Define Schema for step 1: Basic Information ──────────────────
const makeBasicInfoStepSchema = (m: {
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
  selectRequired: (field: string) => string;
}) =>
  z.object({
    basicInfo: z.object({
      name: z
        .string()
        .min(1, m.fieldRequired("Name"))
        .max(20, m.fieldTooLong("Name", 20)),
      description: z
        .string()
        .min(1, m.fieldRequired("Description"))
        .max(1000, m.fieldTooLong("Description", 1000)),
      industry: z
        .string()
        .min(1, m.fieldRequired("Industry"))
        .max(100, m.fieldTooLong("Industry", 100)),
      companySize: z
        .string()
        .min(1, m.fieldRequired("Company size"))
        .max(100, m.fieldTooLong("Company size", 100)),
      // Picked from a year list, so this only has to reject the empty
      // selection and anything hand-crafted outside the offered range.
      foundedYear: z
        .string()
        .min(1, m.selectRequired("founded year"))
        .refine(
          (year) => {
            const parsed = Number(year);
            return (
              Number.isInteger(parsed) &&
              parsed >= FOUNDED_YEAR_MIN &&
              parsed <= new Date().getFullYear()
            );
          },
          { message: m.selectRequired("founded year") },
        ),
      location: z
        .string({ required_error: m.selectRequired("location") })
        .min(1, { message: m.selectRequired("location") }),
      websiteUrl: z
        .string()
        .url({ message: "Please enter a valid URL (e.g. https://...)" })
        .optional()
        .or(z.literal("")),
      // Free text: `companyTypeConstant` is suggested, not enforced.
      companyType: z
        .string()
        .max(
          COMPANY_TYPE_MAX_LENGTH,
          m.fieldTooLong("Company type", COMPANY_TYPE_MAX_LENGTH),
        )
        .optional()
        .or(z.literal("")),
    }),
  });

// ─── Define schema for step 2: OpenPosition ──────────────────────
const makeOpenPositionStepSchema = (m: {
  atLeastOneSkill: string;
  atLeastOnePosition: string;
  deadlineRequired: string;
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
  selectRequired: (field: string) => string;
}) =>
  z.object({
    openPositions: z
      .array(
        z.object({
          title: z
            .string()
            .min(1, m.fieldRequired("Title"))
            .max(100, m.fieldTooLong("Title", 100)),
          description: z
            .string()
            .min(1, m.fieldRequired("Description"))
            .max(1000, m.fieldTooLong("Description", 1000)),
          // Same vocabulary as an employee's years of experience, so the job
          // search filter (`experienceRequired = :experienceLevel`) can match.
          experienceRequirement: z
            .string()
            .min(1, m.selectRequired("experience level"))
            .max(100, m.fieldTooLong("Experience requirement", 100)),
          educationRequirement: z
            .string()
            .min(1, m.fieldRequired("Education requirement"))
            .max(100, m.fieldTooLong("Education requirement", 100)),
          skills: z.array(z.string()).min(1, { message: m.atLeastOneSkill }),
          // Mirrors the employee `languages` list so the two are comparable.
          languagesRequired: z.array(z.string()).optional().default([]),
          salaryMin: z.number().positive().optional(),
          salaryMax: z.number().positive().optional(),
          salaryCurrency: z.string().optional().default("USD"),
          workMode: z
            .enum(["remote", "on_site", "hybrid", "flexible"])
            .optional(),
          location: z.string().optional().or(z.literal("")),
          openingsCount: z.number().int().positive().optional(),
          // Same vocabulary as an employee's availability, so the job search
          // `jobType` filter can match what a company actually posted.
          types: z
            .string()
            .min(1, m.selectRequired("position type"))
            .max(100, m.fieldTooLong("Type", 100)),
          deadlineDate: makeDateRequired(m.deadlineRequired),
        }),
      )
      .min(1, { message: m.atLeastOnePosition }),
  });

// ─── Define schema for step 3: Benefit and Value ──────────────────
const benefitAndValueStepSchema = z.object({
  benefitsAndValues: z.object({
    benefits: z.array(z.string()).optional(),
    values: z.array(z.string()).optional(),
  }),
});

// ─── Define schema for step 4: Company Avatar ─────────────────────
const companyAvatarStepSchema = z.object({
  avatar: optionalImageValidation("Avatar"),
});

// ─── Define schema for step 5: Company Cover ──────────────────────
const companyCoverStepSchema = z.object({
  cover: optionalImageValidation("Cover"),
});

// ─── Define schema for step 6: Career Scopes ──────────────────────
const makeCareerScopesStepSchema = (m: { atLeastOneCareer: string }) =>
  z.object({
    careerScopes: z.array(z.string()).min(1, { message: m.atLeastOneCareer }),
  });

// ─── Define schema for step 7: Company Signup ──────────────────────
export const makeCompanySignupSchema = (m: {
  atLeastOneSkill: string;
  atLeastOnePosition: string;
  atLeastOneCareer: string;
  deadlineRequired: string;
  fieldRequired: (field: string) => string;
  fieldTooLong: (field: string, max: number) => string;
  selectRequired: (field: string) => string;
}) =>
  z.object({
    ...makeBasicInfoStepSchema(m).shape,
    ...makeOpenPositionStepSchema(m).shape,
    ...benefitAndValueStepSchema.shape,
    ...companyAvatarStepSchema.shape,
    ...companyCoverStepSchema.shape,
    ...makeCareerScopesStepSchema(m).shape,
  });

export type TCompanySignup = z.infer<
  ReturnType<typeof makeCompanySignupSchema>
>;
