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
    <div className="px-3 pb-1 pt-2.5">
      {/* File Strip Section */}
      <div className="no-scrollbar flex items-start gap-2 overflow-x-auto pb-0.5">
        {pendingFiles.map((file) => (
          <div
            key={file.id}
            className="relative flex w-12 shrink-0 flex-col items-center gap-0.5 sm:w-14"
          >
            {/* File Preview Section */}
            <div
              className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-none border bg-muted sm:h-14 sm:w-14 ${
                file.status === "error"
                  ? "border-destructive/50"
                  : "border-border/50"
              }`}
            >
              {file.status === "uploading" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {file.status === "error" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-destructive/15">
                  <X className="h-5 w-5 text-destructive" />
                </div>
              )}

              {file.preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- object URL previews are generated client-side for local files */}
                  <img
                    src={file.preview}
                    alt={file.filename}
                    className="h-full w-full object-cover"
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
              className={`w-full truncate text-center text-[9px] leading-tight ${
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
              className="absolute -right-1 -top-1 z-20 flex h-4 w-4 items-center justify-center rounded-none border border-border bg-background shadow-sm transition-colors hover:bg-muted"
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
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-none border border-dashed border-border/70 bg-muted/30 transition-colors hover:border-border hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40 sm:h-14 sm:w-14"
            aria-label="Add more files"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-[9px] leading-none text-muted-foreground">
              Add
            </span>
          </button>
        )}
      </div>

      {/* Upload Status Section */}
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {uploadStatusLabel}
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[10px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
