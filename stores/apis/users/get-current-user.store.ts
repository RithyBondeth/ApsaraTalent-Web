import { API_GET_CURRENT_USER_URL } from "@/utils/constants/apis/user_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";

type TGetCurrentUserState = {
  loading: boolean;
  error: string | null;
  user: IUser | null;
  getCurrentUser: (accessToken: string) => Promise<void>;
};

export const useGetCurrentUserStore = create<TGetCurrentUserState>((set) => ({
  loading: false,
  error: null,
  user: null,
  getCurrentUser: async (accessToken: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IUser>(
        API_GET_CURRENT_USER_URL,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Current User Response: ", response.data);
      set({ loading: false, user: response.data, error: null });
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
}));
