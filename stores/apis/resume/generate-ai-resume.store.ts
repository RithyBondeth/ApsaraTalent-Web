import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { RESUME_GENERATION_TIMEOUT_MS } from "@/utils/constants/config.constant";
import {
  API_RESUME_GENERATE_FROM_TEXT_URL,
  API_RESUME_GENERATE_URL,
} from "@/utils/constants/apis/resume.api.constant";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Generate Resume From Text API Payload ─────────────────────
export type TGenerateResumeFromTextPayload = {
  sourceText: string;
  template: TResumeTemplate;
};

// ── Generate AI Resume State ──────────────────────────────────
type TGenerateAiResumeState = {
  loading: boolean;
  error: string | null;
  generateAiResume: (payload: IBuildResume) => Promise<IBuildResume>;
  generateAiResumeFromText: (
    payload: TGenerateResumeFromTextPayload,
  ) => Promise<IBuildResume>;
};

/* ----------------------------------- Store ---------------------------------- */
export const useGenerateAiResumeStore = create<TGenerateAiResumeState>(
  (set) => ({
    loading: false,
    error: null,
    generateAiResume: async (payload) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<IBuildResume>(
          API_RESUME_GENERATE_URL,
          payload,
          {
            headers: { "Content-Type": "application/json" },
            timeout: RESUME_GENERATION_TIMEOUT_MS,
          },
        );
        set({ loading: false, error: null });
        return response.data;
      } catch (error) {
        const message = extractApiErrorMessage(
          error,
          "Failed to generate resume with AI",
        );
        set({ loading: false, error: message });
        throw new Error(message);
      }
    },
    generateAiResumeFromText: async (payload) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<IBuildResume>(
          API_RESUME_GENERATE_FROM_TEXT_URL,
          payload,
          {
            headers: { "Content-Type": "application/json" },
            timeout: RESUME_GENERATION_TIMEOUT_MS,
          },
        );
        set({ loading: false, error: null });
        return response.data;
      } catch (error) {
        const message = extractApiErrorMessage(
          error,
          "Failed to generate resume from pasted information",
        );
        set({ loading: false, error: message });
        throw new Error(message);
      }
    },
  }),
);
