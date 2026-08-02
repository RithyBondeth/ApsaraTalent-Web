/* -------------------------------- Constants ------------------------------- */
export const USER_ROLE = {
  EMPLOYEE: "employee",
  COMPANY: "company",
  ADMIN: "admin",
  NONE: "none",
} as const;

/* ---------------------------------- Types --------------------------------- */
export type TAuthLoginMethod =
  | "email_password"
  | "phone_otp"
  | "google"
  | "facebook"
  | "linkedin"
  | "github";

/* ---------------------------------- OTP ----------------------------------- */
export const OTP_LENGTH = 6;
