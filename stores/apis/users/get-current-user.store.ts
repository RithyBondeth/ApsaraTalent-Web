import { API_GET_CURRENT_USER_URL } from "@/utils/constants/apis/user_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TGetCurrentUserState = {
  loading: boolean;
  error: string | null;
  user: IUser | null;
  getCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

export const useGetCurrentUserStore = create<TGetCurrentUserState>((set) => ({
  loading: false,
  error: null,
  user: null,
  getCurrentUser: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IUser>(API_GET_CURRENT_USER_URL);
      console.log("Current User Response: ", response.data);
      set({
        loading: false,
        user: response.data,
        error: null,
      });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      else
        set({
          loading: false,
          error: "An error occurred while fetching current user.",
        });
    }
  },
  clearUser: () => {
    set({
      user: null,
      loading: false,
      error: null,
    });
  },
}));
