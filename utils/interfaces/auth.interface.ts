import { EAuthLoginMethod } from "../constants/auth.constant";
import { TUserRole } from "../types/role.type";

export interface IUserAuthResponse {
  id: string;
  phone: string;
  role: TUserRole;
  lastLoginAt: string;
  lastLoginMethod: EAuthLoginMethod;
}
