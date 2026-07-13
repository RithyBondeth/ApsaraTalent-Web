import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_RESUME_COVER_LETTER_PDF_URL } from "@/utils/constants/apis/resume.api.constant";
import { IGenerateCoverLetterPdfResponse } from "@/utils/interfaces/resume";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Generate Cover Letter Pdf Payload ─────────────────────────────
type TGenerateCoverLetterPdfPayload = {
  employeeName: string;
  employeeJob?: string;
  companyName: string;
  companyIndustry?: string;
  coverLetterText: string;
  style: string;
};

// ── Cover Letter Pdf State ────────────────────────────────────────
type TCoverLetterPdfState = {
  loading: boolean;
  error: string | null;
  data: IGenerateCoverLetterPdfResponse | null;
  generateCoverLetterPdf: (
    payload: TGenerateCoverLetterPdfPayload,
  ) => Promise<IGenerateCoverLetterPdfResponse>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useCoverLetterPdfStore = create<TCoverLetterPdfState>((set) => ({
  loading: false,
  error: null,
  data: null,
  generateCoverLetterPdf: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<IGenerateCoverLetterPdfResponse>(
        API_RESUME_COVER_LETTER_PDF_URL,
        payload,
      );
      set({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to generate cover letter PDF",
      );
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
