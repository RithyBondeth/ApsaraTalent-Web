import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_RESUME_BUILDER_URL } from "@/utils/constants/apis/resume.api.constant";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { RESUME_GENERATION_TIMEOUT_MS } from "@/utils/constants/config.constant";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Generate Resume Response ─────────────────────────────────────
type TGenerateResumeResponse = {
  data: string; // base64
  mimeType: string;
  filename: string;
};

// ── Generate Resume State ────────────────────────────────────────
type TGenerateResumeState = {
  loading: boolean;
  error: string | null;
  data: TGenerateResumeResponse | null;
  generateResume: (payload: IBuildResume) => Promise<TGenerateResumeResponse>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useGenerateResumeStore = create<TGenerateResumeState>((set) => ({
  loading: false,
  error: null,
  data: null,
  generateResume: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<TGenerateResumeResponse>(
        API_RESUME_BUILDER_URL,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "json",
          timeout: RESUME_GENERATION_TIMEOUT_MS,
        },
      );
      set({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to build resume",
      );
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
