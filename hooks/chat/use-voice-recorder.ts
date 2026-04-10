"use client";

import { useCallback, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { API_BASE_URL } from "@/utils/constants/apis/base_url";
import { IVoiceRecorderResult } from "@/utils/interfaces/chat/chat.interface";
import {
  AMPLITUDE_SAMPLE_INTERVAL_MS,
  VOICE_RECORDING_MAX_DURATION_MS,
  WAVEFORM_POINTS,
} from "@/utils/constants/chat.constant";
import { TChatRecordingState } from "@/utils/types/chat/chat.type";

/* ------------------------------------ Helpers ---------------------------------- */
// ── Pick supported MIME type ──────────────────────────────────────────
function getSupportedMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const mime of candidates) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(mime)
    ) {
      return mime;
    }
  }
  return "audio/webm";
}

// ── Downsample amplitude array to WAVEFORM_POINTS ─────────────────────
function downsampleAmplitude(
  samples: number[],
  targetPoints: number,
): number[] {
  if (samples.length === 0) return Array(targetPoints).fill(0.3);
  if (samples.length <= targetPoints) {
    // Pad with average to fill remaining slots
    const avg = samples.reduce((s, v) => s + v, 0) / samples.length;
    const padded = [...samples];
    while (padded.length < targetPoints) padded.push(avg);
    return padded;
  }
  // Bin into targetPoints buckets and average each bucket
  const binSize = samples.length / targetPoints;
  return Array.from({ length: targetPoints }, (_, i) => {
    const start = Math.floor(i * binSize);
    const end = Math.floor((i + 1) * binSize);
    const bin = samples.slice(start, end);
    return bin.reduce((s, v) => s + v, 0) / bin.length;
  });
}

/* ------------------------------------- Hook ------------------------------------ */
export function useVoiceRecorder(): IVoiceRecorderResult {
  /* --------------------------------- All States -------------------------------- */
  const [recordingState, setRecordingState] =
    useState<TChatRecordingState>("idle");
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // All mutable recording objects live in refs to avoid re-renders during recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const amplitudeSamplesRef = useRef<number[]>([]);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const amplitudeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const durationSecondsRef = useRef<number>(0);

  /* --------------------------------- Methods ---------------------------------- */
  // ── Cleanup helper ─────────────────────────────────────────────────────────
  const cleanupRefs = useCallback(() => {
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    if (amplitudeTimerRef.current) clearInterval(amplitudeTimerRef.current);
    if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current);
    durationTimerRef.current = null;
    amplitudeTimerRef.current = null;
    maxDurationTimerRef.current = null;

    // Close AudioContext
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    }

    // Stop all MediaStream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    durationSecondsRef.current = 0;
    setDurationSeconds(0);
    audioChunksRef.current = [];
    amplitudeSamplesRef.current = [];
  }, []);

  // ── startRecording ─────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (recordingState !== "idle") return;
    setErrorMessage(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setErrorMessage(
        "Microphone access denied. Please allow microphone permission.",
      );
      return;
    }

    streamRef.current = stream;

    // Set up Web Audio API for amplitude sampling
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch {
      // Amplitude sampling is best-effort — recording still works without it
    }

    // Set up MediaRecorder
    const mimeType = getSupportedMimeType();
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];
    amplitudeSamplesRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    recorder.start(100); // Collect data every 100ms so we have chunks

    // Duration counter (updates every second for the UI)
    durationTimerRef.current = setInterval(() => {
      durationSecondsRef.current += 1;
      setDurationSeconds(durationSecondsRef.current);
    }, 1000);

    // Amplitude sampler (captures one value every AMPLITUDE_SAMPLE_INTERVAL_MS)
    const freqData = new Uint8Array(
      analyserRef.current?.frequencyBinCount ?? 128,
    );
    amplitudeTimerRef.current = setInterval(() => {
      if (!analyserRef.current) {
        amplitudeSamplesRef.current.push(0.3); // flat when analyser unavailable
        return;
      }
      analyserRef.current.getByteFrequencyData(freqData);
      // Average of the frequency bins (0–255) normalised to 0–1
      const avg =
        freqData.reduce((sum, v) => sum + v, 0) / freqData.length / 255;
      amplitudeSamplesRef.current.push(avg);
    }, AMPLITUDE_SAMPLE_INTERVAL_MS);

    // Auto-stop at max duration
    maxDurationTimerRef.current = setTimeout(() => {
      // Trigger stop without sending (caller must call stopRecording to send)
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }, VOICE_RECORDING_MAX_DURATION_MS);

    setRecordingState("recording");
  }, [recordingState]);

  // ── stopRecording ──────────────────────────────────────────────────────────
  const stopRecording = useCallback(
    async (
      onSend: (attachment: {
        url: string;
        type: "audio";
        filename: string;
        duration: number;
        amplitude: number[];
      }) => void,
    ): Promise<boolean> => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") return false;

      // Capture duration and amplitude before cleanup resets them
      const finalDuration = durationSecondsRef.current;
      const rawSamples = [...amplitudeSamplesRef.current];

      return new Promise((resolve) => {
        recorder.onstop = async () => {
          const mimeType = recorder.mimeType || "audio/webm";
          const blob = new Blob(audioChunksRef.current, { type: mimeType });

          // Normalise amplitude to 0–1 range
          const maxAmp = Math.max(...rawSamples, 0.001);
          const normalised = rawSamples.map((v) => v / maxAmp);
          const amplitude = downsampleAmplitude(normalised, WAVEFORM_POINTS);

          // Derive file extension from MIME type
          const ext = mimeType.includes("ogg")
            ? "ogg"
            : mimeType.includes("mp4")
              ? "m4a"
              : "webm";
          const filename = `voice-message-${Date.now()}.${ext}`;

          cleanupRefs();
          setRecordingState("uploading");

          try {
            const formData = new FormData();
            formData.append("file", blob, filename);
            const accessToken = getCookie("auth-token");
            const res = await fetch(`${API_BASE_URL}/chat/upload`, {
              method: "POST",
              body: formData,
              credentials: "include",
              headers: accessToken
                ? { Authorization: `Bearer ${String(accessToken)}` }
                : undefined,
            });
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              throw new Error(body?.message || `Upload failed (${res.status})`);
            }
            const data = await res.json();
            onSend({
              url: data.url,
              type: "audio",
              filename: data.filename || filename,
              duration: finalDuration,
              amplitude,
            });
            setRecordingState("idle");
            resolve(true);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Upload failed";
            setErrorMessage(msg);
            setRecordingState("idle");
            resolve(false);
          }
        };

        // Clear timers but DON'T call cleanupRefs yet (onstop will do it after assembly)
        if (durationTimerRef.current) clearInterval(durationTimerRef.current);
        if (amplitudeTimerRef.current) clearInterval(amplitudeTimerRef.current);
        if (maxDurationTimerRef.current)
          clearTimeout(maxDurationTimerRef.current);

        recorder.stop();
      });
    },
    [cleanupRefs],
  );

  // ── cancelRecording ────────────────────────────────────────────────────────
  const cancelRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      // Remove onstop before stopping so we don't trigger upload
      recorder.onstop = null;
      recorder.stop();
    }
    mediaRecorderRef.current = null;
    cleanupRefs();
    setRecordingState("idle");
    setErrorMessage(null);
  }, [cleanupRefs]);

  /* ---------------------------------- Return ---------------------------------- */
  return {
    recordingState,
    durationSeconds,
    errorMessage,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
