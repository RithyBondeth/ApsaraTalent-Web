import { API_GET_ONE_USER_URL } from "@/utils/constants/apis/user_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { create } from "zustand";

type TGetOneUserState = {
  error: string | null;
  loading: boolean;
  user: IUser | null;
  getOneUerByID: (userID: string) => Promise<void>;
};

export const useGetOneUserStore = create<TGetOneUserState>((set) => ({
  error: null,
  loading: false,
  user: null,
  getOneUerByID: async (userID: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IUser>(API_GET_ONE_USER_URL(userID));
      set({ user: response.data, loading: false, error: null });
      console.log(API_GET_ONE_USER_URL(userID));
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      else
        set({
          loading: false,
          error: "An error occurred while fetching a user.",
        });
    }
  },
}));
