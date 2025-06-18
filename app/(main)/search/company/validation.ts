import { selectedValidation, textValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const companySearchSchema = z.object({
    keyword: z.string().optional(),
    location: selectedValidation('Location').optional(),
    sortBy: textValidation('Sort By', 100),
    orderBy: textValidation('Sort Order', 100),
});

export type TCompanySearchSchema = z.infer<typeof companySearchSchema>;