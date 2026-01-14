import {
  passwordValidation,
  textValidation,
} from "@/utils/functions/validations";
import * as z from "zod";

export const resetPasswordSchema = z
  .object({
    token: textValidation("Token", 9000),
    password: passwordValidation,
    confirmPassword: textValidation("Confirm password", 20),
  })
  .superRefine((data, ctx) => {
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
