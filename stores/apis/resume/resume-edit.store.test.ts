import { beforeEach, describe, expect, it } from "vitest";
import type { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { useResumeEditStore } from "./resume-edit.store";

describe("resume-edit store", () => {
  beforeEach(() => {
    useResumeEditStore.getState().clearPayload();
  });

  it("keeps a resume payload scoped to its owner", () => {
    const payload = { summary: "Experienced engineer" } as IBuildResume;

    useResumeEditStore.getState().setPayload(payload, "user-1");

    expect(useResumeEditStore.getState()).toMatchObject({
      payload,
      ownerId: "user-1",
    });
  });

  it("clears both payload and ownership together", () => {
    useResumeEditStore
      .getState()
      .setPayload({ summary: "Old" } as IBuildResume, "user-1");

    useResumeEditStore.getState().clearPayload();

    expect(useResumeEditStore.getState()).toMatchObject({
      payload: null,
      ownerId: null,
    });
  });
});
