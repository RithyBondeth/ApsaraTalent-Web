import {
  dateValidation,
  positiveNumberValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validations";
import * as z from "zod";

export const employeeSearchSchema = z.object({
  keyword: z.string().optional(),
  location: selectedValidation("Location").optional(),
  jobType: selectedValidation("Job Type").optional(),
  companySize: z
    .object({
      min: positiveNumberValidation("Minimum company size").optional(),
      max: positiveNumberValidation("Maximum company size").optional(),
    })
    .optional(),
  date: z
    .object({
      from: dateValidation("Posted date from").optional(),
      to: dateValidation("Posted date to").optional(),
    })
    .optional(),
  salaryRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),

  experienceLevel: z
    .object({
      min: z
        .number()
        .min(0, "Minimum experience level must be 0 or greater")
        .optional(),
      max: z
        .number()
        .min(0, "Maximum experience level must be 0 or greater")
        .optional(),
    })
    .optional(),
  educationLevel: selectedValidation("Education Level").optional(),
  sortBy: textValidation("Sort By", 100),
  orderBy: textValidation("Sort Order", 100),
});

export type TEmployeeSearchSchema = z.infer<typeof employeeSearchSchema>;
