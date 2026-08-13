import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { normalizeMediaUrlsDeep } from "@/utils/functions/media";
import { API_AUTH_REFRESH_URL } from "@/utils/constants/apis/auth.api.constant";
import { clearAuthCookies, hasWebSession } from "@/utils/auth/cookie-manager";

// Use a private instance so interceptors are never duplicated on HMR re-evaluations
const instance = axios.create({
  withCredentials: true,
  // Longer than the gateway's normal 10s RPC timeout and its 20s search
  // timeout, but finite so a broken connection cannot leave the UI spinning.
  timeout: 30_000,
});

type RetriableConfig = InternalAxiosRequestConfig & {
  _retriedAfterRefresh?: boolean;
};

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

const isOnAuthPage = (pathname: string) =>
  AUTH_PATHS.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

/**
 * One refresh at a time.
 *
 * A page load fires several requests at once, so an expired access token
 * produces a burst of 401s. Without this they would each POST /auth/refresh,
 * and the losers would present an already-rotated refresh token — invalidating
 * the session that the winner just renewed.
 */
let refreshPromise: Promise<void> | null = null;

const refreshSession = (): Promise<void> => {
  // Bare axios, not `instance`: the refresh call must never re-enter this
  // interceptor, or a 401 from it would recurse.
  refreshPromise ??= axios
    .post(API_AUTH_REFRESH_URL, null, {
      withCredentials: true,
      timeout: 30_000,
    })
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/**
 * The refresh token is gone or rejected — the session is unrecoverable.
 *
 * Clearing the role cookie matters as much as the redirect: the middleware
 * routes on it, so leaving it in place would bounce /login straight back to
 * /feed and loop. A full document navigation also drops every Zustand store,
 * so no stale user data survives into the next session.
 */
let sessionEnded = false;

const endSession = (): void => {
  if (sessionEnded) return;
  sessionEnded = true;

  clearAuthCookies();

  const { pathname, search } = window.location;
  if (isOnAuthPage(pathname)) {
    sessionEnded = false;
    return;
  }

  const callbackUrl = encodeURIComponent(`${pathname}${search}`);
  window.location.replace(`/login?callbackUrl=${callbackUrl}`);
};

instance.interceptors.response.use(
  // Normalize media URLs from API responses so data saved with localhost
  // or relative /storage paths still loads correctly in production.
  (response) => {
    if (response?.data !== undefined) {
      response.data = normalizeMediaUrlsDeep(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retriedAfterRefresh ||
      typeof window === "undefined" ||
      // An anonymous visitor hitting an authenticated endpoint is not an
      // expired session; bouncing them to /login would be wrong.
      !hasWebSession()
    ) {
      return Promise.reject(error);
    }

    config._retriedAfterRefresh = true;

    try {
      await refreshSession();
    } catch {
      endSession();
      return Promise.reject(error);
    }

    return instance(config);
  },
);

export default instance;
