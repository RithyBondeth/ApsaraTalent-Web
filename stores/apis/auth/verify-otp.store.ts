import { clearAuthCookies, setAuthCookies } from "@/utils/auth/cookie-manager";
import { API_AUTH_VERIFY_OTP_URL } from "@/utils/constants/apis/auth_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "axios";
import { create } from "zustand";
import { useGetCurrentUserStore } from "../users/get-current-user.store";
import { IUserAuthResponse } from "@/utils/interfaces/auth.interface";

/* ---------------------------------- States --------------------------------- */
// ── Verify OTP API Response ─────────────────────────────────
type TVerifyOTPResponse = {
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: IUserAuthResponse | null;
};

// ── Verify OTP State ────────────────────────────────────────
type TVerifyOTPStoreState = TVerifyOTPResponse & {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: string | null;
  message: string | null;
  verifyOtp: (
    phone: string,
    otpCode: string,
    rememberMe: boolean,
  ) => Promise<void>;
  clearToken: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useVerifyOTPStore = create<TVerifyOTPStoreState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  role: null,
  user: null,
  message: null,
  verifyOtp: async (phone: string, otpCode: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TVerifyOTPResponse & { user: IUser }>(
        API_AUTH_VERIFY_OTP_URL,
        {
          phone: phone,
          otp: otpCode,
        },
      );

      const role = response.data.user.role;
      const hasTokens =
        !!response.data.accessToken && !!response.data.refreshToken;
      const fullyAuthed = hasTokens && role !== "none";

      set({
        loading: false,
        isAuthenticated: fullyAuthed,
        message: response.data.message,
        role: response.data.user.role,
        error: null,
      });

      // Use centralized cookie management
      if (fullyAuthed) {
        setAuthCookies(
          response.data.accessToken!,
          response.data.refreshToken!,
          rememberMe,
        );
      } else {
        clearAuthCookies();
      }
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while verifying otp.",
      );

      set({
        loading: false,
        error: errorMessage,
        message: errorMessage,
        isAuthenticated: false,
      });
    }
  },
  // Clear Token
  clearToken: () => {
    try {
      // Use centralized cookie clearing
      clearAuthCookies();

      // Clear user data from store
      useGetCurrentUserStore.getState().clearUser();

      // Reset verify OTP state
      set({
        loading: false,
        error: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        message: null,
      });
    } catch (error) {
      console.error("Error clearing verify OTP tokens:", error);
      // Still update state even if clearing failed
      set({
        loading: false,
        error: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        message: null,
      });
    }
  },
}));
