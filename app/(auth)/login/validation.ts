import * as z from "zod";

export const makeLoginSchema = (m: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordNeedsNumber: string;
  passwordNeedsSpecial: string;
}) =>
  z.object({
    email: z.string().min(1, m.emailRequired).email(m.emailInvalid),
    password: z
      .string()
      .min(1, m.passwordRequired)
      .min(8, m.passwordMinLength)
      .regex(/[0-9]/, m.passwordNeedsNumber)
      .regex(/[!@#$%^&*(),.?":{}|<>]/, m.passwordNeedsSpecial),
    rememberMe: z.boolean().optional(),
  });

export type TLoginForm = z.infer<ReturnType<typeof makeLoginSchema>>;
