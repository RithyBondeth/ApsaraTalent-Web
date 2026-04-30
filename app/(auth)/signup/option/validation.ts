import { selectedValidation } from "@/utils/functions/validation/form-schemas";
import * as z from "zod";

export const signupOptionSchema = z.object({
  selectedRole: selectedValidation("Role"),
});

export type TSignupOptionSchema = z.infer<typeof signupOptionSchema>;
