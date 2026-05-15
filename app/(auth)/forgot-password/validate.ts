import * as z from "zod";

export const makeForgotPasswordSchema = (m: {
  phoneOrEmailRequired: string;
  phoneOrEmailInvalid: string;
}) =>
  z.object({
    forgotPassword: z
      .string()
      .min(1, m.phoneOrEmailRequired)
      .refine(
        (v) =>
          /^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(v) ||
          /^(\+855|0)[1-9]\d{7,8}$/.test(v),
        m.phoneOrEmailInvalid,
      ),
  });

export type TForgotPasswordForm = z.infer<
  ReturnType<typeof makeForgotPasswordSchema>
>;
