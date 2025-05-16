import { emailValidation, passwordValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
    rememberMe: z.boolean().optional(),
});

export type TLoginForm = z.infer<typeof loginSchema>;