import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_AUTH_PARSE_RESUME_URL } from "@/utils/constants/apis/auth.api.constant";
import { create } from "zustand";

/* ---------------------------------- States -------------------------------- */
// ── Parse Resume Experience ─────────────────────────────────
export type TParsedResumeExperience = {
  title: string;
  description: string;
  /** ISO date string YYYY-MM-DD */
  startDate: string;
  /** ISO date string YYYY-MM-DD */
  endDate: string;
};

// ── Parse Resume Education ─────────────────────────────────
export type TParsedResumeEducation = {
  school: string;
  degree: string;
  /** Graduation year, e.g. 2020 */
  year: number;
};

// ── Parse Resume API Response ───────────────────────────────
export type TParsedResumeData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  /**
   * Candidate's city/province in Cambodia. Must match one of the exact
   * locationConstant values (e.g. "Phnom Penh", "Siem Reap").
   */
  location?: string;
  jobTitle?: string;
  yearsOfExperience?: string;
  availability?: string;
  description?: string;
  skills?: string[];
  experiences?: TParsedResumeExperience[];
  educations?: TParsedResumeEducation[];
  careerScopes?: string[];
};

// ── Parse Resume State ────────────────────────────────────────
type TParseResumeState = {
  loading: boolean;
  error: string | null;
  data: TParsedResumeData | null;
  file: File | null;
  parseResume: (file: File) => Promise<TParsedResumeData | null>;
  reset: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useParseResumeStore = create<TParseResumeState>((set) => ({
  loading: false,
  error: null,
  data: null,
  file: null,

  parseResume: async (file: File) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post<TParsedResumeData>(
        API_AUTH_PARSE_RESUME_URL,
        formData,
      );

      set({ loading: false, data: response.data, file });
      return response.data;
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Could not parse the resume. Please try again.",
      );
      set({ loading: false, error: errorMessage });
      return null;
    }
  },

  reset: () => set({ loading: false, error: null, data: null, file: null }),
}));
