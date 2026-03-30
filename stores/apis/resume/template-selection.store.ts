import { create } from "zustand";
import { TResumeTemplate } from "@/utils/types/resume";

/* ---------------------------------- States --------------------------------- */
// ── Template Selection State ─────────────────────────────────
type TTemplateSelectionState = {
  selectedTemplate: TResumeTemplate | null;
  setSelectedTemplate: (template: TResumeTemplate) => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useTemplateSelectionStore = create<TTemplateSelectionState>()(
  (set) => ({
    selectedTemplate: null,
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  }),
);
