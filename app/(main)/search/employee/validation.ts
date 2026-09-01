import {
  dateValidation,
  positiveNumberValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validation";
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

  experienceLevel: z.string().optional(),
  educationLevel: z.array(z.string()).optional(),
  workMode: z.string().optional(),
  /** Narrow results to the viewer's own career scopes. Default on. */
  useCareerScopes: z.boolean().optional(),
  sortBy: textValidation("Sort By", 100),
  orderBy: textValidation("Sort Order", 100),
});

export type TEmployeeSearchSchema = z.infer<typeof employeeSearchSchema>;
