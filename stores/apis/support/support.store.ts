import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_REPORT_PROBLEM_URL } from "@/utils/constants/apis/support.api.constant";
import { TReportProblemPayload } from "@/utils/types/report-problem/report-problem.type";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
type TSupportState = {
  reporting: boolean;
  error: string | null;
  reportProblem: (payload: TReportProblemPayload) => Promise<boolean>;
};

/* ---------------------------------- Store --------------------------------- */
export const useSupportStore = create<TSupportState>((set) => ({
  reporting: false,
  error: null,

  reportProblem: async (payload: TReportProblemPayload) => {
    set({ reporting: true });
    try {
      await apiClient.post(API_REPORT_PROBLEM_URL, payload);
      set({ reporting: false, error: null });
      return true;
    } catch (error) {
      set({
        reporting: false,
        error: extractApiErrorMessage(error, "Failed to submit report"),
      });
      return false;
    }
  },
}));
