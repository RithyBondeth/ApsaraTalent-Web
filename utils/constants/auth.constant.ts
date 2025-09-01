import { TUserRole } from "../types/role.type";

export enum EAuthLoginMethod {
  EMAIL_PASSWORD = "email_password",
  PHONE_OTP = "phone_otp",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  LINKEDIN = "linkedin",
  GITHUB = "github",
}

export type TUserAuthResponse = {
  id: string;
  phone: string;
  role: TUserRole;
  lastLoginAt: string;
  lastLoginMethod: EAuthLoginMethod;
};
