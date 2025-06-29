import { selectedValidation, textValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const companySearchSchema = z.object({
    keyword: z.string().optional(),
    location: selectedValidation('Location').optional(),
    jobType: selectedValidation("Job Type").optional(),
    educationLevel: selectedValidation('Education').optional(),
    experienceLevel: z.object({
        min: z.number().min(0, 'Minimum experience level must be 0 or greater').optional(),
        max: z.number().min(0, 'Maximum experience level must be 0 or greater').optional(),
    }).optional(),
    sortBy: textValidation("Sort By", 100),
    orderBy: textValidation("Sort Order", 100),
});

export type TCompanySearchSchema = z.infer<typeof companySearchSchema>;