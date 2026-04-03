import { FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { IMessageAttachmentStripProps } from "./props";

export function MessageAttachmentStrip(props: IMessageAttachmentStripProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    pendingFiles,
    atFileLimit,
    inputDisabled,
    isUploadingAny,
    readyCount,
    errorCount,
    onAddMoreFiles,
    onClearAll,
    onRemoveFile,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const uploadStatusLabel = isUploadingAny
    ? "Uploading…"
    : [
        readyCount > 0 &&
          `${readyCount} file${readyCount !== 1 ? "s" : ""} ready`,
        errorCount > 0 && `${errorCount} failed`,
      ]
        .filter(Boolean)
        .join(" · ");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="px-3 pt-2.5 pb-1">
      {/* File Strip Section */}
      <div className="flex items-start gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {pendingFiles.map((file) => (
          <div
            key={file.id}
            className="relative shrink-0 w-12 sm:w-14 flex flex-col items-center gap-0.5"
          >
            {/* File Preview Section */}
            <div
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-muted border flex items-center justify-center ${
                file.status === "error"
                  ? "border-destructive/50"
                  : "border-border/50"
              }`}
            >
              {file.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10">
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}

              {file.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/15 z-10">
                  <X className="h-5 w-5 text-destructive" />
                </div>
              )}

              {file.preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- object URL previews are generated client-side for local files */}
                <img
                  src={file.preview}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                />
                </>
              ) : (
                <div className="flex items-center justify-center p-2">
                  {file.filename.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>

            {/* File Name Section */}
            <span
              className={`text-[9px] truncate w-full text-center leading-tight ${
                file.status === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
              title={file.status === "error" ? file.error : file.filename}
            >
              {file.status === "error" ? "Failed" : file.filename}
            </span>

            <button
              type="button"
              onClick={() => onRemoveFile(file.id)}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-20"
              aria-label={`Remove ${file.filename}`}
            >
              <X className="h-2 w-2 text-muted-foreground" />
            </button>
          </div>
        ))}

        {/* Add More Files Section */}
        {!atFileLimit && (
          <button
            type="button"
            onClick={onAddMoreFiles}
            disabled={inputDisabled}
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-dashed border-border/70 bg-muted/30 flex flex-col items-center justify-center gap-0.5 hover:bg-muted/60 hover:border-border transition-colors disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Add more files"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground leading-none">
              Add
            </span>
          </button>
        )}
      </div>

      {/* Upload Status Section */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">
          {uploadStatusLabel}
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
