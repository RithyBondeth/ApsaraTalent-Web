import { EAuthLoginMethod } from "../constants/auth.constant";
import { TUserRole } from "@/utils/types/auth";

export interface IUserAuthResponse {
  id: string;
  phone: string;
  role: TUserRole;
  lastLoginAt: string;
  lastLoginMethod: EAuthLoginMethod;
}
