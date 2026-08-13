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
        className="mt-1 block"
      >
        <Image
          src={fullUrl}
          alt={filename || "Image attachment"}
          width={960}
          height={720}
          className="border-current/15 max-h-64 max-w-full cursor-pointer rounded-none border object-cover transition-opacity hover:opacity-90"
          unoptimized
        />
      </a>
    );
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`mt-2 overflow-hidden rounded-none border ${
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
            className={`truncate text-sm font-medium leading-tight [&:not(:first-child)]:mt-0 ${
              isMe ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {filename || "Document"}
          </TypographyP>
          {fileSize && (
            <TypographyMuted
              className={`mt-0.5 text-xs ${
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
          className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-none border text-xs font-medium transition-colors ${
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
          className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-none border text-xs font-medium transition-colors ${
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
