import * as z from "zod";

export const makePhoneLoginSchema = (m: {
  phoneRequired: string;
  phoneInvalid: string;
}) =>
  z.object({
    phone: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }
        return typeof value === "string" ? value.trim() : value;
      },
      z
        .string({ required_error: m.phoneRequired })
        .min(1, { message: m.phoneRequired })
        .regex(/^(\+855|0)[0-9]{8,9}$/, { message: m.phoneInvalid }),
    ),
    rememberMe: z.boolean().optional(),
  });

export type TPhoneLoginForm = z.infer<ReturnType<typeof makePhoneLoginSchema>>;
