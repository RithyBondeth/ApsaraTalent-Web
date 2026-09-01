import {
  selectedValidation,
  textValidation,
} from "@/utils/functions/validation";
import * as z from "zod";

export const companySearchSchema = z.object({
  keyword: z.string().optional(),
  location: selectedValidation("Location").optional(),
  jobType: z.string().optional(),
  educationLevel: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  skills: z.array(z.string()).optional(),
  /** Narrow results to the viewer's own career scopes. Default on. */
  useCareerScopes: z.boolean().optional(),
  sortBy: textValidation("Sort By", 100),
  orderBy: textValidation("Sort Order", 100),
});

export type TCompanySearchSchema = z.infer<typeof companySearchSchema>;
