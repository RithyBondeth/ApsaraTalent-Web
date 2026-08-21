import {
  API_AUTH_RESEND_EMAIL_OTP_URL,
  API_AUTH_VERIFY_EMAIL_URL,
} from "@/utils/constants/apis/auth.api.constant";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "@/lib/axios";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
type TVerifyEmailResponse = {
  message: string | null;
};

type TVerifyEmailState = TVerifyEmailResponse & {
  loading: boolean;
  resending: boolean;
  error: null | string;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  reset: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useVerifyEmailStore = create<TVerifyEmailState>((set) => ({
  message: null,
  loading: false,
  resending: false,
  error: null,

  // Returns whether it succeeded so the page can act on the outcome directly.
  // The previous version only wrote to state, which forced the caller into an
  // effect that re-fired on every unrelated render.
  verifyEmail: async (email: string, otp: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TVerifyEmailResponse>(
        API_AUTH_VERIFY_EMAIL_URL,
        { email, otp },
      );
      set({ message: response.data.message, loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while verifying email.",
      );
      set({ loading: false, error: errorMessage, message: null });
      return false;
    }
  },

  resendOtp: async (email: string) => {
    set({ resending: true, error: null });

    try {
      const response = await axios.post<TVerifyEmailResponse>(
        API_AUTH_RESEND_EMAIL_OTP_URL,
        { email },
      );
      set({ message: response.data.message, resending: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while resending the code.",
      );
      set({ resending: false, error: errorMessage });
      return false;
    }
  },

  reset: () =>
    set({ message: null, loading: false, resending: false, error: null }),
}));
