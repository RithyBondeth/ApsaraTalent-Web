import { EAuthLoginMethod } from "@/utils/constants/auth.constant";
import { TUserRole } from "@/utils/types/auth/role.type";

export interface IUserAuthResponse {
  id: string;
  phone: string;
  role: TUserRole;
  lastLoginAt: string;
  lastLoginMethod: EAuthLoginMethod;
}
