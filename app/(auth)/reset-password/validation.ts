import * as z from "zod";

export const makeResetPasswordSchema = (m: {
  passwordRequired: string;
  passwordMinLength: string;
  passwordNeedsNumber: string;
  passwordNeedsSpecial: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
}) =>
  z
    .object({
      token: z.string().optional(),
      password: z
        .string()
        .min(1, m.passwordRequired)
        .min(8, m.passwordMinLength)
        .regex(/[0-9]/, m.passwordNeedsNumber)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, m.passwordNeedsSpecial),
      confirmPassword: z.string().min(1, m.confirmPasswordRequired),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (confirmPassword && password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: m.passwordsMismatch,
          path: ["confirmPassword"],
        });
      }
    });

export type TResetPasswordForm = z.infer<
  ReturnType<typeof makeResetPasswordSchema>
>;
