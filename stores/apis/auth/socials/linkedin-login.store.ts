import { create } from "zustand";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_LINKEDIN_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";
import { getCookie } from "cookies-next";
import { EAuthLoginMethod } from "@/utils/constants/auth.constant";
import { clearAuthCookies } from "@/utils/auth/cookie-manager";

// Updated response type - NO TOKENS
export type TLinkedInLoginResponse = {
  type: "LINKEDIN_AUTH_SUCCESS" | "LINKEDIN_AUTH_ERROR";
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

export type TLinkedInLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  role: string | null;
  newUser: boolean | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  picture: string | null;
  provider: string | null;
  lastLoginMethod: EAuthLoginMethod | null;
  lastLoginAt: string | null;
  setRole: (role: TUserRole) => void;
  linkedinLogin: (rememberMe: "true" | "false", usePopup?: boolean) => void;
  clearToken: () => void;
};

// Backend origin (SAFE)
const BACKEND_ORIGIN = new URL(API_AUTH_SOCIAL_LINKEDIN_URL).origin;

// Shared Finish Logic
const FINISH_LOGIN = (data: TLinkedInLoginResponse) => {
  if (!data || data.type !== "LINKEDIN_AUTH_SUCCESS") {
    useLinkedInLoginStore.setState({
      loading: false,
      error: data?.error || "Authentication failed",
      isAuthenticated: false,
    });
    return;
  }

  // Cookies are already set by backend (httpOnly)
  // Just update the Zustand store with user info
  useLinkedInLoginStore.setState({
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

// Zustand Store
export const useLinkedInLoginStore = create<TLinkedInLoginState>((set) => ({
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
  setRole: (role: TUserRole) => set({ role: role }),
  // LinkedIn Login
  linkedinLogin: (rememberMe: "true" | "false", usePopup = true) => {
    set({ loading: true, error: null });

    // Add remember parameter to URL
    const url = `${API_AUTH_SOCIAL_LINKEDIN_URL}?remember=${rememberMe}`;

    // Redirect (no popup)
    if (!usePopup) {
      window.location.href = url;
      return;
    }

    // Popup
    const popup = window.open(
      url,
      "linkedin-oauth",
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

    const handleMessage = (ev: MessageEvent<TLinkedInLoginResponse>) => {
      // Strict origin check
      if (ev.origin !== BACKEND_ORIGIN) {
        console.warn("Ignored message from unexpected origin:", ev.origin);
        return;
      }

      // Check message type
      if (!ev.data || !ev.data.type?.startsWith("LINKEDIN_AUTH_")) {
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

  // Clear Token
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
