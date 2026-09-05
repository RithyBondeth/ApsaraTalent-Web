import { API_BASE_URL } from "../base.api.constant";

export const API_GET_LANDING_STATS_URL =
  API_BASE_URL + "/public/user/landing-stats";
export const API_GET_CURRENT_USER_URL = API_BASE_URL + "/user/current-user";
export const API_GET_ALL_CAREER_SCOPES_URL =
  API_BASE_URL + "/user/find-all-career-scopes";
export const API_UPDATE_PUSH_TOKEN_URL = API_BASE_URL + "/user/push-token";
export const API_GET_EMPLOYEE_RECOMMENDATIONS_URL = (
  employeeId: string,
  limit?: number,
) =>
  API_BASE_URL +
  `/user/recommendation/employee/${employeeId}${limit ? `?limit=${limit}` : ""}`;
export const API_GET_COMPANY_RECOMMENDATIONS_URL = (
  companyId: string,
  limit?: number,
) =>
  API_BASE_URL +
  `/user/recommendation/company/${companyId}${limit ? `?limit=${limit}` : ""}`;

// Support — problem reports raised from the profile menu.
export const API_REPORT_PROBLEM_URL =
  API_BASE_URL + "/user/support/report-problem";

/* --------------------- Account lifecycle (self-service) ------------------ */
const API_ACCOUNT_BASE_URL = API_BASE_URL + "/user/account";
// The download endpoint is a GET because the browser needs to save the file
// via a link href, not an XHR body — the download attribute + a fresh
// filename land the file in Downloads instead of a blob URL that expires.
export const API_ACCOUNT_EXPORT_URL = API_ACCOUNT_BASE_URL + "/export";
export const API_ACCOUNT_DELETE_URL = API_ACCOUNT_BASE_URL + "/delete";
export const API_ACCOUNT_DELETE_CANCEL_URL =
  API_ACCOUNT_BASE_URL + "/delete/cancel";
