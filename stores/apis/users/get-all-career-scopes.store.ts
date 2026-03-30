import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_ALL_CAREER_SCOPES_URL } from "@/utils/constants/apis/user_url";
import { ICareerScope } from "@/utils/interfaces/career";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get All Career Scopes Response ─────────────────────────────
type TGetAllCareerScopesResponse = ICareerScope[];

// ── Get All Career Scopes State ────────────────────────────────
type TGetAllCareerScopesStoreState = {
  error: string | null;
  loading: boolean;
  careerScopes: TGetAllCareerScopesResponse | null;
  getAllCareerScopes: () => Promise<void>;
};

/* ---------------------------------- Store ---------------------------------- */
export const useGetAllCareerScopesStore = create<TGetAllCareerScopesStoreState>(
  (set) => ({
    error: null,
    loading: false,
    careerScopes: null,
    getAllCareerScopes: async () => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetAllCareerScopesResponse>(
          API_GET_ALL_CAREER_SCOPES_URL,
        );
        set({ careerScopes: response.data, loading: false, error: null });
      } catch (error) {
        set({
          loading: false,
          error: extractApiErrorMessage(
            error,
            "An error occurred while fetching all career scopes",
          ),
        });
      }
    },
  }),
);
