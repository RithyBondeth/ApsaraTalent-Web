import { API_BASE_URL } from "./base_url";

export const API_EMPLOYEE_FAVORITE_COMPANY_URL = (
  empId: string,
  cmpId: string
) => `${API_BASE_URL}/user/employee/${empId}/favorite/company/${cmpId}`;

export const API_COMPANY_FAVORITE_EMPLOYEE_URL = (
  cmpId: string,
  empId: string
) => `${API_BASE_URL}/user/company/${cmpId}/favorite/employee/${empId}`;

export const API_FIND_ALL_EMPLOYEE_FAVORITES = (empId: string) =>
  `${API_BASE_URL}/user/employee/all-favorites/${empId}`;

export const API_FIND_ALL_COMPANY_FAVORITES = (cmpId: string) =>
  `${API_BASE_URL}/user/company/all-favorites/${cmpId}`;
