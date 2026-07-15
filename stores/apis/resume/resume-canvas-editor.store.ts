import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { TResumeContentSection } from "@/utils/interfaces/resume/resume.interface";
import { RESUME_EDITOR_DEFAULT_SECTION_ORDER } from "@/utils/constants/resume.constant";

/* ---------------------------------- States ────────────────────────────────- */
// ── Resume Editor State ──────────────────────────────────────
type TResumeCanvasEditorState = {
  selectedSection: TResumeContentSection | "header" | null;
  sectionOrder: TResumeContentSection[];
  setSelectedSection: (id: TResumeContentSection | "header" | null) => void;
  setSectionOrder: (order: TResumeContentSection[]) => void;
  clearSelection: () => void;
  reorderSections: (from: number, to: number) => void;
  resetOrder: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useResumeCanvasEditorStore = create<TResumeCanvasEditorState>()(
  (set) => ({
    selectedSection: null,
    sectionOrder: [...RESUME_EDITOR_DEFAULT_SECTION_ORDER],
    setSelectedSection: (id) => set({ selectedSection: id }),
    setSectionOrder: (order) => set({ sectionOrder: [...order] }),
    clearSelection: () => set({ selectedSection: null }),
    reorderSections: (from, to) =>
      set((state) => ({
        sectionOrder: arrayMove(state.sectionOrder, from, to),
      })),
    resetOrder: () =>
      set({
        sectionOrder: [...RESUME_EDITOR_DEFAULT_SECTION_ORDER],
        selectedSection: null,
      }),
  }),
);
