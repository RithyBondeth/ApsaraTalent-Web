import { formatDurationClock } from "@/utils/functions/date";
import { LucideCheck, LucideLoader2, LucideX } from "lucide-react";
import { IVoiceRecordingUIProps } from "./props";
import { useTranslations } from "next-intl";

export function VoiceRecordingUI(props: IVoiceRecordingUIProps) {
  /* --------------------------------- Props --------------------------------- */
  const { durationSeconds, isUploading, onCancel, onStop } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
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
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        aria-label="Cancel recording"
      >
        <LucideX className="h-4 w-4" />
      </button>

      {/* Recording Duration Section */}
      <div className="flex flex-1 items-center gap-2">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {durationLabel}
        </span>
        <span className="text-xs text-muted-foreground">{t("recording")}</span>
      </div>

      {/* Stop and Send Voice Message Button Section */}
      <button
        type="button"
        onClick={handleStopRecording}
        disabled={isUploading}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
        aria-label={isUploading ? "Uploading…" : "Stop and send voice message"}
      >
        {isUploading ? (
          <LucideLoader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LucideCheck className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
