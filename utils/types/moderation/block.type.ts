import { TUserRole } from "../auth";

export type TBlockStatus = {
  isBlocked: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
};

export type TBlockedUser = {
  id: string;
  employeeId: string | null;
  companyId: string | null;
  name: string;
  avatar: string | null;
  role: TUserRole;
  blockedAt: string;
};
