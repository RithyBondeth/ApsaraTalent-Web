import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addPendingIceCandidate,
  armConnectTimeout,
  clearConnectTimeout,
  clearPendingIceCandidates,
  clearRingTimeout,
  closePc,
  flushPendingIceCandidates,
  getPc,
  getPendingOffer,
  setPc,
  setPendingOffer,
  setRingTimeout,
  stopStream,
} from "./webrtc-manager";

describe("WebRTC manager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearConnectTimeout();
    clearRingTimeout();
    clearPendingIceCandidates();
    setPendingOffer(null);
    setPc(null);
  });

  afterEach(() => {
    closePc();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("stores and closes the active peer connection", () => {
    const pc = { close: vi.fn() } as unknown as RTCPeerConnection;

    setPc(pc);
    expect(getPc()).toBe(pc);
    closePc();

    expect(pc.close).toHaveBeenCalledOnce();
    expect(getPc()).toBeNull();
  });

  it("stores pending offers and stops every media track", () => {
    const offer = { type: "offer" as const, sdp: "offer-sdp" };
    const tracks = [{ stop: vi.fn() }, { stop: vi.fn() }];
    const stream = { getTracks: () => tracks } as unknown as MediaStream;

    setPendingOffer(offer);
    expect(getPendingOffer()).toEqual(offer);
    expect(stopStream(stream)).toBeNull();
    expect(tracks.every((track) => track.stop.mock.calls.length === 1)).toBe(true);
  });

  it("clears ring and connection timers before they fire", () => {
    const ringCallback = vi.fn();
    const connectCallback = vi.fn();
    setRingTimeout(setTimeout(ringCallback, 1_000));
    armConnectTimeout(connectCallback);

    clearRingTimeout();
    clearConnectTimeout();
    vi.runAllTimers();

    expect(ringCallback).not.toHaveBeenCalled();
    expect(connectCallback).not.toHaveBeenCalled();
  });

  it("ends a connection attempt after its timeout", () => {
    const endCall = vi.fn();

    armConnectTimeout(endCall);
    vi.advanceTimersByTime(25_000);

    expect(endCall).toHaveBeenCalledWith("error");
  });

  it("flushes queued ICE candidates only after a remote description exists", async () => {
    const addIceCandidate = vi.fn().mockResolvedValue(undefined);
    const pc = {
      remoteDescription: { type: "answer", sdp: "answer-sdp" },
      addIceCandidate,
      close: vi.fn(),
    } as unknown as RTCPeerConnection;
    vi.stubGlobal("RTCIceCandidate", function MockIceCandidate(candidate: RTCIceCandidateInit) {
      return candidate;
    });
    setPc(pc);
    addPendingIceCandidate({ candidate: "ice-1" });
    addPendingIceCandidate({ candidate: "ice-2" });

    await flushPendingIceCandidates();
    await flushPendingIceCandidates();

    expect(addIceCandidate).toHaveBeenCalledTimes(2);
    expect(addIceCandidate).toHaveBeenNthCalledWith(1, { candidate: "ice-1" });
    expect(addIceCandidate).toHaveBeenNthCalledWith(2, { candidate: "ice-2" });
  });
});
