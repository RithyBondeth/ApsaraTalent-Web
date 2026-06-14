import { API_BASE_URL } from "./base.api.constant";

export const API_MODERATION_BASE_URL = `${API_BASE_URL}/user/moderation`;

export const API_BLOCK_USER_URL = (userId: string) =>
  `${API_MODERATION_BASE_URL}/block/${userId}`;

export const API_UNBLOCK_USER_URL = (userId: string) =>
  `${API_MODERATION_BASE_URL}/block/${userId}`;

export const API_LIST_BLOCKED_URL = `${API_MODERATION_BASE_URL}/blocked`;

export const API_BLOCK_STATUS_URL = (userId: string) =>
  `${API_MODERATION_BASE_URL}/block-status/${userId}`;

export const API_REPORT_USER_URL = `${API_MODERATION_BASE_URL}/report`;
