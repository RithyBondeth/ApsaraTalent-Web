import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { clearAuthCookies, setAuthCookies } from "@/utils/auth/cookie-manager";
import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import { useGetCurrentUserStore } from "../users/get-current-user.store";
import { IUserAuthResponse } from "@/utils/interfaces/auth/auth.interface";

/* ---------------------------------- States --------------------------------- */
// ── Login API Response ─────────────────────────────────
type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  message: string;
  user: IUserAuthResponse;
};

// ── Login State ────────────────────────────────────────
type TLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  user: IUserAuthResponse | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  clearToken: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useLoginStore = create<TLoginState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  user: null,
  login: async (identifier: string, password: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TLoginResponse>(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });
      const { accessToken, refreshToken, message } = response.data;

      // Set cookies for secure token storage
      console.log("Setting auth cookies...", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        rememberMe,
      });

      // Use centralized cookie management
      setAuthCookies(accessToken, refreshToken, rememberMe);

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        message,
        user: response.data.user,
      });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while login",
      );
      set({
        loading: false,
        error: errorMessage,
        message: errorMessage,
        isAuthenticated: false,
      });
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
