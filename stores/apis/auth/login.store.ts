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
  twoFactorToken?: string;
};

// ── Login State ────────────────────────────────────────
type TLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  user: IUserAuthResponse | null;
  requiresTwoFactor: boolean;
  pendingTwoFactorToken: string | null;
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
  pendingTwoFactorToken: null,
  pendingRememberMe: false,
  login: async (identifier: string, password: string, rememberMe: boolean) => {
    set({
      loading: true,
      error: null,
      requiresTwoFactor: false,
      pendingTwoFactorToken: null,
    });

    try {
      const response = await axios.post<TLoginResponse>(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });
      const { message, requiresTwoFactor, twoFactorToken, user } =
        response.data;

      // The server hands back a short-lived signed challenge rather than a
      // user id; it is the only thing that proves to verify-login that this
      // browser just cleared the password step.
      if (requiresTwoFactor && twoFactorToken) {
        set({
          loading: false,
          error: null,
          isAuthenticated: false,
          requiresTwoFactor: true,
          pendingTwoFactorToken: twoFactorToken,
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
      pendingTwoFactorToken: null,
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
