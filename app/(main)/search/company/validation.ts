import { positiveNumberValidation, selectedValidation, textValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const companySearchSchema = z.object({
    keyword: z.string().optional(),
    location: selectedValidation('Location').optional(),
    jobType: selectedValidation("Job Type").optional(),
    educationLevel: selectedValidation('Education').optional(),
    experienceLevel: z.object({
        min: positiveNumberValidation('Minimum experience level').optional(),
        max: positiveNumberValidation('Maximum experience level').optional(),
    }).optional(),
    sortBy: textValidation("Sort By", 100),
    orderBy: textValidation("Sort Order", 100),
});

export type TCompanySearchSchema = z.infer<typeof companySearchSchema>;