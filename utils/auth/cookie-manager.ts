import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { API_AUTH_LOGOUT_URL } from "../constants/apis/auth.api.constant";
import { COOKIE_CONFIG } from "../constants/cookie.constant";

/* --------------------------------- Methods --------------------------------- */
/** Store only non-sensitive routing state on the web origin. */
export const setSessionRole = (
  role: string | null | undefined,
  rememberMe: boolean,
): void => {
  if (!role) return;

  // Keep production cookies secure on HTTPS while allowing the production
  // build to run consistently on a local HTTP origin in every browser engine.
  const secure =
    typeof window === "undefined"
      ? COOKIE_CONFIG.SECURE
      : window.location.protocol === "https:";

  // Never outlive the API's refresh token. The middleware treats this cookie as
  // "logged in", but only the API's refresh-token cookie can actually revive a
  // session — a role cookie that lasts longer just routes the user into pages
  // that are guaranteed to 401.
  setCookie(COOKIE_CONFIG.SESSION_ROLE, role, {
    ...(rememberMe ? { maxAge: COOKIE_CONFIG.REMEMBER_REFRESH_TOKEN } : {}),
    secure,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH,
  });
  setCookie(COOKIE_CONFIG.REMEMBER_PREFERENCE, rememberMe.toString(), {
    maxAge: COOKIE_CONFIG.PREFERENCE_STORAGE,
    secure,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH,
  });
};

/** Clear web session state and any legacy JavaScript-readable token cookies. */
export const clearAuthCookies = (): void => {
  [
    COOKIE_CONFIG.SESSION_ROLE,
    COOKIE_CONFIG.REMEMBER_PREFERENCE,
    COOKIE_CONFIG.AUTH_TOKEN,
    COOKIE_CONFIG.REFRESH_TOKEN,
  ].forEach((cookieName) => {
    deleteCookie(cookieName, { path: COOKIE_CONFIG.PATH });
    deleteCookie(cookieName);
  });

  if (typeof window !== "undefined") {
    [COOKIE_CONFIG.AUTH_TOKEN, COOKIE_CONFIG.REFRESH_TOKEN].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
};

/** Ask the API to expire its httpOnly authentication cookies. */
export const clearAuthCookiesServerSide = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_AUTH_LOGOUT_URL, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Whether the web origin believes a session exists.
 *
 * The API's auth cookies are httpOnly and live on the API's own domain, so the
 * browser can never read them. This role cookie is the only session signal the
 * web app has — it is what the middleware routes on, and what tells a 401 apart
 * from "an anonymous visitor hit a protected endpoint".
 */
export const hasWebSession = (): boolean => {
  if (typeof document === "undefined") return false;
  return Boolean(getCookie(COOKIE_CONFIG.SESSION_ROLE));
};

export const getRememberPreference = (): boolean => {
  if (typeof document === "undefined") return false;
  return getCookie(COOKIE_CONFIG.REMEMBER_PREFERENCE) === "true";
};
