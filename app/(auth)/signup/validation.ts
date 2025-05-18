import {
  emailValidation,
  khmerPhoneNumberValidation,
  passwordValidation,
  selectedValidation,
  textValidation,
} from "@/utils/functions/validations";
import * as z from "zod";

export const basicSignupSchema = z
  .object({
    firstName: textValidation("First name",50),
    lastName: textValidation("Last name", 50),
    username: textValidation("Username", 50),
    phone: khmerPhoneNumberValidation,
    gender: selectedValidation("Gender"),
    selectedLocation: selectedValidation("Location"),
    selectedRole: selectedValidation("Role"),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    // Access password and confirmPassword from the object schema
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords and Conform Password don't match",
        path: ["confirmPassword"],
      });
    }
  });

export type TBasicSignupSchema = z.infer<typeof basicSignupSchema>;
