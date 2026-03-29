import { create } from "zustand";
import { TResumeTemplate } from "@/utils/types/resume";

interface TemplateSelectionState {
  selectedTemplate: TResumeTemplate | null;
  setSelectedTemplate: (template: TResumeTemplate) => void;
}

export const useTemplateSelectionStore = create<TemplateSelectionState>()(
  (set) => ({
    selectedTemplate: null,
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  }),
);
