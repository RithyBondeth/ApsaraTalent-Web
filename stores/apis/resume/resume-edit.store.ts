import { IBuildResume } from "@/utils/interfaces/resume-interface/resume.interface";
import { create } from "zustand";

interface ResumeEditState {
  payload: IBuildResume | null;
  setPayload: (payload: IBuildResume) => void;
  clearPayload: () => void;
}

export const useResumeEditStore = create<ResumeEditState>()((set) => ({
  payload: null,
  setPayload: (payload) => set({ payload }),
  clearPayload: () => set({ payload: null }),
}));
