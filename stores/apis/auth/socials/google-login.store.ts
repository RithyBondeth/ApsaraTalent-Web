import { setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_GOOGLE_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";
import { EAuthLoginMethod } from "@/utils/constants/auth.constant";

export type TGoogleLoginResponse = {
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
  setRole: (role: TUserRole) => void;
  googleLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

const BACKEND_ORIGIN = API_AUTH_SOCIAL_GOOGLE_URL.split("/social")[0];

const FINISH_LOGIN = (data: TGoogleLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  // Update Zustand in-memory store
  useGoogleLoginStore.setState({
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

  // Set HTTP-only cookies if accessToken exists
  if (data.accessToken) {
    setCookie("auth-token", data.accessToken, {
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,

      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    if (data.refreshToken) {
      setCookie("refresh-token", data.refreshToken, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,

        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
  }
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
  setRole: (role: TUserRole) => set({ role: role }),
  initialize: () => {
    // Authentication state is determined by HTTP-only cookies
    set({ isAuthenticated: true });
  },

  googleLogin: (rememberMe: boolean, usePopup: boolean = true) => {
    set({ loading: true, error: null });

    const url = API_AUTH_SOCIAL_GOOGLE_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "google-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TGoogleLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);

      // Safely close popup - handle CORP policy errors
      try {
        if (popup) {
          popup.close();
        }
      } catch (error) {
        // Silently handle CORP policy errors - popup will close itself or user can close manually
        console.debug("Popup close handled by browser security policy");
      }

      console.log("Google Data Response: ", ev.data);
      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
  },

  clearToken: () => {
    // Delete cookies with all possible options to ensure removal
    deleteCookie("auth-token", { path: "/" });
    deleteCookie("refresh-token", { path: "/" });

    // Also try to delete without specifying options (fallback)
    deleteCookie("auth-token");
    deleteCookie("refresh-token");

    // Clear local/session storage as well
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("refresh-token");
    }

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
    });
  },
}));
