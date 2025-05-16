import { phoneOrEmailValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const forgotPasswordSchema = z.object({
    forgotPassword: phoneOrEmailValidation
})

export type TForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;