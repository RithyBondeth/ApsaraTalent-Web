import { API_AUTH_LOGIN_OTP_URL } from "@/utils/constants/apis/auth.api.constant";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "axios";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Login OTP API Response ─────────────────────────────────
type TLoginOTPResponse = {
  message: string | null;
};

// ── Login OTP State ────────────────────────────────────────
type TLoginOTPState = TLoginOTPResponse & {
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
  loginOtp: (phone: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useLoginOTPStore = create<TLoginOTPState>((set) => ({
  loading: false,
  error: null,
  message: null,
  isSuccess: false,
  loginOtp: async (phone: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TLoginOTPResponse>(
        API_AUTH_LOGIN_OTP_URL,
        { phone: phone },
      );

      set({
        loading: false,
        error: null,
        message: response.data.message,
        isSuccess: true,
      });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while sending otp.",
      );

      set({ loading: false, error: errorMessage, message: errorMessage });
    }
  },
}));
