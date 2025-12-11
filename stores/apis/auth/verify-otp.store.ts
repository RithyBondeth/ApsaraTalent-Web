import { API_AUTH_VERIFY_OTP_URL } from "@/utils/constants/apis/auth_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";
import { useGetCurrentUserStore } from "../users/get-current-user.store";
import { setAuthCookies, clearAuthCookies, hasAuthToken } from "@/utils/auth/cookie-manager";
import { TUserAuthResponse } from "@/utils/constants/auth.constant";

type TVerifyOTPResponse = {
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: TUserAuthResponse | null;
};

type TVerifyOTPStoreState = TVerifyOTPResponse & {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  verifyOtp: (phone: string, otpCode: string, rememberMe: boolean) => Promise<IUser>;
  clearToken: () => void;
};

export const useVerifyOTPStore = create<TVerifyOTPStoreState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
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
        }
      );

      set({
        loading: false,
        isAuthenticated: !!response.data.accessToken,
        message: response.data.message,
        error: null
      });
      
      // Use centralized cookie management
      if (response.data.accessToken && response.data.refreshToken) {
        setAuthCookies(response.data.accessToken, response.data.refreshToken, rememberMe);
      }
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message instanceof Array
            ? error.response.data.message.join(", ")
            : error.response?.data?.message || error.message;

        set({ loading: false, error: errorMessage, isAuthenticated: false });
        throw new Error(errorMessage);
      } else {
        set({
          loading: false,
          error: "An error occurred while verifying otp.",
          message: "An error occurred while verifying otp.",
          isAuthenticated: false,
        });
        throw new Error("An error occurred while verifying otp.");
      }
    }
  },
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