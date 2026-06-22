import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

/* ----------------------------------- Types ---------------------------------- */
// error handling utility
type TErrorLike =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl>
  | Merge<FieldError, (FieldError | undefined)[]>
  | FieldError[]
  | (FieldError | undefined)[]
  | undefined;

/* --------------------------------- Method ---------------------------------- */
/**
 * Extracts a human-readable error message string from a react-hook-form field error.
 * Supports traversing arrays of field errors (e.g., from FieldArray validations).
 *
 * @param field - The react-hook-form error object or array
 * @returns The actual error message string, or undefined if no message is found
 */
export const getErrorMessage = (field: TErrorLike): string | undefined => {
  if (Array.isArray(field)) {
    for (const err of field) {
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        return err.message;
      }
    }
  }

  if (field && typeof field === "object" && "message" in field) {
    return typeof field.message === "string" ? field.message : undefined;
  }

  return undefined;
};
