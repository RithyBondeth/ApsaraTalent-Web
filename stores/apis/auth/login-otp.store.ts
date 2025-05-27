import { API_AUTH_LOGIN_OTP_URL } from "@/utils/constants/apis/auth_url";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TLoginOTPResponse = {
  message: string | null;
  isSuccess: boolean;
};

type TLoginOTPState = TLoginOTPResponse & {
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  loginOtp: (phone: string, rememberMe: boolean) => Promise<void>;
};

export const useLoginOTPStore = create<TLoginOTPState>((set) => ({
  loading: false,
  error: null,
  message: null,
  isSuccess: false,
  rememberMe: false,
  loginOtp: async (phone: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TLoginOTPResponse>(
        API_AUTH_LOGIN_OTP_URL,
        { phone: phone }
      );
      console.log("Login OTP Response: ", response);
      if(rememberMe)
          useLocalLoginOTPStore.setState({  
            isSuccess: response.data.isSuccess,
            message: response.data.message,
         });
      else 
        useSessionLoginOTPStore.setState({  
          isSuccess: response.data.isSuccess,
          message: response.data.message,
        });
        
      set({
        loading: false,
        error: null,
        message: response.data.message,
        isSuccess: response.data.isSuccess,
        rememberMe: rememberMe,
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

export const useLocalLoginOTPStore = create<TLoginOTPResponse>()(
  persist(
    (set) => ({
      isSuccess: true,
      message: null,
    }),
    {
      name: "LoginOTPStore-local",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSessionLoginOTPStore = create<TLoginOTPResponse>()(
  persist(
    (set) => ({
      isSuccess: true,
      message: null,
    }),
    {
      name: "LoginOTPStore-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);