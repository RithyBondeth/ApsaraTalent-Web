import { describe, expect, it } from "vitest";
import {
  resolveResumeLayoutBlueprint,
  resolveResumeTemplateTheme,
} from "./resume-template-theme";

describe("resolveResumeTemplateTheme", () => {
  it("resolves a constrained AI design into safe visual tokens", () => {
    const theme = resolveResumeTemplateTheme("modern", {
      layout: "right-sidebar",
      columnRatio: "narrow",
      headerLayout: "split",
      avatarPlacement: "start",
      sidebarSections: ["skills", "education"],
      palette: "violet",
      typography: "geometric",
      density: "spacious",
      headerStyle: "soft",
      sectionStyle: "pill",
      cornerStyle: "rounded",
      experienceStyle: "timeline",
      skillsStyle: "grid",
      educationStyle: "cards",
      summaryStyle: "highlight",
      decoration: "geometric",
    });

    expect(theme).toMatchObject({
      layout: "right-sidebar",
      accent: "#7C3AED",
      headerBackground: "#EDE9FE",
      headerText: "#2E1065",
      font: "'Trebuchet MS', Arial, sans-serif",
      bodyFontSize: 13.5,
      headerPadding: "40px 34px",
      chipRadius: "999px",
      avatarRadius: "50%",
      sectionStyle: "pill",
      headerLayout: "split",
      sidebarSections: ["skills", "education"],
      experienceStyle: "timeline",
      skillsStyle: "grid",
      decoration: "geometric",
    });

    expect(
      resolveResumeLayoutBlueprint(theme, [
        "summary",
        "experience",
        "skills",
        "education",
        "careerScopes",
      ]),
    ).toEqual({
      layout: "right-sidebar",
      primarySections: ["summary", "experience", "careerScopes"],
      secondarySections: ["skills", "education"],
      gridTemplateColumns: "minmax(0, 1fr) 206px",
      gridTemplateAreas: '"primary secondary"',
    });
  });

  it("keeps the selected fixed template when no AI design is present", () => {
    const theme = resolveResumeTemplateTheme("dark");

    expect(theme.layout).toBe("right-sidebar");
    expect(theme.background).toBe("#161B22");
    expect(theme.font).toContain("Courier New");
  });
});
