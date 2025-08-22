import { create } from "zustand";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_FACEBOOK_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";
import { setAuthCookies, clearAuthCookies, hasAuthToken } from "@/utils/auth/cookie-manager";

// --- Types ---
export type TFacebookLoginResponse = {
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

export type TFacebookLoginState = {
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
  facebookLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

// --- Constants ---
const BACKEND_ORIGIN = API_AUTH_SOCIAL_FACEBOOK_URL.split("/social")[0];

// --- Shared Logic ---
const FINISH_LOGIN = (data: TFacebookLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  // Update Zustand in-memory store
  useFacebookLoginStore.setState({
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

  // Set secure cookies if accessToken exists
  if (data.accessToken && data.refreshToken) {
    setAuthCookies(data.accessToken, data.refreshToken, rememberMe);
  }
};

// --- Main Store ---
export const useFacebookLoginStore = create<TFacebookLoginState>((set) => ({
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
    try {
      const hasValidAuth = hasAuthToken();
      
      console.log("Facebook login store initialization:", {
        hasAuthToken: hasValidAuth,
        isAuthenticated: hasValidAuth
      });
      
      set({ 
        isAuthenticated: hasValidAuth,
        error: null,
        loading: false
      });
    } catch (error) {
      console.error("Error during Facebook login store initialization:", error);
      set({ 
        isAuthenticated: false,
        error: null,
        loading: false
      });
    }
  },

  facebookLogin: (rememberMe: boolean, usePopup = true) => {
    set({ loading: true, error: null });

    const url = API_AUTH_SOCIAL_FACEBOOK_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "facebook-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TFacebookLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);
      try {
        if (popup) {
          popup.close();
        }
      } catch (error) {
        console.debug("Popup close handled by browser security policy");
      }
      console.log("Facebook Data Response: ", ev.data);
      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
  },

  clearToken: () => {
    try {
      // Use centralized cookie clearing
      clearAuthCookies();
      
      // Clear user data from store
      useGetCurrentUserStore.getState().clearUser();
      
      // Reset Facebook login state
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
      
    } catch (error) {
      console.error("Error clearing Facebook tokens:", error);
      // Still update state even if clearing failed
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
    }
  },
}));
