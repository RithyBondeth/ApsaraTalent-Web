import { create } from "zustand";
import { ResumeTemplate } from "@/utils/interfaces/resume.interface";

interface TemplateSelectionState {
  selectedTemplate: ResumeTemplate | null;
  setSelectedTemplate: (template: ResumeTemplate) => void;
}

export const useTemplateSelectionStore = create<TemplateSelectionState>()(
  (set) => ({
    selectedTemplate: null,
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  }),
);
