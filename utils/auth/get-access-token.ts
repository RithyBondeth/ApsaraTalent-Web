import { getCookie } from "cookies-next";

// Get access token from HTTP-only cookie
// Note: This will return undefined in client-side code since HTTP-only cookies
// are not accessible via JavaScript. Use this only for server-side operations.
export const getUnifiedAccessToken = () => {
  return getCookie('auth-token');
};

// Get refresh token from HTTP-only cookie (server-side only)
export const getRefreshToken = () => {
  return getCookie('refresh-token');
};

// Check if user is authenticated by checking cookie existence
export const isAuthenticated = () => {
  return !!getCookie('auth-token');
};
