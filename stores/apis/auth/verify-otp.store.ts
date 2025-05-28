import { API_AUTH_VERIFY_OTP_URL } from "@/utils/constants/apis/auth_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TVerifyOTPResponse = {
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  
};

type TVerifyOTPStoreState = TVerifyOTPResponse & {
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  verifyOtp: (phone: string, otpCode: string, rememberMe: boolean) => Promise<IUser>;
  clearToken: () => void;
};

export const useVerifyOTPStore = create<TVerifyOTPStoreState>((set) => ({
  loading: false,
  error: null,
  message: null,
  accessToken: null,
  refreshToken: null,
  rememberMe: false,
  verifyOtp: async (phone: string, otpCode: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TVerifyOTPResponse & { user: IUser }>(
        API_AUTH_VERIFY_OTP_URL,
        {
          phone: phone,
          otp: otpCode,
        }
      );

      if(rememberMe) 
        useLocalVerifyOTPStore.setState({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          message: response.data.message,
        });
      else 
        useSessionVerifyOTPStore.setState({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          message: response.data.message,
        });

      set({
        loading: false,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        message: response.data.message,
        rememberMe: rememberMe,
      });

      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message instanceof Array
            ? error.response.data.message.join(", ")
            : error.response?.data?.message || error.message;

        set({ loading: false, error: errorMessage });
        throw new Error(errorMessage);
      } else {
        set({
          loading: false,
          error: "An error occurred while verifying otp.",
        });
        throw new Error("An error occurred while verifying otp.");
      }
    }
  },
  clearToken: () => {
    localStorage.removeItem("VerifyOTPStore-local");
    sessionStorage.removeItem("VerifyOTPStore-session");
    set({
      accessToken: null,
      refreshToken: null,
      message: null,
      rememberMe: false,
    });
  },
}));

export const useLocalVerifyOTPStore = create<TVerifyOTPResponse>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      message: null,
    }),
    {
      name: "VerifyOTPStore-local",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSessionVerifyOTPStore = create<TVerifyOTPResponse>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      message: null,
    }),
    {
      name: "VerifyOTPStore-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);