import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isSafeInlineResumeAvatar,
  matchesResumeOwnerName,
  prepareResumeAvatar,
} from "./prepare-resume-avatar";

const INLINE_AVATAR = "data:image/jpeg;base64,aGVsbG8=";

describe("prepareResumeAvatar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it("rejects invalid URLs, failed responses, oversized files, and network failures", async () => {
    const fetcher = vi.fn();
    await expect(
      prepareResumeAvatar("/local/avatar.png", { fetcher }),
    ).resolves.toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();

    await expect(
      prepareResumeAvatar("https://cdn.example.com/missing.png", {
        fetcher: vi.fn(async () => new Response(null, { status: 404 })),
      }),
    ).resolves.toBeUndefined();

    await expect(
      prepareResumeAvatar("https://cdn.example.com/large.png", {
        fetcher: vi.fn(
          async () =>
            new Response(new Blob(["x"], { type: "image/png" }), {
              headers: { "content-length": String(6 * 1024 * 1024) },
            }),
        ),
      }),
    ).resolves.toBeUndefined();

    await expect(
      prepareResumeAvatar("https://cdn.example.com/avatar.png", {
        fetcher: vi.fn(async () => {
          throw new Error("network down");
        }),
      }),
    ).resolves.toBeUndefined();
  });

  it("rejects invalid encoder output", async () => {
    const response = new Response(new Blob(["avatar"], { type: "image/png" }), {
      headers: { "content-type": "image/png" },
    });
    await expect(
      prepareResumeAvatar("https://cdn.example.com/avatar.png", {
        fetcher: vi.fn(async () => response),
        encoder: vi.fn(async () => "not-a-data-url"),
      }),
    ).resolves.toBeUndefined();
  });

  it("uses the browser encoder and preserves image proportions", async () => {
    const context = {
      fillStyle: "",
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      toDataURL: vi.fn(() => INLINE_AVATAR),
    };
    vi.spyOn(document, "createElement").mockImplementation(((tag: string) =>
      tag === "canvas" ? canvas : document.createElement(tag)) as never);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:avatar");
    const revoke = vi.spyOn(URL, "revokeObjectURL");

    class LoadedImage {
      naturalWidth = 400;
      naturalHeight = 200;
      width = 400;
      height = 200;
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal("Image", LoadedImage);

    const response = new Response(new Blob(["avatar"], { type: "image/png" }), {
      headers: { "content-type": "image/png" },
    });
    await expect(
      prepareResumeAvatar("https://cdn.example.com/avatar.png", {
        fetcher: vi.fn(async () => response),
      }),
    ).resolves.toBe(INLINE_AVATAR);

    expect(canvas).toMatchObject({ width: 200, height: 100 });
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 200, 100);
    expect(context.drawImage).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith("blob:avatar");
  });

  it("handles browser decode and canvas failures without leaking object URLs", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:broken");
    class BrokenImage {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      set src(_value: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }
    vi.stubGlobal("Image", BrokenImage);
    const response = new Response(new Blob(["avatar"], { type: "image/png" }), {
      headers: { "content-type": "image/png" },
    });

    await expect(
      prepareResumeAvatar("https://cdn.example.com/avatar.png", {
        fetcher: vi.fn(async () => response),
      }),
    ).resolves.toBeUndefined();
    expect(revoke).toHaveBeenCalledWith("blob:broken");
  });
});

describe("isSafeInlineResumeAvatar", () => {
  it("accepts supported bitmap data URLs and rejects SVG", () => {
    expect(isSafeInlineResumeAvatar(INLINE_AVATAR)).toBe(true);
    expect(isSafeInlineResumeAvatar("data:image/svg+xml;base64,PHN2Zy8+")).toBe(
      false,
    );
    expect(isSafeInlineResumeAvatar(undefined)).toBe(false);
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
    expect(matchesResumeOwnerName(" ", ["Bondeth Bondeth"])).toBe(false);
  });
});
