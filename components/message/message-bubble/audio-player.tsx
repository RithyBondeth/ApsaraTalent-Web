"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Default waveform when no amplitude data is available (flat mid-level bars)
const DEFAULT_AMPLITUDE = Array.from(
  { length: 30 },
  (_, i) => 0.2 + 0.4 * Math.sin((i / 30) * Math.PI),
);

// ── Props ──────────────────────────────────────────────────────────────────────
interface AudioPlayerProps {
  /** Full URL to the audio file. */
  url: string;
  /** Duration in seconds (may be approximate). */
  duration?: number;
  /** 30-point normalised waveform amplitude array (values 0–1). */
  amplitude?: number[];
  /** True when the player is inside an outgoing (isMe) message bubble. */
  isMe?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────────
/**
 * Compact audio message player with waveform visualisation.
 *
 * Layout:
 *   [▶/❚❚]  ████░░░░░░░░░░░░░░░░░  0:23
 *
 * The waveform is rendered as 30 CSS div bars whose heights come from the
 * `amplitude` array.  The playback progress is shown by colouring the bars
 * left of the current position more prominently.
 *
 * A hidden native <audio> element handles actual playback — this lets us keep
 * full browser codec compatibility without pulling in a heavy library.
 */
export function AudioPlayer({
  url,
  duration,
  amplitude,
  isMe,
}: AudioPlayerProps) {
  /* -------------------------------- All States ------------------------------ */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number>(duration ?? 0);

  /* ---------------------------------- Utils --------------------------------- */
  const bars =
    amplitude && amplitude.length === 30 ? amplitude : DEFAULT_AMPLITUDE;

  // ── Sync duration from <audio> metadata once it loads ────────────────────
  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (isFinite(audio.duration)) setAudioDuration(audio.duration);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audio) audio.currentTime = 0;
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // If the parent provides a duration (e.g., from recorder metadata),
  // prefer it over 0 so the UI doesn't show 0:00 while metadata loads.
  useEffect(() => {
    if (typeof duration === "number" && duration > 0) {
      setAudioDuration(duration);
    }
  }, [duration]);

  // ── Toggle play/pause ─────────────────────────────────────────────────────
  /* --------------------------------- Methods --------------------------------- */
  // ── Toggle Play ─────────────────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // ── Waveform seek on click ────────────────────────────────────────────────
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const seekTo = ratio * audioDuration;
    audio.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  // ── Colour classes based on isMe ──────────────────────────────────────────
  /* ---------------------------------- Utils --------------------------------- */
  const playedColor = isMe ? "bg-primary-foreground" : "bg-primary";
  const unplayedColor = isMe ? "bg-primary-foreground/30" : "bg-primary/30";
  const timeColor = isMe
    ? "text-primary-foreground/70"
    : "text-muted-foreground";
  const btnClass = isMe
    ? "text-primary-foreground hover:bg-primary-foreground/10"
    : "text-primary hover:bg-primary/10";

  const progress = audioDuration > 0 ? currentTime / audioDuration : 0;
  const displayTime =
    isPlaying || currentTime > 0 ? currentTime : audioDuration;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2 mt-1 min-w-[150px] sm:min-w-[180px] max-w-xs">
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-colors ${btnClass}`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      {/* Waveform bars */}
      <div
        className="flex-1 flex items-center gap-[2px] cursor-pointer h-8 py-1"
        onClick={handleWaveformClick}
        role="slider"
        aria-label="Audio seek"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {bars.map((amp, i) => {
          const isPlayed = i / bars.length < progress;
          return (
            <div
              key={i}
              style={{ height: `${Math.max(3, amp * 24)}px` }}
              className={`flex-1 rounded-full transition-colors ${isPlayed ? playedColor : unplayedColor}`}
            />
          );
        })}
      </div>

      {/* Current time / total duration */}
      <span
        className={`shrink-0 text-[11px] tabular-nums font-mono ${timeColor}`}
      >
        {formatTime(displayTime)}
      </span>
    </div>
  );
}
