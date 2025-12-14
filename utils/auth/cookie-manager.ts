import { setCookie, deleteCookie } from "cookies-next";
import { COOKIE_CONFIG } from "../constants/cookie.constant";

/**
 * Set authentication cookies with proper security settings
 */
export const setAuthCookies = (
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
): void => {
  try {
    const accessTokenMaxAge = rememberMe
      ? COOKIE_CONFIG.REMEMBER_ACCESS_TOKEN
      : COOKIE_CONFIG.SESSION_ACCESS_TOKEN;

    const refreshTokenMaxAge = rememberMe
      ? COOKIE_CONFIG.REMEMBER_REFRESH_TOKEN
      : COOKIE_CONFIG.SESSION_REFRESH_TOKEN;

    // Set access token
    setCookie(COOKIE_CONFIG.AUTH_TOKEN, accessToken, {
      maxAge: accessTokenMaxAge,
      secure: COOKIE_CONFIG.SECURE,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      path: COOKIE_CONFIG.PATH,
      httpOnly: false, // Set to true if backend supports it
    });

    // Set refresh token
    setCookie(COOKIE_CONFIG.REFRESH_TOKEN, refreshToken, {
      maxAge: refreshTokenMaxAge,
      secure: COOKIE_CONFIG.SECURE,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      path: COOKIE_CONFIG.PATH,
      httpOnly: false, // Set to true if backend supports it
    });

    // Store remember preference
    setCookie(COOKIE_CONFIG.REMEMBER_PREFERENCE, rememberMe.toString(), {
      maxAge: COOKIE_CONFIG.PREFERENCE_STORAGE,
      secure: COOKIE_CONFIG.SECURE,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      path: COOKIE_CONFIG.PATH,
    });

    console.log("Authentication cookies set successfully", {
      rememberMe,
      accessTokenExpiry: new Date(
        Date.now() + accessTokenMaxAge * 1000
      ).toISOString(),
      refreshTokenExpiry: new Date(
        Date.now() + refreshTokenMaxAge * 1000
      ).toISOString(),
    });
  } catch (error) {
    console.error("Error setting authentication cookies:", error);
    throw new Error("Failed to set authentication cookies");
  }
};

/**
 * Clear all authentication cookies with comprehensive fallback methods
 */
export const clearAuthCookies = (): void => {
  console.log("Clearing authentication cookies...");

  try {
    const cookieNames = [
      COOKIE_CONFIG.AUTH_TOKEN,
      COOKIE_CONFIG.REFRESH_TOKEN,
      COOKIE_CONFIG.REMEMBER_PREFERENCE,
    ];

    // Method 1: Use cookies-next library (primary method)
    cookieNames.forEach((cookieName) => {
      deleteCookie(cookieName, { path: COOKIE_CONFIG.PATH });
      deleteCookie(cookieName); // Fallback without path
    });

    // Method 2: Browser-native cookie clearing (fallback method)
    if (typeof document !== "undefined") {
      const expiredDate = "Thu, 01 Jan 1970 00:00:00 UTC";

      cookieNames.forEach((cookieName) => {
        // Clear with path
        document.cookie = `${cookieName}=; expires=${expiredDate}; path=${COOKIE_CONFIG.PATH};`;

        // Clear with domain variants (handle subdomain scenarios)
        try {
          const hostname = window.location.hostname;
          document.cookie = `${cookieName}=; expires=${expiredDate}; path=${COOKIE_CONFIG.PATH}; domain=${hostname};`;
          document.cookie = `${cookieName}=; expires=${expiredDate}; path=${COOKIE_CONFIG.PATH}; domain=.${hostname};`;
        } catch (domainError) {
          console.debug(
            "Domain-specific cookie clearing skipped:",
            domainError
          );
        }
      });
    }

    // Method 3: Clear any fallback storage
    if (typeof window !== "undefined") {
      const storageKeys = [
        COOKIE_CONFIG.AUTH_TOKEN,
        COOKIE_CONFIG.REFRESH_TOKEN,
        COOKIE_CONFIG.REMEMBER_PREFERENCE,
      ];

      storageKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (storageError) {
          console.debug("Storage clearing error for", key, storageError);
        }
      });
    }

    console.log("Authentication cookies cleared successfully");
  } catch (error) {
    console.error("Error clearing authentication cookies:", error);
    // Don't throw here as clearing should be non-blocking
  }
};

/**
 * Server-side logout API call
 */
export const clearAuthCookiesServerSide = async () => {
  try {
    console.log("Calling server-side logout API...");
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // Include cookies in request
    });

    const data = await response.json();
    console.log("Server-side logout response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    return true;
  } catch (error) {
    console.error("Server-side logout error:", error);
    return false;
  }
};

/**
 * Check if authentication token exists in cookies
 */
export const hasAuthToken = (): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_CONFIG.AUTH_TOKEN}=`));

    return !!cookie && cookie.split("=")[1]?.length > 0;
  } catch (error) {
    console.error("Error checking auth token:", error);
    return false;
  }
};

/**
 * Get authentication token from document.cookie (client-side only)
 */
export const getAuthTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_CONFIG.AUTH_TOKEN}=`));

    return cookie ? cookie.split("=")[1] : null;
  } catch (error) {
    console.error("Error getting auth token from cookie:", error);
    return null;
  }
};
