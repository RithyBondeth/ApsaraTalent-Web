import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import axios from "@/lib/axios";
import { deleteCookie, setCookie } from "cookies-next";
import { useGetCurrentUserStore } from "../users/get-current-user.store";

type TLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
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
  initialize: () => {
    // Authentication state is now determined by HTTP-only cookies
    // which are handled by the server/middleware
    set({ isAuthenticated: true });
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

      setCookie("auth-token", accessToken, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days for "remember me"
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      setCookie("refresh-token", refreshToken, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      console.log(
        "Cookies set, checking document.cookie:",
        typeof document !== "undefined" ? document.cookie : "N/A"
      );

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        message,
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
    console.log("Clearing tokens from login store...");

    // Method 1: Use cookies-next library
    deleteCookie("auth-token", { path: "/" });
    deleteCookie("refresh-token", { path: "/" });
    deleteCookie("auth-token");
    deleteCookie("refresh-token");

    // Method 2: Native browser cookie clearing
    if (typeof document !== "undefined") {
      // Clear cookies by setting them to expire in the past
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Also try with different domains
      const hostname = window.location.hostname;
      document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      document.cookie = `refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      document.cookie = `refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
    }

    // Clear local/session storage as well
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("refresh-token");
    }

    useGetCurrentUserStore.getState().clearUser();
    set({
      isAuthenticated: false,
      message: null,
      error: null,
    });

    console.log("Tokens cleared from login store");
  },
}));
