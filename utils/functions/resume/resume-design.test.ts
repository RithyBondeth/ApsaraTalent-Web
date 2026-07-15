import { describe, expect, it } from "vitest";
import {
  buildTemplateBaseDesign,
  shuffleResumeDesign,
  RESUME_DESIGN_OPTIONS,
} from "./resume-design";
import { resumeDesignSchema } from "./resume-draft";
import { RESUME_TEMPLATE_THEMES } from "@/components/resume-builder/editor/canvas-template/resume-template-theme";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";

const templates = Object.keys(RESUME_TEMPLATE_THEMES) as TResumeTemplate[];

describe("buildTemplateBaseDesign", () => {
  it("produces a schema-valid design for every template", () => {
    for (const template of templates) {
      const design = buildTemplateBaseDesign(template);
      const parsed = resumeDesignSchema.safeParse(design);
      expect(parsed.success, `template "${template}"`).toBe(true);
    }
  });

  it("mirrors the template theme so the canvas output does not change", () => {
    for (const template of templates) {
      const theme = RESUME_TEMPLATE_THEMES[template];
      const design = buildTemplateBaseDesign(template);
      expect(design.layout).toBe(theme.layout);
      expect(design.sidebarSections).toEqual(theme.sidebarSections);
      expect(design.headerLayout).toBe(theme.headerLayout);
    }
  });
});

describe("shuffleResumeDesign", () => {
  it("always produces a schema-valid design", () => {
    for (let i = 0; i < 50; i++) {
      const parsed = resumeDesignSchema.safeParse(shuffleResumeDesign());
      expect(parsed.success).toBe(true);
    }
  });

  it("keeps sidebar sections unique and within bounds", () => {
    for (let i = 0; i < 50; i++) {
      const { sidebarSections } = shuffleResumeDesign();
      expect(sidebarSections.length).toBeGreaterThanOrEqual(1);
      expect(sidebarSections.length).toBeLessThanOrEqual(4);
      expect(new Set(sidebarSections).size).toBe(sidebarSections.length);
    }
  });
});

describe("RESUME_DESIGN_OPTIONS", () => {
  it("every option value passes the schema on a base design", () => {
    const base = buildTemplateBaseDesign("modern");
    for (const [field, values] of Object.entries(RESUME_DESIGN_OPTIONS)) {
      if (field === "sidebarSections") continue;
      for (const value of values) {
        const parsed = resumeDesignSchema.safeParse({
          ...base,
          [field]: value,
        });
        expect(parsed.success, `${field}=${value}`).toBe(true);
      }
    }
  });
});
