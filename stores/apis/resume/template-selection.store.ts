import { create } from "zustand";

type ResumeTemplate = "modern" | "classic" | "creative";

interface TemplateSelectionState {
  selectedTemplate: ResumeTemplate | null;
  setSelectedTemplate: (template: ResumeTemplate) => void;
}

export const useTemplateSelectionStore = create<TemplateSelectionState>()((set) => ({
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));