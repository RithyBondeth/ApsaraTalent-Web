// Cookie configuration constants
export const COOKIE_CONFIG = {
  // Token expiration times (in seconds)
  REMEMBER_ACCESS_TOKEN: 30 * 24 * 60 * 60, // 30 days
  SESSION_ACCESS_TOKEN: 24 * 60 * 60, // 1 day
  REMEMBER_REFRESH_TOKEN: 30 * 24 * 60 * 60, // 30 days
  SESSION_REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
  PREFERENCE_STORAGE: 365 * 24 * 60 * 60, // 1 year

  // Cookie names
  AUTH_TOKEN: "auth-token",
  REFRESH_TOKEN: "refresh-token",
  REMEMBER_PREFERENCE: "remember-preference",

  // Security settings
  SECURE: process.env.NODE_ENV === "production",
  SAME_SITE: "strict" as const,
  PATH: "/",
} as const;
