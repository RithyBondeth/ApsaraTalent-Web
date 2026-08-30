import { TUserRole } from "@/utils/types/auth/role.type";

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
