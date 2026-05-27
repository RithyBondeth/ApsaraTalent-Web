export const AUTH_LOGIN_METHODS = {
  EMAIL_PASSWORD: "email_password",
  PHONE_OTP: "phone_otp",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  LINKEDIN: "linkedin",
  GITHUB: "github",
} as const;

export type TAuthLoginMethod =
  (typeof AUTH_LOGIN_METHODS)[keyof typeof AUTH_LOGIN_METHODS];
