import { API_BASE_URL } from "../base.api.constant";

export const API_GET_ALL_USERS_URL = API_BASE_URL + "/user/all";
export const API_GET_LANDING_STATS_URL =
  API_BASE_URL + "/public/user/landing-stats";
export const API_GET_ONE_USER_URL = (userID: string) =>
  API_BASE_URL + `/user/one/${userID}`;
export const API_GET_CURRENT_USER_URL = API_BASE_URL + "/user/current-user";
export const API_GET_ALL_CAREER_SCOPES_URL =
  API_BASE_URL + "/user/find-all-career-scopes";
export const API_UPDATE_PUSH_TOKEN_URL = API_BASE_URL + "/user/push-token";
