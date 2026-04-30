import { formatFileSize } from "@/utils/functions/file";
import { normalizeMediaUrl } from "@/utils/functions/media";
import { AudioPlayer } from "../audio-player";
import { Download, ExternalLink, FileText } from "lucide-react";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";

export default function AttachmentRender(props: {
  url: string;
  type: "image" | "document" | "audio";
  filename?: string;
  fileSize?: number;
  isMe?: boolean;
  duration?: number;
  amplitude?: number[];
}) {
  /* --------------------------------- Props --------------------------------- */
  const { url, type, filename, fileSize, isMe, duration, amplitude } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const fullUrl = normalizeMediaUrl(url) || url;

  /* ------------------------------- Audio State ------------------------------ */
  if (type === "audio") {
    return (
      <AudioPlayer
        url={fullUrl}
        duration={duration}
        amplitude={amplitude}
        isMe={isMe}
      />
    );
  }

  /* ------------------------------- Image State------------------------------- */
  if (type === "image") {
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-1"
      >
        <Image
          src={fullUrl}
          alt={filename || "Image attachment"}
          width={960}
          height={720}
          className="max-w-full rounded-xl max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          unoptimized
        />
      </a>
    );
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`mt-2 rounded-2xl border overflow-hidden ${
        isMe
          ? "border-primary-foreground/20 bg-primary-foreground/10"
          : "border-border bg-background"
      }`}
    >
      {/* File Section */}
      <div className="flex items-center gap-3 px-4 py-3">
        <FileText
          className={`h-8 w-8 shrink-0 ${
            isMe ? "text-primary-foreground/70" : "text-muted-foreground/60"
          }`}
        />
        <div className="min-w-0">
          <TypographyP
            className={`[&:not(:first-child)]:mt-0 text-sm font-medium truncate leading-tight ${
              isMe ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {filename || "Document"}
          </TypographyP>
          {fileSize && (
            <TypographyMuted
              className={`text-xs mt-0.5 ${
                isMe ? "text-primary-foreground/60" : "text-muted-foreground"
              }`}
            >
              ({formatFileSize(fileSize)})
            </TypographyMuted>
          )}
        </div>
      </div>

      {/* Action Buttons Section: Download and Preview Buttons */}
      <div className={`flex gap-2 px-4 pb-3`}>
        <a
          href={fullUrl}
          download={filename}
          className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isMe
              ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              : "border-border text-foreground hover:bg-muted"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-3 w-3" />
          Download
        </a>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isMe
              ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              : "border-border text-foreground hover:bg-muted"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3" />
          Preview
        </a>
      </div>
    </div>
  );
}
