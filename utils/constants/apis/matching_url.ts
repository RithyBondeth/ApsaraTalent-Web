import { API_BASE_URL } from "./base_url";

export const API_MATCHING_BASE_URL = `${API_BASE_URL}/match`;
export const API_MATCHING_CMP_LIKE_URL = (cmpID: string, empID: string) =>
  `${API_MATCHING_BASE_URL}/company/${cmpID}/like/${empID}`;
export const API_MATCHING_EMP_LIKE_URL = (empID: string, cmpID: string) =>
  `${API_MATCHING_BASE_URL}/employee/${empID}/like/${cmpID}`;

export const API_GET_CURRENT_EMPLOYEE_LIKED_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/current-employee-liked/${empID}`;

export const API_GET_CURRENT_COMPANY_LIKED_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/current-company-liked/${cmpID}`;

export const API_GET_CURRENT_EMPLOYEE_MATCHING_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/current-employee-matching/${empID}`;

export const API_GET_CURRENT_COMPANY_MATCHING_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/current-company-matching/${cmpID}`;

export const API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/current-employee-matching-count/${empID}`;

export const API_COUNT_CURRENT_COMPANY_MATCHING_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/current-company-matching-count/${cmpID}`;

export const API_GET_ANALYTICS_URL = (id: string, role: string) =>
  `${API_MATCHING_BASE_URL}/analytics/${id}?role=${role}`;

// Interview URLs
export const API_CREATE_INTERVIEW_URL = `${API_MATCHING_BASE_URL}/interview`;
export const API_GET_INTERVIEWS_BY_EMPLOYEE_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/interview/employee/${empID}`;
export const API_GET_INTERVIEWS_BY_COMPANY_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/interview/company/${cmpID}`;
export const API_UPDATE_INTERVIEW_STATUS_URL = `${API_MATCHING_BASE_URL}/interview/status`;
