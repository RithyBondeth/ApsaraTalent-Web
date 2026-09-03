import { API_BASE_URL } from "./base.api.constant";

const API_JOB_BASE_URL = `${API_BASE_URL}/job`;
export const API_SEARCH_JOB_URL = `${API_JOB_BASE_URL}/search`;

/* --------------------------------- Public --------------------------------- */
// Unauthenticated, and served from a separate controller in the gateway for
// that reason. Read server-side by the job page and the sitemap.
const API_PUBLIC_JOB_BASE_URL = `${API_BASE_URL}/public/job`;

export const API_PUBLIC_JOB_URL = (jobID: string) =>
  `${API_PUBLIC_JOB_BASE_URL}/${jobID}`;
export const API_PUBLIC_JOB_SITEMAP_URL = `${API_PUBLIC_JOB_BASE_URL}/sitemap/entries`;

/* ------------------------------ Applications ------------------------------ */
const API_APPLICATION_BASE_URL = `${API_JOB_BASE_URL}/application`;

export const API_APPLY_JOB_URL = API_APPLICATION_BASE_URL;
export const API_GET_MY_APPLICATIONS_URL = `${API_APPLICATION_BASE_URL}/mine`;
export const API_GET_JOB_APPLICATIONS_URL = (jobID: string, cmpID: string) =>
  `${API_APPLICATION_BASE_URL}/job/${jobID}/company/${cmpID}`;
export const API_UPDATE_APPLICATION_STATUS_URL = `${API_APPLICATION_BASE_URL}/status`;
export const API_WITHDRAW_APPLICATION_URL = (applicationID: string) =>
  `${API_APPLICATION_BASE_URL}/${applicationID}`;
