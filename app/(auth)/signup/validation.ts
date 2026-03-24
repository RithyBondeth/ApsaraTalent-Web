import {
  emailValidation,
  khmerPhoneNumberValidation,
  passwordValidation,
  selectedValidation,
  textValidation,
} from "@/utils/extensions/validations";
import * as z from "zod";

// Sign up as Employee Schema
export const basicSignupEmployeeSchema = z
  .object({
    firstName: textValidation("First name", 50),
    lastName: textValidation("Last name", 50),
    dob: z.string().optional(),
    username: textValidation("Username", 50),
    phone: khmerPhoneNumberValidation(),
    gender: selectedValidation("Gender"),
    selectedLocation: selectedValidation("Location"),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords and Conform Password don't match",
        path: ["confirmPassword"],
      });
    }
  });

// Sign up as Company Schema
export const basicSignupCompanySchema = z
  .object({
    phone: khmerPhoneNumberValidation(),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords and Conform Password don't match",
        path: ["confirmPassword"],
      });
    }
  });

// Type for basic signup as Employee
export type TBasicSignupEmployeeSchema = z.infer<
  typeof basicSignupEmployeeSchema
>;

// Type for basic signup as Company
export type TBasicSignupCompanySchema = z.infer<
  typeof basicSignupCompanySchema
>;
