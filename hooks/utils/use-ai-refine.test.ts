import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const streamMocks = vi.hoisted(() => ({ streamFetch: vi.fn() }));
const toastMocks = vi.hoisted(() => ({ error: vi.fn() }));

vi.mock("@/utils/functions/stream-fetch", () => streamMocks);
vi.mock("sonner", () => ({ toast: toastMocks }));

import { useAIRefine } from "./use-ai-refine";

describe("useAIRefine", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps refinement types, streams accumulated text, and returns the result", async () => {
    streamMocks.streamFetch.mockImplementation(
      async (_url: string, _options: unknown, onEvent: (event: unknown) => void) => {
        onEvent({ t: "chunk", v: "Improved " });
        onEvent({ t: "chunk", v: "summary" });
      },
    );
    const onChunk = vi.fn();
    const { result } = renderHook(() => useAIRefine());

    let refined: string | null = null;
    await act(async () => {
      refined = await result.current.refineContent(
        "Original",
        "summary",
        { skills: ["TypeScript"] },
        onChunk,
      );
    });

    expect(refined).toBe("Improved summary");
    expect(onChunk).toHaveBeenNthCalledWith(1, "Improved ");
    expect(onChunk).toHaveBeenNthCalledWith(2, "Improved summary");
    expect(streamMocks.streamFetch.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      body: {
        type: "employeeBio",
        currentText: "Original",
        skills: ["TypeScript"],
      },
      signal: expect.any(AbortSignal),
    });
    expect(result.current.isRefining).toBe(false);
  });

  it.each([
    ["jobTitle", "employeeJobTitle"],
    ["companyBio", "companyBio"],
    ["experience", "experienceDescription"],
    ["achievement", "achievementBullet"],
    ["skills", "skillSuggestion"],
    ["education", "educationDescription"],
  ] as const)("maps %s to %s", async (type, expectedType) => {
    streamMocks.streamFetch.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAIRefine());
    await act(async () => {
      await result.current.refineContent("Text", type);
    });
    expect(streamMocks.streamFetch.mock.calls[0]?.[1]).toMatchObject({
      body: expect.objectContaining({ type: expectedType }),
    });
  });

  it("surfaces streamed rate limits and returns null on failures", async () => {
    streamMocks.streamFetch
      .mockImplementationOnce(
        async (_url: string, _options: unknown, onEvent: (event: unknown) => void) => {
          onEvent({ t: "error", v: "Daily quota reached", code: 429 });
        },
      )
      .mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useAIRefine());

    await act(async () => {
      await expect(result.current.refineContent("Text", "summary")).resolves.toBeNull();
      await expect(result.current.refineContent("Text", "summary")).resolves.toBeNull();
    });
    expect(toastMocks.error).toHaveBeenCalledWith("Daily quota reached");
    expect(result.current.isRefining).toBe(false);
  });

  it("aborts an active refinement when unmounted", () => {
    streamMocks.streamFetch.mockReturnValue(new Promise(() => undefined));
    const abort = vi.spyOn(AbortController.prototype, "abort");
    const { result, unmount } = renderHook(() => useAIRefine());

    void result.current.refineContent("Text", "summary");
    unmount();

    expect(abort).toHaveBeenCalled();
  });
});
