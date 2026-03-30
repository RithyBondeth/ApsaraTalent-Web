import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

// error handling utility
type ErrorLike =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl>
  | Merge<FieldError, (FieldError | undefined)[]>
  | FieldError[]
  | (FieldError | undefined)[]
  | undefined;

export const getErrorMessage = (field: ErrorLike): string | undefined => {
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
