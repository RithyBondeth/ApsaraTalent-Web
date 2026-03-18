import { BuildResume } from "@/app/(main)/resume-builder/_apis/generate-resume.api";
import { create } from "zustand";

interface ResumeEditState {
  payload: BuildResume | null;
  setPayload: (payload: BuildResume) => void;
  clearPayload: () => void;
}

export const useResumeEditStore = create<ResumeEditState>()((set) => ({
  payload: null,
  setPayload: (payload) => set({ payload }),
  clearPayload: () => set({ payload: null }),
}));
