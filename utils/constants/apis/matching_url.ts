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