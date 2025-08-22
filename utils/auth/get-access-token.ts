import { getCookie } from "cookies-next";

// Get access token from cookie
export const getUnifiedAccessToken = () => {
  try {
    return getCookie('auth-token');
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

// Get refresh token from cookie
export const getRefreshToken = () => {
  try {
    return getCookie('refresh-token');
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// Get remember preference
export const getRememberPreference = (): boolean => {
  try {
    const preference = getCookie('remember-preference');
    return preference === 'true';
  } catch (error) {
    console.error("Error getting remember preference:", error);
    return false;
  }
};

// Check if user is authenticated with enhanced validation
export const isAuthenticated = (): boolean => {
  try {
    const token = getCookie('auth-token');
    
    if (!token) {
      return false;
    }

    // Basic token validation (you can enhance this with JWT decoding)
    if (typeof token === 'string' && token.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

// Enhanced authentication check with token refresh capability
export const validateAuthentication = async (): Promise<{
  isValid: boolean;
  shouldRefresh: boolean;
  rememberMe: boolean;
}> => {
  try {
    const authToken = getUnifiedAccessToken();
    const refreshToken = getRefreshToken();
    const rememberMe = getRememberPreference();

    if (!authToken) {
      return {
        isValid: false,
        shouldRefresh: false,
        rememberMe: false,
      };
    }

    // Here you could add JWT expiration checking
    // For now, we'll do a basic validation
    const isValid = !!authToken;
    const shouldRefresh = isValid && !!refreshToken;

    return {
      isValid,
      shouldRefresh,
      rememberMe,
    };
  } catch (error) {
    console.error("Error validating authentication:", error);
    return {
      isValid: false,
      shouldRefresh: false,
      rememberMe: false,
    };
  }
};

// Client-side cookie helper for browser environments
export const getClientSideToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='));
    
    return cookie ? cookie.split('=')[1] : null;
  } catch (error) {
    console.error("Error getting client-side token:", error);
    return null;
  }
};
