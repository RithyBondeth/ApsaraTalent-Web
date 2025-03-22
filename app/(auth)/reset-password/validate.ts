import { passwordValidation } from "@/utils/validations";
import * as z from "zod";

export const resetPasswordSchema = z.object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).superRefine((data, ctx) => {
    // Access password and confirmPassword from the object schema
    if (data.confirmPassword !== data.password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match",
            path: ["confirmPassword"],
        });
    }
});

export type TResetPasswordForm = z.infer<typeof resetPasswordSchema>;