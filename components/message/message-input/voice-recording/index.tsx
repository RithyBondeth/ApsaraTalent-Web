import { formatDurationClock } from "@/utils/functions/date";
import { Check, Loader2, X } from "lucide-react";
import { IVoiceRecordingUIProps } from "./props";

export function VoiceRecordingUI(props: IVoiceRecordingUIProps) {
  /* --------------------------------- Props --------------------------------- */
  const { durationSeconds, isUploading, onCancel, onStop } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const durationLabel = formatDurationClock(durationSeconds);

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Recording Actions ─────────────────────────────────────────
  const handleCancelRecording = () => onCancel();
  const handleStopRecording = () => onStop();

  /* ------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {/* Cancel Recording Button Section */}
      <button
        type="button"
        onClick={handleCancelRecording}
        disabled={isUploading}
        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Cancel recording"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Recording Duration Section */}
      <div className="flex-1 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <span className="text-sm font-mono text-foreground tabular-nums">
          {durationLabel}
        </span>
        <span className="text-xs text-muted-foreground">Recording…</span>
      </div>

      {/* Stop and Send Voice Message Button Section */}
      <button
        type="button"
        onClick={handleStopRecording}
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
