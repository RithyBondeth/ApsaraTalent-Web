import { create } from "zustand";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_LINKEDIN_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";
import { 
  setAuthCookies, 
  clearAuthCookies, 
  hasAuthToken 
} from "@/utils/auth/cookie-manager";
import { EAuthLoginMethod } from "@/utils/constants/auth.constant";

// Types
export type TLinkedInLoginResponse = {
  newUser: boolean | null;
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  picture: string | null;
  provider: string | null;
  role: string | null;
  lastLoginMethod: EAuthLoginMethod | null;
  lastLoginAt: string | null;
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
  linkedinLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

// Backend origin (correct & safe)
const BACKEND_ORIGIN = new URL(API_AUTH_SOCIAL_LINKEDIN_URL).origin;

// Shared finish logic
const FINISH_LOGIN = (data: TLinkedInLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  useLinkedInLoginStore.setState({
    loading: false,
    isAuthenticated: !!data.accessToken,
    message: data.message,
    role: data.role,
    newUser: data.newUser,
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    picture: data.picture,
    provider: data.provider,
    lastLoginMethod: data.lastLoginMethod,
    lastLoginAt: data.lastLoginAt,
  });

  if (data.accessToken && data.refreshToken) {
    setAuthCookies(data.accessToken, data.refreshToken, rememberMe);
  }
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

  setRole: (role: TUserRole) => set({ role }),

  // Initialization
  initialize: () => {
    try {
      const hasValid = hasAuthToken();

      set({
        isAuthenticated: hasValid,
        loading: false,
        error: null,
      });
    } catch {
      set({
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  // LinkedIn Login Logic
  linkedinLogin: (rememberMe: boolean, usePopup = true) => {
    set({ loading: true, error: null });

    const url = API_AUTH_SOCIAL_LINKEDIN_URL;

    // Redirect version
    if (!usePopup) {
      window.location.href = url;
      return;
    }

    // Popup version
    const popup = window.open(url, "linkedin-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TLinkedInLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;

      window.removeEventListener("message", handler);

      try {
        popup.close();
      } catch {}

      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
    
  },

  // Clear Token
  clearToken: () => {
    try {
      clearAuthCookies();
      useGetCurrentUserStore.getState().clearUser();
    } catch {}

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