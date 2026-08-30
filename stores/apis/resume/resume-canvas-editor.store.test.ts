import { beforeEach, describe, expect, it } from "vitest";
import { RESUME_EDITOR_DEFAULT_SECTION_ORDER } from "@/utils/constants/resume.constant";
import { useResumeCanvasEditorStore } from "./resume-canvas-editor.store";

describe("resume canvas editor store", () => {
  beforeEach(() => {
    useResumeCanvasEditorStore.getState().resetOrder();
  });

  it("selects and clears editable sections", () => {
    useResumeCanvasEditorStore.getState().setSelectedSection("experience");
    expect(useResumeCanvasEditorStore.getState().selectedSection).toBe(
      "experience",
    );

    useResumeCanvasEditorStore.getState().clearSelection();
    expect(useResumeCanvasEditorStore.getState().selectedSection).toBeNull();
  });

  it("reorders sections without mutating the default order", () => {
    const originalDefault = [...RESUME_EDITOR_DEFAULT_SECTION_ORDER];

    useResumeCanvasEditorStore.getState().reorderSections(0, 2);

    expect(useResumeCanvasEditorStore.getState().sectionOrder).toEqual([
      "experience",
      "skills",
      "summary",
      "education",
      "careerScopes",
    ]);
    expect(RESUME_EDITOR_DEFAULT_SECTION_ORDER).toEqual(originalDefault);
  });

  it("copies custom orders and restores a fresh default", () => {
    const customOrder = ["skills", "summary", "education"] as const;
    useResumeCanvasEditorStore.getState().setSectionOrder([...customOrder]);

    expect(useResumeCanvasEditorStore.getState().sectionOrder).toEqual(
      customOrder,
    );

    useResumeCanvasEditorStore.getState().resetOrder();
    expect(useResumeCanvasEditorStore.getState()).toMatchObject({
      selectedSection: null,
      sectionOrder: RESUME_EDITOR_DEFAULT_SECTION_ORDER,
    });
  });
});
