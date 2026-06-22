import * as z from "zod";
import {
  ACCEPTED_FILE_TYPES,
  DOCUMENT_SIZE,
  MAX_IMAGE_SIZE,
} from "@/utils/constants/config.constant";

/* --------------------------------- Methods ---------------------------------- */
/**
 * Collection of Zod schema factories for form validation across the project.
 * Most take an optional 'label' argument to generate human-readable error messages.
 */

export const textValidation = (label?: string, max?: number) => {
  if (max && label) {
    return z
      .string()
      .min(1, `${label} is required`)
      .max(max, `${label} must be less than ${max} characters.`);
  }
  return z.string();
};

export const positiveNumberValidation = (label?: string) => {
  if (label)
    return z.coerce
      .number()
      .min(1, { message: `${label} must be a positive number` });
  return z.coerce.number();
};

export const selectedValidation = (label?: string) => {
  if (label)
    return z
      .string({ required_error: `Please select your ${label}` })
      .min(1, { message: `Please select your ${label}` });

  return z.string();
};

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .email({ message: "Invalid email address" });

export const khmerPhoneNumberValidation = () => {
  return z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return typeof value === "string" ? value.trim() : value;
    },
    z
      .string()
      .regex(/^(\+855|0)[0-9]{8,9}$/, {
        message:
          "Invalid Khmer phone number format (e.g., +85512345678 or 012345678)",
      })
      .optional(),
  );
};

export const dateValidation = (label?: string) => {
  if (label)
    return z.preprocess(
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
      }),
    );

  return z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() === "") return undefined;
    if (arg instanceof Date) return arg;
    if (typeof arg === "string" || typeof arg === "number")
      return new Date(arg);
    return arg;
  }, z.date());
};

export const optionalFileValidation = (label: string) =>
  z
    .any()
    .optional()
    .nullable()
    .refine((file) => !file || file instanceof File, {
      message: `${label} must be a valid file`,
    })
    .refine((file) => !file || file.size <= DOCUMENT_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only .pdf, .doc, .docx are supported",
    });

export const optionalImageValidation = (label: string) =>
  z
    .union([
      z.custom<File>(
        (file) => {
          if (!(file instanceof File)) return false;
          const validTypes = ["image/jpeg", "image/png", "image/webp"];
          return validTypes.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
        },
        {
          message: `Invalid file: ${label} must be an image (jpeg, png, webp) and < 5MB`,
        },
      ),
      z.string(),
      z.null(),
      z.undefined(),
    ])
    .refine(
      (file) =>
        file === null ||
        file === undefined ||
        file instanceof File ||
        typeof file === "string",
      {
        message: `Please upload a valid image file or leave it empty.`,
      },
    );
