import * as z from "zod";
import { khmerPhoneNumberRegex, MAX_IMAGE_SIZE } from "./constant";

export const textValidation = (label: string, max: number) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be less than ${max} characters.`);

export const positiveNumberValidation = (label: string) =>
  z.coerce.number().min(1, { message: `${label} must be a positive number` });

export const selectedValidation = (label: string) =>
  z
    .string()
    .min(1, `Please select a ${label}`) // Custom message for "required" case
    .refine((val) => val !== "", {
      message: `Please select a ${label}`, // Ensure non-empty value
    });

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email({ message: "Invalid email address" });

export const passwordValidation = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  );

export const khmerPhoneNumberValidation = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    khmerPhoneNumberRegex,
    "Invalid Khmer phone number (must start with +855 or 855 and a valid prefix)"
  );

export const phoneOrEmailValidation = z
  .string()
  .min(1, "Email or Phone number is required")
  .refine((value) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the value is either a valid email or a Khmer phone number
    return emailRegex.test(value) || khmerPhoneNumberRegex.test(value);
  }, "Invalid email or Khmer phone number");

export const dateValidation = (label: string) =>
  z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date({
      invalid_type_error: `${label} must be a valid date`,
      required_error: `${label} is required`,
    })
  );

export const imageValidation = (label: string) =>
  z.custom<File>(
    (file) => {
      if (!(file instanceof File)) return false;
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      return validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
    },
    {
      message: `Invalid file: ${label} must be an image (jpeg, png, webp) and < 5MB`,
    }
  );
