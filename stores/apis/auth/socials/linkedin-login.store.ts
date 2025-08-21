import { setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_LINKEDIN_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";

// --- Types ---
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
  setRole: (role: TUserRole) => void;
  linkedinLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

// --- Constants ---
const BACKEND_ORIGIN = API_AUTH_SOCIAL_LINKEDIN_URL.split("/social")[0];

// --- Shared Logic ---
const FINISH_LOGIN = (data: TLinkedInLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  // Update Zustand in-memory store
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

// --- Main Store ---
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

  setRole: (role: TUserRole) => set({ role }),

  initialize: () => {
    // Authentication state is determined by HTTP-only cookies
    set({ isAuthenticated: true });
  },

  linkedinLogin: (rememberMe: boolean, usePopup = true) => {
    set({ loading: true, error: null });

    const url = API_AUTH_SOCIAL_LINKEDIN_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "linkedin-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TLinkedInLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);
      try {
        if (popup) {
          popup.close();
        }
      } catch (error) {
        console.debug("Popup close handled by browser security policy");
      }
      console.log("LinkedIn Data Response: ", ev.data);
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
