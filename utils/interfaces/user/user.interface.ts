import { TAuthLoginMethod } from "@/utils/constants/auth.constant";
import { ICompany } from "./company.interface";
import { IEmployee } from "./employee.interface";
import { TUserRole } from "@/utils/types/auth/role.type";

/**
 * Mirrors the API's UserResponseDTO. The API omits a key rather than sending
 * null, so the profile relations are optional here, not `| null` — an employee
 * response has no `company` key at all. Do not narrow these back to required:
 * the API only ever populates the one matching `role`.
 */
export interface IUser {
  id: string;
  role: TUserRole;
  email?: string;
  phone?: string | null;
  isEmailVerified?: boolean;
  profileCompleted?: boolean;
  isTwoFactorEnabled?: boolean | null;
  lastLoginMethod?: TAuthLoginMethod | null;
  lastLoginAt?: string | null;
  employee?: IEmployee;
  company?: ICompany;
  createdAt?: string;
  /**
   * Populated when the account owner requested deletion. Feeds the
   * grace-period banner on the settings page. Null on normal accounts.
   */
  deletedAt?: string | null;
}
