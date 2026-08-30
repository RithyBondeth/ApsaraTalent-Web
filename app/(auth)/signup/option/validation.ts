import { selectedValidation } from "@/utils/functions/validation";
import * as z from "zod";

export const signupOptionSchema = z.object({
  selectedRole: selectedValidation("Role"),
});

export type TSignupOptionSchema = z.infer<typeof signupOptionSchema>;
