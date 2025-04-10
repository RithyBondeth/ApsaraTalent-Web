import * as z from "zod";
import {
  ACCEPTED_FILE_TYPES,
  DOCUMENT_SIZE,
  MAX_IMAGE_SIZE,
} from "./constants/app.constant";

export const fileValidation = (label: string) =>
  z
    .any()
    .refine((file) => file instanceof File, {
      message: `${label} is required`,
    })
    .refine((file) => file && file.size <= DOCUMENT_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => file && ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only .pdf, .doc, .docx are supported",
    });

export const textValidation = (label: string, max: number) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be less than ${max} characters.`);

export const positiveNumberValidation = (label: string) =>
  z.coerce.number().min(1, { message: `${label} must be a positive number` });

export const selectedValidation = (label: string) =>
  z
    .string({ required_error: `Please select your ${label}` })
    .min(1, { message: `Please select your ${label}` });

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
    /^(?:\+855|0)(?:1\d{8}|[2-9]\d{7,8})$/,
    "Invalid Khmer phone number (must start with +855 or 855 and a valid prefix)"
  );

export const phoneOrEmailValidation = z
  .string()
  .min(1, "Email or Phone number is required")
  .refine((value) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the value is either a valid email or a Khmer phone number
    return (
      emailRegex.test(value) ||
      /^(?:\+855|0)(?:1\d{8}|[2-9]\d{7,8})$/.test(value)
    );
  }, "Invalid email or Khmer phone number");

export const dateValidation = (label: string) =>
  z.preprocess(
    (arg) => {
      if (typeof arg === "string" && arg.trim() === "") return undefined;
      if (arg instanceof Date) return arg;
      if (typeof arg === "string" || typeof arg === "number")
        return new Date(arg);
      return arg;
    },
    z.date({
      required_error: `${label} is required`,
      invalid_type_error: `${label} must be a valid date`,
    })
  );

export const imageValidation = (label: string) =>
  z
    .union([
      // Union to accept either File or null
      z.custom<File>(
        (file) => {
          if (!(file instanceof File)) return false;
          const validTypes = ["image/jpeg", "image/png", "image/webp"];
          return validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
        },
        {
          message: `Invalid file: ${label} must be an image (jpeg, png, webp) and < 5MB`,
        }
      ),
      z.null(), // Allow null as a valid value
    ])
    .refine((file) => file === null || file instanceof File, {
      message: `Please upload a valid file or leave it empty.`,
    });
