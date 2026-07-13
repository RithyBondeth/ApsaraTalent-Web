import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { setSessionRole } from "@/utils/auth/cookie-manager";
import { IUserAuthResponse } from "@/utils/interfaces/auth/auth.interface";
import {
  API_2FA_DISABLE_URL,
  API_2FA_ENABLE_URL,
  API_2FA_SETUP_URL,
  API_2FA_VERIFY_LOGIN_URL,
} from "@/utils/constants/apis/two-factor.api.constant";
import { create } from "zustand";

/* ---------------------------------- Types ---------------------------------- */
// ── API Response Types ──────────────────────────────────
type T2FASetupResponse = {
  qrCodeUrl: string;
  secret: string;
};

// ── API Response Types ──────────────────────────────────
type T2FAVerifyLoginResponse = {
  user: IUserAuthResponse;
};

/* ---------------------------------- States --------------------------------- */
type T2FAState = {
  loading: boolean;
  error: string | null;
  qrCodeUrl: string | null;
  secret: string | null;
  setup: () => Promise<void>;
  enable: (otp: string) => Promise<boolean>;
  disable: (otp: string) => Promise<boolean>;
  verifyLogin: (
    userId: string,
    otp: string,
    rememberMe: boolean,
  ) => Promise<boolean>;
  reset: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useTwoFactorStore = create<T2FAState>()((set) => ({
  loading: false,
  error: null,
  qrCodeUrl: null,
  secret: null,

  setup: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<T2FASetupResponse>(API_2FA_SETUP_URL);
      set({
        loading: false,
        qrCodeUrl: response.data.qrCodeUrl,
        secret: response.data.secret,
      });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(error, "Failed to set up 2FA"),
      });
    }
  },

  enable: async (otp: string) => {
    set({ loading: true, error: null });
    try {
      await axios.post(API_2FA_ENABLE_URL, { otp });
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(error, "Invalid code. Please try again."),
      });
      return false;
    }
  },

  disable: async (otp: string) => {
    set({ loading: true, error: null });
    try {
      await axios.post(API_2FA_DISABLE_URL, { otp });
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(error, "Invalid code. Please try again."),
      });
      return false;
    }
  },

  verifyLogin: async (userId: string, otp: string, rememberMe: boolean) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<T2FAVerifyLoginResponse>(
        API_2FA_VERIFY_LOGIN_URL,
        { userId, otp },
      );
      setSessionRole(response.data.user.role, rememberMe);
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(error, "Invalid code. Please try again."),
      });
      return false;
    }
  },

  reset: () =>
    set({ loading: false, error: null, qrCodeUrl: null, secret: null }),
}));
