import { beforeEach, describe, expect, it, vi } from "vitest";

const mediaMocks = vi.hoisted(() => ({
  getApiOrigin: vi.fn(() => "https://api.example.com"),
  normalizeMediaUrl: vi.fn(),
}));

vi.mock("@/utils/functions/media", () => mediaMocks);

import { fetchIceServers, normalizeParticipantAvatar } from "./utils";

describe("call utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mediaMocks.normalizeMediaUrl.mockReset();
  });

  it("loads ICE servers from the API", async () => {
    const iceServers = [{ urls: "stun:stun.example.com" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({ iceServers }),
    } as Response);

    await expect(fetchIceServers()).resolves.toEqual(iceServers);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/auth/ice-servers",
    );
  });

  it("uses safe STUN fallbacks when the API fails or omits servers", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ json: async () => ({}) } as Response);

    const offlineFallback = await fetchIceServers();
    const emptyFallback = await fetchIceServers();

    expect(offlineFallback).toEqual(emptyFallback);
    expect(offlineFallback).toEqual([
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ]);
  });

  it("normalizes participant avatars while preserving participant identity", () => {
    mediaMocks.normalizeMediaUrl.mockReturnValue(
      "https://cdn.example.com/avatar.png",
    );
    const participant = {
      userId: "user-1",
      name: "Sokha",
      avatar: "/avatar.png",
    };

    expect(normalizeParticipantAvatar(participant)).toEqual({
      ...participant,
      avatar: "https://cdn.example.com/avatar.png",
    });
  });
});
