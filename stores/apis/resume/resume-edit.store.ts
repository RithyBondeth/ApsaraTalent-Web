import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Resume Edit State ────────────────────────────────────────
type TResumeEditState = {
  payload: IBuildResume | null;
  setPayload: (payload: IBuildResume) => void;
  clearPayload: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useResumeEditStore = create<TResumeEditState>()((set) => ({
  payload: null,
  setPayload: (payload: IBuildResume) => set({ payload }),
  clearPayload: () => set({ payload: null }),
}));
