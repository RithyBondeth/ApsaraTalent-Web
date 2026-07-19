import { describe, expect, it, vi } from "vitest";
import {
  isSafeInlineResumeAvatar,
  matchesResumeOwnerName,
  prepareResumeAvatar,
} from "./prepare-resume-avatar";

const INLINE_AVATAR = "data:image/jpeg;base64,aGVsbG8=";

describe("prepareResumeAvatar", () => {
  it("keeps an existing safe inline avatar without fetching it", async () => {
    const fetcher = vi.fn();

    await expect(prepareResumeAvatar(INLINE_AVATAR, { fetcher })).resolves.toBe(
      INLINE_AVATAR,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("fetches and converts an existing remote profile avatar", async () => {
    const response = new Response(new Blob(["avatar"], { type: "image/png" }), {
      status: 200,
      headers: { "content-type": "image/png" },
    });
    const fetcher = vi.fn(async () => response);
    const encoder = vi.fn(async () => INLINE_AVATAR);

    await expect(
      prepareResumeAvatar("https://cdn.example.com/avatar.png", {
        fetcher,
        encoder,
      }),
    ).resolves.toBe(INLINE_AVATAR);
    expect(fetcher).toHaveBeenCalledWith(
      "https://cdn.example.com/avatar.png",
      expect.objectContaining({ credentials: "include" }),
    );
    expect(encoder).toHaveBeenCalledOnce();
  });

  it("rejects a remote response that is not a supported image", async () => {
    const response = new Response("not an image", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
    const encoder = vi.fn(async () => INLINE_AVATAR);

    await expect(
      prepareResumeAvatar("https://cdn.example.com/avatar.txt", {
        fetcher: vi.fn(async () => response),
        encoder,
      }),
    ).resolves.toBeUndefined();
    expect(encoder).not.toHaveBeenCalled();
  });
});

describe("isSafeInlineResumeAvatar", () => {
  it("accepts supported bitmap data URLs and rejects SVG", () => {
    expect(isSafeInlineResumeAvatar(INLINE_AVATAR)).toBe(true);
    expect(isSafeInlineResumeAvatar("data:image/svg+xml;base64,PHN2Zy8+")).toBe(
      false,
    );
  });
});

describe("matchesResumeOwnerName", () => {
  it("matches normalized owner aliases", () => {
    expect(
      matchesResumeOwnerName("Bondeth  Bondeth", [
        "bondeth-bondeth",
        "bondeth",
      ]),
    ).toBe(true);
  });

  it("does not attach the current user's avatar to another candidate", () => {
    expect(matchesResumeOwnerName("Apsara Talent", ["Bondeth Bondeth"])).toBe(
      false,
    );
  });
});
