import { API_BASE_URL } from "./base_url";

export const API_EMP_BASE_URL = `${API_BASE_URL}/user/employee`;

export const API_GET_ALL_EMP_URL = `${API_EMP_BASE_URL}/all`;
export const API_GET_ONE_EMP_URL = (employeeID: string) => `${API_EMP_BASE_URL}/one/${employeeID}`;
export const API_UPDATE_EMP_INFO_URL = (employeeID: string) => `${API_EMP_BASE_URL}/update-info/${employeeID}`; 
export const API_SEARCH_EMP_URL = `${API_EMP_BASE_URL}/search-employee`;

export const API_UPLOAD_EMP_AVATAR_URL = (employeeID: string) => `${API_EMP_BASE_URL}/upload-avatar/${employeeID}`;
export const API_UPLOAD_EMP_RESUME_URL = (employeeID: string) => `${API_EMP_BASE_URL}/upload-resume/${employeeID}`;
export const API_UPLOAD_EMP_COVER_LETTER_URL = (employeeID: string) => `${API_EMP_BASE_URL}/upload-cover-letter/${employeeID}`;

export const API_REMOVE_EMP_AVATAR_URL = (employeeID: string) => `${API_EMP_BASE_URL}/remove-avatar/${employeeID}`;
export const API_REMOVE_EMP_RESUME_URL = (employeeID: string) => `${API_EMP_BASE_URL}/remove-resume/${employeeID}`;
export const API_REMOVE_EMP_COVER_LETTER_URL = (employeeID: string) => `${API_EMP_BASE_URL}/remove-cover-letter/${employeeID}`;