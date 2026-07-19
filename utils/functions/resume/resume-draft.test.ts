import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  loadResumeDraft,
  removeLegacyResumeDraft,
  removeResumeDraft,
  resumeSchema,
  saveResumeDraft,
} from "./resume-draft";
import {
  RESUME_DRAFT_STORAGE_PREFIX,
  RESUME_DRAFT_VERSION,
  RESUME_LOCAL_STORAGE_KEY,
} from "@/utils/constants/resume.constant";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";

const payload: IBuildResume = {
  personalInfo: {
    fullName: "Rithy Bondeth",
    email: "bondeth@example.com",
  },
  experience: [],
  skills: ["TypeScript"],
  sectionOrder: ["skills", "experience"],
  design: {
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
  },
  template: "modern",
};

const localValues = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return localValues.size;
  },
  clear: () => localValues.clear(),
  getItem: (key) => localValues.get(key) ?? null,
  key: (index) => [...localValues.keys()][index] ?? null,
  removeItem: (key) => void localValues.delete(key),
  setItem: (key, value) => void localValues.set(key, value),
};

describe("resume drafts", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("loads only a valid draft belonging to the current user", () => {
    saveResumeDraft("user-1", payload);

    expect(loadResumeDraft("user-1")).toMatchObject(payload);
    expect(loadResumeDraft("user-2")).toBeNull();
  });

  it("recovers bounded in-progress edits while keeping PDF validation strict", () => {
    const inProgress = {
      ...payload,
      personalInfo: { fullName: "", email: "not-finished" },
      skills: [""],
    };

    saveResumeDraft("user-1", inProgress);

    expect(loadResumeDraft("user-1")).toMatchObject(inProgress);
    expect(resumeSchema.safeParse(inProgress).success).toBe(false);
  });

  it("rejects raw styles and unsupported AI design values", () => {
    const unsafeDesign = {
      ...payload,
      design: {
        ...payload.design,
        palette: "#ff00ff",
        typography: "https://fonts.example/custom.woff2",
        css: "body { display: none }",
      },
    };

    expect(resumeSchema.safeParse(unsafeDesign).success).toBe(false);
  });

  it("removes malformed and owner-mismatched drafts", () => {
    const malformedKey = `${RESUME_DRAFT_STORAGE_PREFIX}:user-1`;
    window.sessionStorage.setItem(malformedKey, "not-json");
    expect(loadResumeDraft("user-1")).toBeNull();
    expect(window.sessionStorage.getItem(malformedKey)).toBeNull();

    const mismatchedKey = `${RESUME_DRAFT_STORAGE_PREFIX}:user-2`;
    window.sessionStorage.setItem(
      mismatchedKey,
      JSON.stringify({
        version: RESUME_DRAFT_VERSION,
        ownerId: "user-1",
        updatedAt: new Date().toISOString(),
        data: payload,
      }),
    );
    expect(loadResumeDraft("user-2")).toBeNull();
    expect(window.sessionStorage.getItem(mismatchedKey)).toBeNull();
  });

  it("clears both current and legacy draft storage", () => {
    saveResumeDraft("user-1", payload);
    window.localStorage.setItem(
      RESUME_LOCAL_STORAGE_KEY,
      "legacy-private-data",
    );

    removeResumeDraft("user-1");
    removeLegacyResumeDraft();

    expect(loadResumeDraft("user-1")).toBeNull();
    expect(window.localStorage.getItem(RESUME_LOCAL_STORAGE_KEY)).toBeNull();
  });
});
