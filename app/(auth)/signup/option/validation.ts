import { selectedValidation } from "@/utils/extensions/validations";
import * as z from "zod";

export const signupOptionSchema = z.object({
  selectedRole: selectedValidation("Role"),
});

export type TSignupOptionSchema = z.infer<typeof signupOptionSchema>;
