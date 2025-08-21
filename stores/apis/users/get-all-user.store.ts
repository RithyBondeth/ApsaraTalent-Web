import { API_GET_ALL_USERS_URL } from "@/utils/constants/apis/user_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TGetAllUsersStoreState = {
  error: string | null;
  loading: boolean;
  users: IUser[] | null;
  getAllUsers: () => Promise<void>;
};

export const useGetAllUsersStore = create<TGetAllUsersStoreState>((set) => ({
  error: null,
  loading: false,
  users: null,
  getAllUsers: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IUser[]>(API_GET_ALL_USERS_URL);
      set({ users: response.data, loading: false, error: null });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      else
        set({
          loading: false,
          error: "An error occurred while fetching all users",
        });
    }
  },
}));
