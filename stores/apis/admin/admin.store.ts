import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_ADMIN_AUDIT_URL,
  API_ADMIN_OVERVIEW_URL,
  API_ADMIN_REPORTS_URL,
  API_ADMIN_REPORT_STATUS_URL,
  API_ADMIN_USERS_URL,
  API_ADMIN_USER_STATUS_URL,
  API_ADMIN_USER_URL,
} from "@/utils/constants/apis/admin.api.constant";
import {
  TAdminAuditEntry,
  TAdminOverview,
  TAdminPage,
  TAdminReport,
  TAdminUpdateReportPayload,
  TAdminUpdateStatusPayload,
  TAdminUser,
  TAdminUserDetail,
  TAdminUserQuery,
  TReportStatus,
} from "@/utils/types/admin/admin.type";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
type TAdminState = {
  overview: TAdminOverview | null;
  loadingOverview: boolean;

  users: TAdminPage<TAdminUser> | null;
  loadingUsers: boolean;

  userDetail: TAdminUserDetail | null;
  loadingUserDetail: boolean;

  reports: TAdminPage<TAdminReport> | null;
  loadingReports: boolean;

  audit: TAdminPage<TAdminAuditEntry> | null;
  loadingAudit: boolean;

  /** True while a status change is in flight — disables the action buttons. */
  saving: boolean;
  error: string | null;

  getOverview: () => Promise<void>;
  getUsers: (query?: TAdminUserQuery) => Promise<void>;
  getUser: (userId: string) => Promise<void>;
  updateUserStatus: (
    userId: string,
    payload: TAdminUpdateStatusPayload,
  ) => Promise<boolean>;
  getReports: (query?: {
    page?: number;
    limit?: number;
    status?: TReportStatus;
  }) => Promise<void>;
  updateReportStatus: (
    reportId: string,
    payload: TAdminUpdateReportPayload,
  ) => Promise<boolean>;
  getAudit: (query?: {
    page?: number;
    limit?: number;
    targetUserId?: string;
  }) => Promise<void>;
  clearError: () => void;
};

/**
 * Params are pruned before they go out: axios serialises `undefined` away but
 * an empty `search` string would reach the API as `search=`, which the DTO
 * accepts and the service then matches every row against.
 */
function pruneParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== null,
    ),
  );
}

/* ---------------------------------- Store --------------------------------- */
export const useAdminStore = create<TAdminState>((set, get) => ({
  overview: null,
  loadingOverview: false,
  users: null,
  loadingUsers: false,
  userDetail: null,
  loadingUserDetail: false,
  reports: null,
  loadingReports: false,
  audit: null,
  loadingAudit: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  getOverview: async () => {
    set({ loadingOverview: true });
    try {
      const res = await apiClient.get<TAdminOverview>(API_ADMIN_OVERVIEW_URL);
      set({ overview: res.data, loadingOverview: false, error: null });
    } catch (error) {
      set({
        loadingOverview: false,
        error: extractApiErrorMessage(error, "Failed to load the overview"),
      });
    }
  },

  getUsers: async (query = {}) => {
    set({ loadingUsers: true });
    try {
      const res = await apiClient.get<TAdminPage<TAdminUser>>(
        API_ADMIN_USERS_URL,
        { params: pruneParams(query) },
      );
      set({ users: res.data, loadingUsers: false, error: null });
    } catch (error) {
      set({
        loadingUsers: false,
        error: extractApiErrorMessage(error, "Failed to load users"),
      });
    }
  },

  getUser: async (userId) => {
    set({ loadingUserDetail: true });
    try {
      const res = await apiClient.get<TAdminUserDetail>(
        API_ADMIN_USER_URL(userId),
      );
      set({ userDetail: res.data, loadingUserDetail: false, error: null });
    } catch (error) {
      set({
        loadingUserDetail: false,
        error: extractApiErrorMessage(error, "Failed to load the account"),
      });
    }
  },

  updateUserStatus: async (userId, payload) => {
    set({ saving: true, error: null });
    try {
      await apiClient.patch(API_ADMIN_USER_STATUS_URL(userId), payload);
      set({ saving: false });
      // Refetched rather than patched in place: the server derives the
      // effective status and appends an audit row, so the local guess would be
      // wrong in exactly the cases that matter.
      await get().getUser(userId);
      return true;
    } catch (error) {
      set({
        saving: false,
        error: extractApiErrorMessage(error, "Failed to update the account"),
      });
      return false;
    }
  },

  getReports: async (query = {}) => {
    set({ loadingReports: true });
    try {
      const res = await apiClient.get<TAdminPage<TAdminReport>>(
        API_ADMIN_REPORTS_URL,
        { params: pruneParams(query) },
      );
      set({ reports: res.data, loadingReports: false, error: null });
    } catch (error) {
      set({
        loadingReports: false,
        error: extractApiErrorMessage(error, "Failed to load reports"),
      });
    }
  },

  updateReportStatus: async (reportId, payload) => {
    set({ saving: true, error: null });
    try {
      await apiClient.patch(API_ADMIN_REPORT_STATUS_URL(reportId), payload);
      set((state) => ({
        saving: false,
        // Patched in place so the row does not jump out of the list while the
        // admin is still reading it; the queue refetches on the next filter.
        reports: state.reports
          ? {
              ...state.reports,
              items: state.reports.items.map((report) =>
                report.id === reportId
                  ? { ...report, status: payload.status }
                  : report,
              ),
            }
          : null,
      }));
      return true;
    } catch (error) {
      set({
        saving: false,
        error: extractApiErrorMessage(error, "Failed to update the report"),
      });
      return false;
    }
  },

  getAudit: async (query = {}) => {
    set({ loadingAudit: true });
    try {
      const res = await apiClient.get<TAdminPage<TAdminAuditEntry>>(
        API_ADMIN_AUDIT_URL,
        { params: pruneParams(query) },
      );
      set({ audit: res.data, loadingAudit: false, error: null });
    } catch (error) {
      set({
        loadingAudit: false,
        error: extractApiErrorMessage(error, "Failed to load the audit log"),
      });
    }
  },
}));
