"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const DEFAULT_AMPLITUDE = Array.from(
  { length: 30 },
  (_, index) => 0.2 + 0.4 * Math.sin((index / 30) * Math.PI),
);

interface AudioPlayerProps {
  url: string;
  duration?: number;
  amplitude?: number[];
  isMe?: boolean;
}

/**
 * Compact audio message player with waveform visualisation.
 *
 * Layout:
 *   [▶/❚❚]  ████░░░░░░░░░░░░░░░░░  0:23
 *
 * The waveform is rendered as 30 CSS div bars whose heights come from the
 * `amplitude` array. The playback progress is shown by colouring the bars
 * left of the current position more prominently.
 *
 * A hidden native <audio> element handles actual playback without adding a
 * heavier media-player dependency.
 */
export function AudioPlayer(props: AudioPlayerProps) {
  /* --------------------------------- Props --------------------------------- */
  const { url, duration, amplitude, isMe } = props;

  /* -------------------------------- All States ------------------------------ */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number>(duration ?? 0);

  /* ---------------------------------- Utils --------------------------------- */
  const bars =
    amplitude && amplitude.length === 30 ? amplitude : DEFAULT_AMPLITUDE;
  const playedColor = isMe ? "bg-primary-foreground" : "bg-primary";
  const unplayedColor = isMe ? "bg-primary-foreground/30" : "bg-primary/30";
  const timeColor = isMe
    ? "text-primary-foreground/70"
    : "text-muted-foreground";
  const buttonClass = isMe
    ? "text-primary-foreground hover:bg-primary-foreground/10"
    : "text-primary hover:bg-primary/10";
  const progress = audioDuration > 0 ? currentTime / audioDuration : 0;
  const displayTime =
    isPlaying || currentTime > 0 ? currentTime : audioDuration;

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) setAudioDuration(audio.duration);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (typeof duration === "number" && duration > 0) {
      setAudioDuration(duration);
    }
  }, [duration]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Playback Toggle ─────────────────────────────────────────
  const handlePlaybackToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  // ── Handle Waveform Seek ─────────────────────────────────────────
  const handleWaveformClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const seekTo = ratio * audioDuration;

    audio.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2 mt-1 min-w-[150px] sm:min-w-[180px] max-w-xs">
      <audio ref={audioRef} src={url} preload="metadata" />

      <button
        type="button"
        onClick={handlePlaybackToggle}
        className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-colors ${buttonClass}`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      <div
        className="flex-1 flex items-center gap-[2px] cursor-pointer h-8 py-1"
        onClick={handleWaveformClick}
        role="slider"
        aria-label="Audio seek"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {bars.map((amplitudeValue, index) => {
          const isPlayed = index / bars.length < progress;
          return (
            <div
              key={index}
              style={{ height: `${Math.max(3, amplitudeValue * 24)}px` }}
              className={`flex-1 rounded-full transition-colors ${
                isPlayed ? playedColor : unplayedColor
              }`}
            />
          );
        })}
      </div>

      <span
        className={`shrink-0 text-[11px] tabular-nums font-mono ${timeColor}`}
      >
        {formatTime(displayTime)}
      </span>
    </div>
  );
}
