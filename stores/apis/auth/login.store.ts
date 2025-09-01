import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import axios from "@/lib/axios";
import { useGetCurrentUserStore } from "../users/get-current-user.store";
import { setAuthCookies, clearAuthCookies, hasAuthToken } from "@/utils/auth/cookie-manager";
import { TUserAuthResponse } from "@/utils/constants/auth.constant";

type TLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  user: TUserAuthResponse | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  clearToken: () => void;
  initialize: () => void;
};

export const useLoginStore = create<TLoginState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  user: null,
  initialize: () => {
    try {
      const hasValidAuth = hasAuthToken();
      
      console.log("Login store initialization:", {
        hasAuthToken: hasValidAuth,
        isAuthenticated: hasValidAuth
      });
      
      set({ 
        isAuthenticated: hasValidAuth,
        error: null,
        loading: false
      });
    } catch (error) {
      console.error("Error during login store initialization:", error);
      set({ 
        isAuthenticated: false,
        error: null,
        loading: false
      });
    }
  },
  login: async (identifier: string, password: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });
      console.log("Login Response: ", response);
      const { accessToken, refreshToken, message } = response.data;

      // Set cookies for secure token storage
      console.log("Setting auth cookies...", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        rememberMe,
      });

      // Use centralized cookie management
      setAuthCookies(accessToken, refreshToken, rememberMe);

      console.log(
        "Cookies set, checking document.cookie:",
        typeof document !== "undefined" ? document.cookie : "N/A"
      );

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        message,
        user: response.data.user,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
          message: error.response?.data?.message || "Something went wrong",
          isAuthenticated: false,
        });
      } else {
        set({
          loading: false,
          error: "An error occurred while login",
          message: "An error occurred while login",
          isAuthenticated: false,
        });
      }
    }
  },
  clearToken: () => {
    try {
      // Use centralized cookie clearing
      clearAuthCookies();
      
      // Clear user data from store
      useGetCurrentUserStore.getState().clearUser();
      
      // Update authentication state
      set({
        isAuthenticated: false,
        message: null,
        error: null,
        loading: false,
      });
      
    } catch (error) {
      console.error("Error clearing tokens:", error);
      // Still update state even if clearing failed
      set({
        isAuthenticated: false,
        message: null,
        error: null,
        loading: false,
      });
    }
  },
}));
