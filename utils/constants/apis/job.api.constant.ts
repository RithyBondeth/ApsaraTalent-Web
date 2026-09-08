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

/* ------------------------------ Saved Searches ------------------------------ */
const API_SAVED_SEARCH_BASE_URL = `${API_JOB_BASE_URL}/saved-search`;
export const API_SAVED_SEARCHES_URL = API_SAVED_SEARCH_BASE_URL;
export const API_SAVED_SEARCH_URL = (savedSearchID: string) =>
  `${API_SAVED_SEARCH_BASE_URL}/${savedSearchID}`;
// The saved-search preview endpoint exists on the API; the web has no caller
// for it yet (the "Save" dialog does not preview before saving). Left for a
// future "show me how many new matches" affordance rather than exported here
// where knip would flag it as dead.

/* ---------------------------- Employer analytics ---------------------------- */
export const API_EMPLOYER_ANALYTICS_URL = `${API_JOB_BASE_URL}/employer-analytics`;

// ATS pipeline additions — bulk moves, kanban read, notes, status trail.
export const API_BULK_UPDATE_APPLICATION_STATUS_URL = `${API_APPLICATION_BASE_URL}/bulk-status`;
// The pipeline endpoint (grouped-by-stage read) also exists API-side, but
// PipelineBoard buckets the existing flat applicant list client-side to keep
// state in sync with the ATS list view. Leaving that URL out of this barrel
// until a caller needs it.
export const API_APPLICATION_NOTES_URL = (applicationID: string) =>
  `${API_APPLICATION_BASE_URL}/${applicationID}/notes`;
export const API_APPLICATION_NOTE_URL = (
  applicationID: string,
  noteID: string,
) => `${API_APPLICATION_BASE_URL}/${applicationID}/notes/${noteID}`;
export const API_APPLICATION_HISTORY_URL = (applicationID: string) =>
  `${API_APPLICATION_BASE_URL}/${applicationID}/history`;
