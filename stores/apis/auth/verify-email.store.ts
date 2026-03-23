import { API_AUTH_VERIFY_EMAIL_URL } from "@/utils/constants/apis/auth_url";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import axios from "axios";
import { create } from "zustand";

type TVerifyEmailResponse = {
  message: string | null;
};

type TVerifyEmailState = TVerifyEmailResponse & {
  loading: boolean;
  error: null | string;
  verifyEmail: (emailVerificationToken: string) => Promise<void>;
};

export const useVerifyEmailStore = create<TVerifyEmailState>((set) => ({
  message: null,
  loading: false,
  error: null,
  verifyEmail: async (emailVerificationToken: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TVerifyEmailResponse>(
        API_AUTH_VERIFY_EMAIL_URL(emailVerificationToken),
      );
      set({ message: response.data.message, loading: false, error: null });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while verifying email.",
      );

      set({ loading: false, error: errorMessage, message: errorMessage });
    }
  },
}));
