import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

/* ─── Section IDs ────────────────────────────────────────────── */
export type SectionId =
  | "header"
  | "summary"
  | "experience"
  | "skills"
  | "education"
  | "careerScopes"; // kept in type for backward-compat; hidden from canvas

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "summary",
  "experience",
  "skills",
  "education",
];

/* ─── Store ──────────────────────────────────────────────────── */
interface CanvasEditorState {
  /** Which section block is currently selected (shows blue ring) */
  selectedSection: SectionId | null;
  /** Ordered list of sections below the header */
  sectionOrder: SectionId[];

  setSelectedSection: (id: SectionId | null) => void;
  clearSelection: () => void;
  /** Move a section from `from` index to `to` index */
  reorderSections: (from: number, to: number) => void;
  /** Reset order to default (useful when navigating away) */
  resetOrder: () => void;
}

export const useCanvasEditorStore = create<CanvasEditorState>()((set) => ({
  selectedSection: null,
  sectionOrder: [...DEFAULT_SECTION_ORDER],

  setSelectedSection: (id) => set({ selectedSection: id }),
  clearSelection: () => set({ selectedSection: null }),
  reorderSections: (from, to) =>
    set((state) => ({
      sectionOrder: arrayMove(state.sectionOrder, from, to),
    })),
  resetOrder: () =>
    set({ sectionOrder: [...DEFAULT_SECTION_ORDER], selectedSection: null }),
}));
