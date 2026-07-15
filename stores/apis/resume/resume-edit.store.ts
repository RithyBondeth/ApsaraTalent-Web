import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Resume Edit State ────────────────────────────────────────
type TResumeEditState = {
  payload: IBuildResume | null;
  ownerId: string | null;
  setPayload: (payload: IBuildResume, ownerId: string) => void;
  clearPayload: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useResumeEditStore = create<TResumeEditState>()((set) => ({
  payload: null,
  ownerId: null,
  setPayload: (payload: IBuildResume, ownerId: string) =>
    set({ payload, ownerId }),
  clearPayload: () => set({ payload: null, ownerId: null }),
}));
