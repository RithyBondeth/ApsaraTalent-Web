import { API_BASE_URL } from "./base_url";

export const API_CMP_BASE_URL = `${API_BASE_URL}/user/company`;

export const API_GET_ALL_CMP_URL = `${API_CMP_BASE_URL}/all`;
export const API_GET_ONE_CMP_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/one/${companyID}`;
export const API_UPDATE_CMP_INFO_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/update-info/${companyID}`;

export const API_UPLOAD_CMP_AVATAR_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/upload-avatar/${companyID}`;
export const API_UPLOAD_CMP_COVER_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/upload-cover/${companyID}`;
export const API_UPLOAD_CMP_IMAGES_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/upload-images/${companyID}`;

export const API_REMOVE_CMP_AVATAR_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/remove-avatar/${companyID}`;
export const API_REMOVE_CMP_COVER_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/remove-cover/${companyID}`;
export const API_REMOVE_CMP_IMAGES_URL = (companyID: string) =>
  `${API_CMP_BASE_URL}/remove-images/${companyID}`;

export const API_REMOVE_ONE_OPEN_POSITION = (
  companyID: string,
  openPositionID: string
) => `${API_CMP_BASE_URL}/remove-open-position/${companyID}/${openPositionID}`;
