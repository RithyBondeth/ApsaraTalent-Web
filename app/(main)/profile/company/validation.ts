import { dateValidation, textValidation } from "@/utils/validations";
import * as z from "zod";

export const openPositionSchema = z.object({
  openPositions: z.array(
    z.object({
      title: textValidation("title", 30),
      description: textValidation("description", 100),
      experienceRequirement: textValidation("experience requirement", 20),
      educationRequirement: textValidation("education requirement", 20),
      skill: z.array(textValidation("skill", 20)),
      salary: textValidation("salary", 20),
      postedDate: dateValidation("postedDate"),
      deadlineDate: dateValidation("datelineDate"),
    })
  ),
});

export type TOpenPositionForm = z.infer<typeof openPositionSchema>;
