import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_RESUME_INTERVIEW_PREP_PDF_URL } from "@/utils/constants/apis/resume.api.constant";
import { IGenerateCoverLetterPdfResponse } from "@/utils/interfaces/resume";
import { IAiInterviewPrepQuestion } from "@/utils/interfaces/resume";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Generate Interview Prep Pdf Payload ─────────────────────────────
type TGenerateInterviewPrepPdfPayload = {
  interviewTitle: string;
  companyName: string;
  questions: IAiInterviewPrepQuestion[];
};

// ── Interview Prep Pdf State ────────────────────────────────────────
type TInterviewPrepPdfState = {
  loading: boolean;
  error: string | null;
  data: IGenerateCoverLetterPdfResponse | null;
  generateInterviewPrepPdf: (
    payload: TGenerateInterviewPrepPdfPayload,
  ) => Promise<IGenerateCoverLetterPdfResponse>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useInterviewPrepPdfStore = create<TInterviewPrepPdfState>(
  (set) => ({
    loading: false,
    error: null,
    data: null,
    generateInterviewPrepPdf: async (payload) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<IGenerateCoverLetterPdfResponse>(
          API_RESUME_INTERVIEW_PREP_PDF_URL,
          payload,
        );
        set({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "Failed to generate interview prep PDF",
        );
        set({ loading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    },
  }),
);
