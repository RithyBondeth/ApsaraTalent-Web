import { API_BASE_URL } from "./base.api.constant";

const API_MATCHING_BASE_URL = `${API_BASE_URL}/match`;
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

/*
  Opening the matching list marks it seen server-side and returns the recomputed
  counts, so the badge never has to be derived in the browser.
*/
export const API_MARK_EMPLOYEE_MATCHING_SEEN_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/employee/${empID}/matching-seen`;

export const API_MARK_COMPANY_MATCHING_SEEN_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/company/${cmpID}/matching-seen`;

export const API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/current-employee-matching-count/${empID}`;

export const API_COUNT_CURRENT_COMPANY_MATCHING_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/current-company-matching-count/${cmpID}`;

export const API_GET_ANALYTICS_URL = (id: string, role: string) =>
  `${API_MATCHING_BASE_URL}/analytics/${id}?role=${role}`;

export const API_AI_MATCH_EXPLANATION_URL = (
  eid: string,
  cid: string,
  lang?: string,
) =>
  `${API_MATCHING_BASE_URL}/ai-explanation/${eid}/${cid}${lang ? `?lang=${lang}` : ""}`;
export const API_AI_INTERVIEW_PREP_STREAM_URL = (eid: string, cid: string) =>
  `${API_MATCHING_BASE_URL}/ai-interview-prep/${eid}/${cid}/stream`;

export const API_AI_SKILL_GAP_STREAM_URL = (
  eid: string,
  cid: string,
  lang?: string,
) =>
  `${API_MATCHING_BASE_URL}/ai-skill-gap/${eid}/${cid}/stream${lang ? `?lang=${lang}` : ""}`;

export const API_UNMATCH_URL = (empID: string, cmpID: string) =>
  `${API_MATCHING_BASE_URL}/unmatch/${empID}/${cmpID}`;

// Interview URLs
export const API_CREATE_INTERVIEW_URL = `${API_MATCHING_BASE_URL}/interview`;
export const API_GET_INTERVIEWS_BY_EMPLOYEE_URL = (empID: string) =>
  `${API_MATCHING_BASE_URL}/interview/employee/${empID}`;
export const API_GET_INTERVIEWS_BY_COMPANY_URL = (cmpID: string) =>
  `${API_MATCHING_BASE_URL}/interview/company/${cmpID}`;
export const API_UPDATE_INTERVIEW_STATUS_URL = `${API_MATCHING_BASE_URL}/interview/status`;
