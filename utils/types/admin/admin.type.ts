import { TUserRole } from "@/utils/types/auth/role.type";
import { TReportReason } from "@/utils/types/moderation/report.type";

/* --------------------------------- Statuses -------------------------------- */
export type TUserStatus = "active" | "suspended" | "banned";

export type TReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export type TAdminAction =
  | "user_suspended"
  | "user_banned"
  | "user_reinstated"
  | "report_status_changed";

/* ---------------------------------- Users ---------------------------------- */
export type TAdminUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar: string | null;
  role: TUserRole;
  /**
   * What the platform enforces right now — a suspension whose term has run out
   * reads as "active" here while `storedStatus` still says "suspended".
   */
  status: TUserStatus;
  storedStatus: TUserStatus;
  suspendedUntil: string | null;
  statusReason: string | null;
  isEmailVerified: boolean;
  profileCompleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  openReportCount: number;
};

export type TAdminUserDetail = TAdminUser & {
  employeeId: string | null;
  companyId: string | null;
  lastLoginMethod: string | null;
  reportsAgainst: TAdminReport[];
  statusHistory: TAdminAuditEntry[];
};

/* --------------------------------- Reports --------------------------------- */
export type TAdminReportParty = {
  id: string;
  name: string;
  email: string | null;
  role: TUserRole;
};

export type TAdminReport = {
  id: string;
  reason: TReportReason;
  details: string | null;
  status: TReportStatus;
  createdAt: string;
  reporter: TAdminReportParty | null;
  reported: TAdminReportParty | null;
};

/* ---------------------------------- Audit ---------------------------------- */
export type TAdminAuditEntry = {
  id: string;
  action: TAdminAction;
  actorEmail: string | null;
  targetUserId: string | null;
  targetReportId: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

/* --------------------------------- Overview -------------------------------- */
export type TAdminOverview = {
  totalUsers: number;
  employees: number;
  companies: number;
  suspendedUsers: number;
  bannedUsers: number;
  pendingReports: number;
  newUsersLast7Days: number;
};

/* --------------------------------- Paging ---------------------------------- */
export type TAdminPage<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

/* --------------------------------- Payloads -------------------------------- */
export type TAdminUserQuery = {
  page?: number;
  limit?: number;
  search?: string;
  role?: TUserRole;
  status?: TUserStatus;
};

export type TAdminUpdateStatusPayload = {
  status: TUserStatus;
  /** The API requires at least 10 characters — it is shown to the user. */
  reason: string;
  /** ISO date. Only valid on a suspension; the API rejects it otherwise. */
  suspendedUntil?: string;
};

export type TAdminUpdateReportPayload = {
  status: TReportStatus;
  note?: string;
};
