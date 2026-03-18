import { API_BASE_URL } from "./base_url";

export const API_GET_NOTIFICATIONS_URL = API_BASE_URL + "/notification";
export const API_GET_UNREAD_NOTIFICATION_COUNT_URL =
  API_BASE_URL + "/notification/unread-count";
export const API_MARK_NOTIFICATION_READ_URL = (id: string) =>
  API_BASE_URL + `/notification/${id}/read`;
export const API_MARK_ALL_NOTIFICATIONS_READ_URL =
  API_BASE_URL + "/notification/read-all";
