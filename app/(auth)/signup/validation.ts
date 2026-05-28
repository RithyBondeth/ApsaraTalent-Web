import * as z from "zod";

// ── Basic Signup Employee Schema ─────────────────────────────────────────────
export const makeBasicSignupEmployeeSchema = (m: {
  firstNameRequired: string;
  lastNameRequired: string;
  dobRequired: string;
  usernameRequired: string;
  locationRequired: string;
  genderRequired: string;
  phoneInvalid: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordNeedsNumber: string;
  passwordNeedsSpecial: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
}) =>
  z
    .object({
      firstName: z.string().min(1, m.firstNameRequired).max(50),
      lastName: z.string().min(1, m.lastNameRequired).max(50),
      dob: z.string().min(1, m.dobRequired),
      username: z.string().min(1, m.usernameRequired).max(50),
      phone: z.preprocess(
        (value) => {
          if (value === "" || value === null || value === undefined) {
            return undefined;
          }
          return typeof value === "string" ? value.trim() : value;
        },
        z
          .string()
          .regex(/^(\+855|0)[0-9]{8,9}$/, { message: m.phoneInvalid })
          .optional(),
      ),
      gender: z
        .string({ required_error: m.genderRequired })
        .min(1, { message: m.genderRequired }),
      selectedLocation: z
        .string({ required_error: m.locationRequired })
        .min(1, { message: m.locationRequired }),
      email: z.string().min(1, m.emailRequired).email(m.emailInvalid),
      password: z
        .string()
        .min(1, m.passwordRequired)
        .min(8, m.passwordMinLength)
        .regex(/[0-9]/, m.passwordNeedsNumber)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, m.passwordNeedsSpecial),
      confirmPassword: z.string().min(1, m.confirmPasswordRequired),
    })
    .superRefine((data, ctx) => {
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.passwordsMismatch,
          path: ["confirmPassword"],
        });
      }
    });

// ── Basic Signup Company Schema ──────────────────────────────────────────────
export const makeBasicSignupCompanySchema = (m: {
  phoneInvalid: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordNeedsNumber: string;
  passwordNeedsSpecial: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
}) =>
  z
    .object({
      phone: z.preprocess(
        (value) => {
          if (value === "" || value === null || value === undefined) {
            return undefined;
          }
          return typeof value === "string" ? value.trim() : value;
        },
        z
          .string()
          .regex(/^(\+855|0)[0-9]{8,9}$/, { message: m.phoneInvalid })
          .optional(),
      ),
      email: z.string().min(1, m.emailRequired).email(m.emailInvalid),
      password: z
        .string()
        .min(1, m.passwordRequired)
        .min(8, m.passwordMinLength)
        .regex(/[0-9]/, m.passwordNeedsNumber)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, m.passwordNeedsSpecial),
      confirmPassword: z.string().min(1, m.confirmPasswordRequired),
    })
    .superRefine((data, ctx) => {
      if (data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.passwordsMismatch,
          path: ["confirmPassword"],
        });
      }
    });

export type TBasicSignupEmployeeSchema = z.infer<
  ReturnType<typeof makeBasicSignupEmployeeSchema>
>;

export type TBasicSignupCompanySchema = z.infer<
  ReturnType<typeof makeBasicSignupCompanySchema>
>;
