import { TUserRole } from "../../types/role.type";
import { EAuthLoginMethod } from "../../constants/auth.constant";
import { ICompany } from "./company.interface";
import { IEmployee } from "./employee.interface";

export interface IUser {
  id: string;
  role: TUserRole;
  email: string;
  password: string;
  phone?: string | null;
  otpCode?: string | null;
  otpCodeExpires?: string | null;
  pushNotificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
  refreshToken?: string | null;
  isEmailVerified?: boolean;
  profileCompleted?: boolean;
  emailVerificationToken?: string | null;
  isTwoFactorEnabled?: boolean | null;
  twoFactorSecret?: string | null;
  facebookId?: string | null;
  googleId?: string | null;
  linkedinId?: string | null;
  githubId?: string | null;
  lastLoginMethod?: EAuthLoginMethod | null;
  employee: IEmployee | null;
  company: ICompany | null;
  createdAt: string;
}
