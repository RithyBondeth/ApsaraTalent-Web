import { API_BASE_URL } from "./base_url";

export const API_EMPLOYEE_FAVORITE_COMPANY_URL = (
  empId: string,
  cmpId: string
) => `${API_BASE_URL}/user/employee/${empId}/favorite/company/${cmpId}`;

export const API_EMPLOYEE_UNFAVORITE_COMPANY_URL = (
  empId: string,
  cmpId: string,
  favoriteId: string
) =>
  `${API_BASE_URL}/user/employee/${empId}/unfavorite/${favoriteId}/company/${cmpId}`;

export const API_COMPANY_FAVORITE_EMPLOYEE_URL = (
  cmpId: string,
  empId: string
) => `${API_BASE_URL}/user/company/${cmpId}/favorite/employee/${empId}`;

export const API_COMPANY_UNFAVORITE_EMPLOYEE_URL = (
  cmpId: string,
  empId: string,
  favoriteId: string
) =>
  `${API_BASE_URL}/user/company/${cmpId}/unfavorite/${favoriteId}/employee/${empId}`;

export const API_FIND_ALL_EMPLOYEE_FAVORITES = (empId: string) =>
  `${API_BASE_URL}/user/employee/all-favorites/${empId}`;

export const API_FIND_ALL_COMPANY_FAVORITES = (cmpId: string) =>
  `${API_BASE_URL}/user/company/all-favorites/${cmpId}`;

export const API_COUNT_ALL_COMPANY_FAVORITES = (cmpId: string) =>
  `${API_BASE_URL}/user/company/count-favorite/${cmpId}`;

export const API_COUNT_ALL_EMPLOYEE_FAVORITES = (empId: string) =>
  `${API_BASE_URL}/user/employee/count-favorite/${empId}`;
