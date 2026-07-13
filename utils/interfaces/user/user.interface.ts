import { TAuthLoginMethod } from "@/utils/constants/auth.constant";
import { ICompany } from "./company.interface";
import { IEmployee } from "./employee.interface";
import { TUserRole } from "@/utils/types/auth/role.type";

export interface IUser {
  id: string;
  role: TUserRole;
  email: string;
  phone?: string | null;
  isEmailVerified?: boolean;
  profileCompleted?: boolean;
  isTwoFactorEnabled?: boolean | null;
  lastLoginMethod?: TAuthLoginMethod | null;
  lastLoginAt?: string | null;
  employee: IEmployee | null;
  company: ICompany | null;
  createdAt: string;
}
