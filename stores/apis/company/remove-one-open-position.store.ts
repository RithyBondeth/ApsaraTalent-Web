import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
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
    openPositionID: string,
  ) => Promise<void>;
};

export const useRemoveOneOpenPositionStore =
  create<TRemoveOneOpenPositionState>((set) => ({
    message: null,
    loading: false,
    error: null,
    removeOneOpenPosition: async (
      _companyID: string,
      _openPositionID: string,
    ) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.delete<TRemoveOneOpenPositionResponse>(
          API_REMOVE_ONE_OPEN_POSITION(_companyID, _openPositionID),
        );
        set({ message: response.data.message, error: null, loading: false });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing company's open position",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }));
