import { create } from "zustand";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_GOOGLE_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";
import { EAuthLoginMethod } from "@/utils/constants/auth.constant";
import { getCookie } from "cookies-next";
import { clearAuthCookies } from "@/utils/auth/cookie-manager";

// Updated response type - NO TOKENS
export type TGoogleLoginResponse = {
  type: "GOOGLE_AUTH_SUCCESS" | "GOOGLE_AUTH_ERROR";
  error?: string;
  newUser?: boolean;
  user?: {
    email: string | null;
    firstname: string | null;
    lastname: string | null;
    picture: string | null;
    provider: string | null;
    role: string | null;
    lastLoginMethod: EAuthLoginMethod | null;
    lastLoginAt: string | null;
  };
};

export type TGoogleLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  role: string | null;
  newUser: boolean | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  lastLoginMethod: EAuthLoginMethod | null;
  lastLoginAt: string | null;
  picture: string | null;
  provider: string | null;
  googleLogin: (rememberMe: 'true' | 'false', usePopup?: boolean) => void;
  clearToken: () => void;
};

const BACKEND_ORIGIN = API_AUTH_SOCIAL_GOOGLE_URL.split("/social")[0];

const FINISH_LOGIN = (data: TGoogleLoginResponse) => {
  if (!data || data.type !== "GOOGLE_AUTH_SUCCESS") {
    useGoogleLoginStore.setState({
      loading: false,
      error: data?.error || "Authentication failed",
      isAuthenticated: false,
    });
    return;
  }

  // Cookies are already set by backend (httpOnly)
  // Just update the Zustand store with user info
  useGoogleLoginStore.setState({
    loading: false,
    isAuthenticated: true,
    message: "Login successful",
    role: data.user?.role || null,
    newUser: data.newUser || false,
    email: data.user?.email || null,
    firstname: data.user?.firstname || null,
    lastname: data.user?.lastname || null,
    picture: data.user?.picture || null,
    provider: data.user?.provider || null,
    lastLoginMethod: data.user?.lastLoginMethod || null,
    lastLoginAt: data.user?.lastLoginAt || null,
    error: null,
  });
};

export const useGoogleLoginStore = create<TGoogleLoginState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  role: null,
  newUser: null,
  email: null,
  firstname: null,
  lastname: null,
  picture: null,
  provider: null,
  lastLoginMethod: null,
  lastLoginAt: null,

  googleLogin: (rememberMe: 'true' | 'false', usePopup: boolean = true) => {
    set({ loading: true, error: null });

    // Add remember parameter to URL
    const oauthURL = `${API_AUTH_SOCIAL_GOOGLE_URL}?remember=${rememberMe}`;
    console.log("oauthURL: ", oauthURL);

    // Redirect mode (full page)
    if (!usePopup) {
      window.location.href = oauthURL;
      return;
    }

    // Open popup
    const popup = window.open(
      oauthURL,
      "google-oauth",
      "width=500,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      set({
        loading: false,
        error: "Popup blocked. Please allow popups for this site.",
      });
      return;
    }

    let messageReceived = false;

    const handleMessage = (ev: MessageEvent<TGoogleLoginResponse>) => {
      // Strict origin check
      if (ev.origin !== BACKEND_ORIGIN) {
        console.warn("Ignored message from unexpected origin:", ev.origin);
        return;
      }

      // Check message type
      if (!ev.data || !ev.data.type?.startsWith("GOOGLE_AUTH_")) {
        return;
      }

      messageReceived = true;
      window.removeEventListener("message", handleMessage);
      clearInterval(popupChecker);

      // Try closing popup
      try {
        if (popup && !popup.closed) {
          popup.close();
        }
      } catch (e) {
        console.debug("Popup close blocked:", e);
      }

      FINISH_LOGIN(ev.data);
    };

    // Listen for postMessage
    window.addEventListener("message", handleMessage);

    // Check if popup was closed manually
    const popupChecker = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupChecker);
        window.removeEventListener("message", handleMessage);

        if (!messageReceived) {
          set({
            loading: false,
            error: "Login cancelled or popup closed",
          });
        }
      }
    }, 500);
  },

  clearToken: () => {
    // Use centralized cookie clearing
    clearAuthCookies();

    // Clear user data from store
    useGetCurrentUserStore.getState().clearUser();

    set({
      loading: false,
      error: null,
      isAuthenticated: false,
      message: null,
      role: null,
      newUser: null,
      email: null,
      firstname: null,
      lastname: null,
      picture: null,
      provider: null,
      lastLoginMethod: null,
      lastLoginAt: null,
    });
  },
}));
