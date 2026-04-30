export const EAuthLoginMethod = {
  EMAIL_PASSWORD: "email_password",
  PHONE_OTP: "phone_otp",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  LINKEDIN: "linkedin",
  GITHUB: "github",
} as const;

export type EAuthLoginMethod =
  (typeof EAuthLoginMethod)[keyof typeof EAuthLoginMethod];
