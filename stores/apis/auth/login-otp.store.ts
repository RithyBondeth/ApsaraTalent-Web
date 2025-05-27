import { API_AUTH_LOGIN_OTP_URL } from "@/utils/constants/apis/auth_url";
import axios from "axios";
import { create } from "zustand";

type TLoginOTPResponse = {
  message: string | null;
  isSuccess: boolean;
};

type TLoginOTPState = TLoginOTPResponse & {
  loading: boolean;
  error: string | null;
  loginOtp: (phone: string) => Promise<void>;
};

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
        { phone: phone }
      );
      console.log("Login OTP Response: ", response);

      set({
        loading: false,
        error: null,
        message: response.data.message,
        isSuccess: response.data.isSuccess,
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
          error: "An error occurred while sending otp.",
        });
      }
    }
  },
}));
