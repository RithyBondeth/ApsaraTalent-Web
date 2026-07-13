import { afterEach, describe, expect, it } from "vitest";
import {
  normalizeMediaUrl,
  normalizeMediaUrlsDeep,
} from "./normalize-media-url";

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
});

describe("normalizeMediaUrl", () => {
  it("routes legacy chat storage paths through the protected attachment endpoint", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/api";

    expect(normalizeMediaUrl("/storage/chat/2026-07-13/file.pdf")).toBe(
      "https://api.example.com/chat/attachment/2026-07-13/file.pdf",
    );
  });

  it("keeps protected attachment paths on the API origin", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

    expect(normalizeMediaUrl("/chat/attachment/2026-07-13/file.pdf")).toBe(
      "https://api.example.com/chat/attachment/2026-07-13/file.pdf",
    );
  });

  it("normalizes nested public media without changing absolute URLs", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    const media = normalizeMediaUrlsDeep({
      avatar: "/storage/employee-avatars/avatar.jpg",
      nested: ["https://cdn.example.com/image.jpg"],
    });

    expect(media).toEqual({
      avatar: "https://api.example.com/storage/employee-avatars/avatar.jpg",
      nested: ["https://cdn.example.com/image.jpg"],
    });
  });
});
