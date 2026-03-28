"use client";

import { Check, Loader2, X } from "lucide-react";

// ── Helper: format elapsed seconds as M:SS ─────────────────────────────────
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface VoiceRecordingUIProps {
  durationSeconds: number;
  isUploading: boolean;
  onCancel: () => void;
  onStop: () => void;
}

/**
 * Renders the voice-recording state inside the chat input pill.
 *
 * Layout:
 *   [✕ Cancel]   ● 0:23   [✓ Stop & Send / spinner]
 */
export function VoiceRecordingUI({
  durationSeconds,
  isUploading,
  onCancel,
  onStop,
}: VoiceRecordingUIProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {/* Cancel button */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isUploading}
        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Cancel recording"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Recording indicator + duration */}
      <div className="flex-1 flex items-center gap-2">
        {/* Pulsing red dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <span className="text-sm font-mono text-foreground tabular-nums">
          {formatDuration(durationSeconds)}
        </span>
        <span className="text-xs text-muted-foreground">Recording…</span>
      </div>

      {/* Stop & send / uploading indicator */}
      <button
        type="button"
        onClick={onStop}
        disabled={isUploading}
        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
        aria-label={isUploading ? "Uploading…" : "Stop and send voice message"}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
