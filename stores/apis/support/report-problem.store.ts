import { API_REPORT_PROBLEM_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import type { TProblemCategory } from "@/utils/types/support/report-problem.type";
import axios from "@/lib/axios";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
type TReportProblemResponse = {
  message: string | null;
};

type TReportProblemState = TReportProblemResponse & {
  loading: boolean;
  error: null | string;
  reportProblem: (
    category: TProblemCategory,
    details: string,
  ) => Promise<boolean>;
  reset: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useReportProblemStore = create<TReportProblemState>((set) => ({
  message: null,
  loading: false,
  error: null,

  reportProblem: async (category: TProblemCategory, details: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TReportProblemResponse>(
        API_REPORT_PROBLEM_URL,
        {
          category,
          details,
          // Diagnostic only — the API treats both as untrusted text and puts
          // them in the support email so a report arrives with the context
          // the reporter would otherwise have to describe by hand.
          pageUrl:
            typeof window === "undefined" ? undefined : window.location.href,
          userAgent:
            typeof navigator === "undefined" ? undefined : navigator.userAgent,
        },
      );
      set({ message: response.data.message, loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while sending your report.",
      );
      set({ loading: false, error: errorMessage, message: null });
      return false;
    }
  },

  reset: () => set({ message: null, loading: false, error: null }),
}));
