import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAccountDraft } from "./use-account-draft";
import {
  accountDrafts,
  startAccountDraft,
  AccountResumeDraft,
} from "@/utils/functions/resume/account-drafts";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
vi.mock("@/utils/functions/resume/account-drafts", async (original) => {
  const real =
    await original<typeof import("@/utils/functions/resume/account-drafts")>();
  return { ...real, accountDrafts: { ...real.accountDrafts, save: vi.fn() } };
});
const draft: IBuildResume = {
  personalInfo: { fullName: "Candidate", email: "me@example.com" },
  skills: ["Dart"],
  experience: [],
  template: "modern",
};
const save = vi.mocked(accountDrafts.save);
beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe("account draft synchronization", () => {
  it("continues cloud saves and tracks revisions when browser storage is full", async () => {
    const identity = startAccountDraft("storage-full-owner");
    vi.spyOn(sessionStorage, "setItem").mockImplementation(() => {
      throw new DOMException("Storage full", "QuotaExceededError");
    });
    save.mockImplementation(async (id, content) => ({
      id: id.id,
      name: id.name,
      revision: (id.revision ?? 0) + 1,
      createdAt: "now",
      updatedAt: "now",
      content,
    }));
    const { result, rerender } = renderHook(
      ({ content }) => useAccountDraft("storage-full-owner", content, true),
      { initialProps: { content: draft } },
    );
    await act(async () => {
      await result.current.retry();
    });
    expect(result.current.status).toBe("saved");
    expect(result.current.recoveryAvailable).toBe(false);
    rerender({ content: { ...draft, summary: "More edits" } });
    await act(async () => {
      await result.current.retry();
    });
    expect(save.mock.calls[1][0]).toMatchObject({
      id: identity.id,
      revision: 1,
    });
    expect(result.current.status).toBe("saved");
  });
  it("serializes edits arriving during a save using the returned revision", async () => {
    const identity = startAccountDraft("owner");
    let finish!: (value: AccountResumeDraft) => void;
    save.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }) as ReturnType<typeof accountDrafts.save>,
    );
    save.mockImplementationOnce(async (id, content) => ({
      id: id.id,
      name: id.name,
      revision: 2,
      createdAt: "now",
      updatedAt: "now",
      content,
    }));
    const { result, rerender } = renderHook(
      ({ content }) => useAccountDraft("owner", content, true),
      { initialProps: { content: draft } },
    );
    act(() => {
      void result.current.retry();
    });
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    rerender({ content: { ...draft, summary: "New edit" } });
    await act(async () => {
      finish({
        id: identity.id,
        name: identity.name,
        revision: 1,
        createdAt: "now",
        updatedAt: "now",
        content: draft,
      });
    });
    await waitFor(() => expect(save).toHaveBeenCalledTimes(2));
    expect(save.mock.calls[1][0].revision).toBe(1);
    expect(save.mock.calls[1][1].summary).toBe("New edit");
    expect(result.current.status).toBe("saved");
  });
  it("retains creation identity after offline failure, and never retries a conflict over the saved version", async () => {
    const identity = startAccountDraft("owner");
    save.mockRejectedValueOnce(new Error("offline"));
    save.mockRejectedValueOnce({ response: { status: 409 } });
    save.mockImplementationOnce(async (id, content) => ({
      id: id.id,
      name: id.name,
      revision: 1,
      createdAt: "now",
      updatedAt: "now",
      content,
    }));
    const { result } = renderHook(() => useAccountDraft("owner", draft, true));
    await act(async () => {
      await result.current.retry();
    });
    expect(result.current.status).toBe("offline");
    await act(async () => {
      await result.current.retry();
    });
    expect(save.mock.calls[1][0].id).toBe(identity.id);
    expect(result.current.status).toBe("conflict");
    await act(async () => {
      await result.current.retry();
    });
    expect(save).toHaveBeenCalledTimes(2);
    await act(async () => {
      result.current.saveAsNew();
    });
    await waitFor(() => expect(result.current.status).toBe("saved"));
    expect(save.mock.calls[2][0].id).not.toBe(identity.id);
    expect(save.mock.calls[2][0].revision).toBeNull();
  });
});
