import { phoneOrEmailValidation } from "@/utils/functions/validation/form-schemas";
import * as z from "zod";

export const forgotPasswordSchema = z.object({
  forgotPassword: phoneOrEmailValidation,
});

export type TForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
