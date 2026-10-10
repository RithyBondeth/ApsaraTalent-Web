import { API_BASE_URL } from "./base.api.constant";

export const API_GET_NOTIFICATIONS_URL = API_BASE_URL + "/notification";
export const API_GET_UNREAD_NOTIFICATION_COUNT_URL =
  API_BASE_URL + "/notification/unread-count";
export const API_MARK_NOTIFICATION_READ_URL = (id: string) =>
  API_BASE_URL + `/notification/${id}/read`;
export const API_MARK_ALL_NOTIFICATIONS_READ_URL =
  API_BASE_URL + "/notification/read-all";
export const API_DELETE_NOTIFICATION_URL = (id: string) =>
  API_BASE_URL + `/notification/${id}`;
export const API_DELETE_ALL_NOTIFICATIONS_URL = API_BASE_URL + "/notification";

/* ------------------------------- Preferences ------------------------------ */
export const API_NOTIFICATION_PREFERENCES_URL =
  API_BASE_URL + "/notification/preferences";
// POST, not GET: mail scanners and link-preview bots fetch every URL in an
// incoming message, and a GET unsubscribe would opt people out before they had
// read the email. The footer links to a page on this app, which posts here.
export const API_NOTIFICATION_UNSUBSCRIBE_URL =
  API_BASE_URL + "/notification/preferences/unsubscribe";
