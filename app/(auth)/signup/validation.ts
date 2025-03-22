import { emailValidation, khmerPhoneNumberValidation, passwordValidation, selectedValidation, textValidation } from "@/utils/validations";
import * as z from "zod";

export const basicSignupSchema = z.object({
    firstName: textValidation('First name', 15),
    lastName: textValidation('Last name', 15),
    username: textValidation('Username', 15),
    phone: khmerPhoneNumberValidation,
    gender: z
    .string()
    .min(1, "Please select a gender"),
    selectedRole: selectedValidation('role'),
    email: emailValidation,
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

export type TBasicSignupSchema = z.infer<typeof basicSignupSchema>;