import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { clearAuthCookies, setSessionRole } from "@/utils/auth/cookie-manager";
import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth.api.constant";
import { create } from "zustand";
import { useGetCurrentUserStore } from "../users/get-current-user.store";
import { IUserAuthResponse } from "@/utils/interfaces/auth/auth.interface";

/* ---------------------------------- States --------------------------------- */
// ── Login API Response ─────────────────────────────────
type TLoginResponse = {
  message: string;
  user?: IUserAuthResponse;
  requiresTwoFactor?: boolean;
  userId?: string;
};

// ── Login State ────────────────────────────────────────
type TLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  user: IUserAuthResponse | null;
  requiresTwoFactor: boolean;
  pendingUserId: string | null;
  pendingRememberMe: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  clearToken: () => void;
  clearTwoFactorPending: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useLoginStore = create<TLoginState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  user: null,
  requiresTwoFactor: false,
  pendingUserId: null,
  pendingRememberMe: false,
  login: async (identifier: string, password: string, rememberMe: boolean) => {
    set({
      loading: true,
      error: null,
      requiresTwoFactor: false,
      pendingUserId: null,
    });

    try {
      const response = await axios.post<TLoginResponse>(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });
      const { message, requiresTwoFactor, userId, user } = response.data;

      if (requiresTwoFactor && userId) {
        set({
          loading: false,
          error: null,
          isAuthenticated: false,
          requiresTwoFactor: true,
          pendingUserId: userId,
          pendingRememberMe: rememberMe,
          message: null,
        });
        return;
      }

      setSessionRole(user?.role, rememberMe);

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        message,
        user: user ?? null,
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
  clearTwoFactorPending: () => {
    set({
      requiresTwoFactor: false,
      pendingUserId: null,
      pendingRememberMe: false,
    });
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
      set({
        isAuthenticated: false,
        message: null,
        error: null,
        loading: false,
      });
    }
  },
}));
