import axios from "@/lib/axios";
import { API_REMOVE_ONE_OPEN_POSITION } from "@/utils/constants/apis/company_url";
import { create } from "zustand";

type TRemoveOneOpenPositionResponse = {
  message: string | null;
};

type TRemoveOneOpenPositionState = TRemoveOneOpenPositionResponse & {
  loading: boolean;
  error: string | null;
  removeOneOpenPosition: (
    companyID: string,
    openPositionID: string
  ) => Promise<void>;
};

export const useRemoveOneOpenPositionStore =
  create<TRemoveOneOpenPositionState>((set) => ({
    message: null,
    loading: false,
    error: null,
    removeOneOpenPosition: async (
      _companyID: string,
      _openPositionID: string
    ) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.post<TRemoveOneOpenPositionResponse>(
          API_REMOVE_ONE_OPEN_POSITION(_companyID, _openPositionID)
        );
        set({ message: response.data.message, error: null, loading: false });
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
            error: "An error occurred while removing company's open position",
          });
        }
      }
    },
  }));
