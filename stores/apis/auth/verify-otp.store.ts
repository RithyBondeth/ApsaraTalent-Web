import { API_AUTH_VERIFY_OTP_URL } from "@/utils/constants/apis/auth_url";
import axios from "axios";
import { create } from "zustand";

type TVerifyOTPResponse = {
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type TVerifyOTPStoreState = TVerifyOTPResponse & {
  loading: boolean;
  error: string | null;
  verifyOtp: (phone: string, otpCode: string) => Promise<void>;
};

export const useVerifyOTPStore = create<TVerifyOTPStoreState>((set) => ({
  loading: false,
  error: null,
  message: null,
  accessToken: null,
  refreshToken: null,
  verifyOtp: async (phone: string, otpCode: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TVerifyOTPResponse>(
        API_AUTH_VERIFY_OTP_URL,
        {
          phone: phone,
          otp: otpCode,
        }
      );

      set({
        loading: false,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        message: response.data.message,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message instanceof Array
            ? error.response.data.message.join(", ")
            : error.response?.data?.message || error.message;

        set({ loading: false, error: errorMessage });
      } else {
        set({
          loading: false,
          error: "An error occurred while verifying otp.",
        });
      }
    }
  },
}));
