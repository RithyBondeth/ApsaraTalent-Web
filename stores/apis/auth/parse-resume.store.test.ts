import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/axios", () => ({ default: { post } }));

import { useParseResumeStore } from "./parse-resume.store";

describe("parse-resume store", () => {
  beforeEach(() => {
    useParseResumeStore.getState().reset();
  });

  it("uploads the resume as form data and stores parsed fields", async () => {
    const file = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    const parsed = {
      firstName: "Sokha",
      skills: ["TypeScript"],
      careerScopes: ["Software Engineering"],
    };
    post.mockResolvedValueOnce({ data: parsed });

    await expect(
      useParseResumeStore.getState().parseResume(file),
    ).resolves.toEqual(parsed);

    const [, body] = post.mock.calls[0];
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("resume")).toBe(file);
    expect(useParseResumeStore.getState()).toMatchObject({
      loading: false,
      error: null,
      data: parsed,
      file,
    });
  });

  it("returns null and preserves a useful parse failure", async () => {
    const file = new File(["invalid"], "resume.txt", { type: "text/plain" });
    post.mockRejectedValueOnce(new Error("Unsupported resume"));

    await expect(
      useParseResumeStore.getState().parseResume(file),
    ).resolves.toBeNull();
    expect(useParseResumeStore.getState()).toMatchObject({
      loading: false,
      error: "Unsupported resume",
      data: null,
    });
  });

  it("reset removes parsed data and the selected file", () => {
    useParseResumeStore.setState({
      data: { firstName: "Old" },
      file: new File(["old"], "old.pdf"),
      error: "old error",
    });

    useParseResumeStore.getState().reset();

    expect(useParseResumeStore.getState()).toMatchObject({
      loading: false,
      error: null,
      data: null,
      file: null,
    });
  });
});
