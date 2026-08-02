import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useVoiceRecorder } from "./use-voice-recorder";

type RecorderEvent = { data: Blob };

let latestRecorder: MockMediaRecorder | null = null;

class MockMediaRecorder {
  static isTypeSupported = vi.fn(() => true);
  state: RecordingState = "inactive";
  mimeType: string;
  ondataavailable: ((event: RecorderEvent) => void) | null = null;
  onstop: (() => void | Promise<void>) | null = null;

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    this.mimeType = options?.mimeType ?? "audio/webm";
    // Keep the instance available so tests can emit browser recorder events.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    latestRecorder = this;
  }

  start = vi.fn(() => {
    this.state = "recording";
  });

  stop = vi.fn(() => {
    this.state = "inactive";
    void this.onstop?.();
  });
}

describe("useVoiceRecorder", () => {
  const track = { stop: vi.fn() };
  const stream = { getTracks: () => [track] } as unknown as MediaStream;
  const analyser = {
    fftSize: 0,
    frequencyBinCount: 4,
    getByteFrequencyData: vi.fn((values: Uint8Array) => values.fill(64)),
  };
  const audioContext = {
    createMediaStreamSource: vi.fn(() => ({ connect: vi.fn() })),
    createAnalyser: vi.fn(() => analyser),
    close: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    latestRecorder = null;
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    });
    vi.stubGlobal("MediaRecorder", MockMediaRecorder);
    vi.stubGlobal("AudioContext", function MockAudioContext() {
      return audioContext;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("records, samples audio, uploads it, and returns a message attachment", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "/uploads/voice.webm", filename: "saved.webm" }),
    } as Response);
    const onSend = vi.fn();
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => result.current.startRecording());
    expect(result.current.recordingState).toBe("recording");
    latestRecorder?.ondataavailable?.({ data: new Blob(["audio"]) });
    act(() => vi.advanceTimersByTime(2_000));
    expect(result.current.durationSeconds).toBe(2);

    let uploaded = false;
    await act(async () => {
      uploaded = await result.current.stopRecording(onSend);
    });

    expect(uploaded).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/chat/upload"),
      expect.objectContaining({ method: "POST", credentials: "include", body: expect.any(FormData) }),
    );
    expect(onSend).toHaveBeenCalledWith({
      url: "/uploads/voice.webm",
      type: "audio",
      filename: "saved.webm",
      duration: 2,
      amplitude: expect.arrayContaining([expect.any(Number)]),
    });
    expect(onSend.mock.calls[0]?.[0].amplitude).toHaveLength(30);
    expect(track.stop).toHaveBeenCalled();
    expect(result.current).toMatchObject({
      recordingState: "idle",
      durationSeconds: 0,
      errorMessage: null,
    });
  });

  it("reports microphone permission denial", async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(new Error("denied"));
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => result.current.startRecording());

    expect(result.current.recordingState).toBe("idle");
    expect(result.current.errorMessage).toContain("Microphone access denied");
  });

  it("returns false when no active recording exists", async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await expect(result.current.stopRecording(vi.fn())).resolves.toBe(false);
  });

  it("cancels an active recording without uploading", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => result.current.startRecording());

    act(() => result.current.cancelRecording());

    expect(latestRecorder?.stop).toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ recordingState: "idle", errorMessage: null });
  });

  it("returns to idle and exposes upload errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 413,
      json: async () => ({ message: "Recording is too large" }),
    } as Response);
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => result.current.startRecording());

    let uploaded = true;
    await act(async () => {
      uploaded = await result.current.stopRecording(vi.fn());
    });

    expect(uploaded).toBe(false);
    expect(result.current).toMatchObject({
      recordingState: "idle",
      errorMessage: "Recording is too large",
    });
  });
});
