import { API_BASE_URL } from "./base.api.constant";

const API_ADMIN_BASE_URL = `${API_BASE_URL}/admin`;

export const API_ADMIN_OVERVIEW_URL = `${API_ADMIN_BASE_URL}/users/overview`;

export const API_ADMIN_USERS_URL = `${API_ADMIN_BASE_URL}/users`;

export const API_ADMIN_USER_URL = (userId: string) =>
  `${API_ADMIN_BASE_URL}/users/${userId}`;

export const API_ADMIN_USER_STATUS_URL = (userId: string) =>
  `${API_ADMIN_BASE_URL}/users/${userId}/status`;

export const API_ADMIN_REPORTS_URL = `${API_ADMIN_BASE_URL}/reports`;

export const API_ADMIN_REPORT_STATUS_URL = (reportId: string) =>
  `${API_ADMIN_BASE_URL}/reports/${reportId}/status`;

export const API_ADMIN_AUDIT_URL = `${API_ADMIN_BASE_URL}/audit`;
