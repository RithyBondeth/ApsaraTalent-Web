import { dateValidation, positiveNumberValidation, selectedValidation, textValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const employeeSearchSchema = z.object({
    keyword: textValidation('keyword', 100).optional(),
    location: selectedValidation('Location').optional(),
    companySize: z.object({
        min: positiveNumberValidation('Minimum company size').optional(),
        max: positiveNumberValidation('Maximum company size').optional()
    }).optional(),
    date: z.object({
        from: dateValidation('Posted date from').optional(),
        to: dateValidation('Posted date to').optional()
    }).optional(),
    sortBy: textValidation('Sort By', 100),
    orderBy: textValidation('Sort Order', 100),
});

export type TEmployeeSearchSchema = z.infer<typeof employeeSearchSchema>;