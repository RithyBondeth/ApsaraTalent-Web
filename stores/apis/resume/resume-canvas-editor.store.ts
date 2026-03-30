import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { TResumeSectionID } from "@/utils/types/resume/resume-section-id.type";
import { RESUME_EDITOR_DEFAULT_SECTION_ORDER } from "@/utils/constants/resume.constant";

/* ---------------------------------- States ────────────────────────────────- */
// ── Resume Editor State ──────────────────────────────────────
type TResumeCanvasEditorState = {
  selectedSection: TResumeSectionID | null;
  sectionOrder: TResumeSectionID[];
  setSelectedSection: (id: TResumeSectionID | null) => void;
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
