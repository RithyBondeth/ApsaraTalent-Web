import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ImageIcon,
  Paperclip,
  Send,
  SmilePlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IChatInputProps } from "./props";
import { IMessage } from "../props";
import { CHAT_TYPING_DEBOUNCE_MS } from "@/utils/constants/app.constant";

// ── Constants ────────────────────────────────────────────────────────────────
// NEXT_PUBLIC_API_URL is the raw backend base (e.g. "http://localhost:3000").
// Chat routes live directly under /chat/... (no /api prefix).
const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")
    : "http://localhost:3000";

/** Max file size shown in the UI validation message (must match the backend). */
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Accepted MIME types (must match the backend fileFilter). */
const ACCEPTED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
].join(",");

/**
 * Chat input bar.
 *
 * Features:
 *  - Text input with auto-resize (up to ~5 lines).
 *  - Enter to send (Shift+Enter for newline).
 *  - Debounced typing indicator.
 *  - Reply/quote preview bar (dismissible).
 *  - File/image attachment picker with client-side preview and upload.
 *
 * Attachment flow:
 *  1. User clicks the 📎 button → hidden file input opens.
 *  2. File is validated client-side (type + size).
 *  3. File is POSTed to POST /chat/upload (REST endpoint).
 *  4. Server saves the file and returns { url, type, filename }.
 *  5. Attachment preview bar appears above the textarea.
 *  6. When user sends, onSendMessage() receives the attachment data.
 *  7. After send, the attachment preview is cleared.
 */
export default function ChatInput(props: IChatInputProps) {
  const {
    onSendMessage,
    onTyping,
    isDisabled = false,
    replyTarget,
    onCancelReply,
  } = props;

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ── Attachment state ──────────────────────────────────────────────────────
  // pendingAttachment: the result returned by POST /chat/upload (URL, type, filename).
  // attachmentPreview: a local object URL for image preview before upload.
  // isUploading: true while the file is being uploaded.
  // uploadError: error message if upload failed.
  const [pendingAttachment, setPendingAttachment] = useState<{
    url: string;
    type: "image" | "document";
    filename: string;
  } | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up typing timer on unmount and stop the typing indicator so the
  // partner doesn't see an infinite "typing…" animation after navigation.
  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping?.(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [newMessage]);

  // Focus textarea when a reply target is set
  useEffect(() => {
    if (replyTarget) textareaRef.current?.focus();
  }, [replyTarget]);

  // Revoke object URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
    };
  }, [attachmentPreview]);

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    if (!onTyping) return;
    if (value.trim()) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(
        () => onTyping(false),
        CHAT_TYPING_DEBOUNCE_MS,
      );
    } else {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping(false);
    }
  };

  // ── File selection & upload ───────────────────────────────────────────────
  /**
   * Triggered when the user picks a file from the system picker.
   *
   * Steps:
   *  1. Validate MIME type and size client-side for fast feedback.
   *  2. Generate a local object URL for image previews (document shows icon).
   *  3. Upload to the server via POST /chat/upload.
   *  4. Store the server response in `pendingAttachment`.
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset any previous error
    setUploadError(null);

    // Client-side size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }

    // Show a local preview for images immediately (before upload completes)
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setAttachmentPreview(previewUrl);
    } else {
      setAttachmentPreview(null); // Document: show icon instead
    }

    // Upload the file to the server
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/chat/upload`, {
        method: "POST",
        body: formData,
        credentials: "include", // Send auth-token cookie
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      // data = { url, type: 'image'|'document', filename, size }
      setPendingAttachment({
        url: data.url,
        type: data.type,
        filename: data.filename || file.name,
      });
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed. Please try again.");
      setAttachmentPreview(null);
      setPendingAttachment(null);
    } finally {
      setIsUploading(false);
      // Reset file input so the same file can be re-selected after removal
      e.target.value = "";
    }
  };

  /** Remove the pending attachment and its preview. */
  const clearAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
      setAttachmentPreview(null);
    }
    setPendingAttachment(null);
    setUploadError(null);
    // Reset the file input so the same file can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const hasText = newMessage.trim() !== "";
    const hasAttachment = !!pendingAttachment;

    // Must have at least text OR a fully-uploaded attachment
    if ((!hasText && !hasAttachment) || isSending || isDisabled) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTyping?.(false);

    // Build the replyTo preview object from the current replyTarget
    const replyTo: IMessage["replyTo"] | null = replyTarget
      ? {
          id: replyTarget.id,
          content: replyTarget.isDeleted
            ? "This message was deleted"
            : replyTarget.content,
          senderName:
            replyTarget.senderName || (replyTarget.isMe ? "You" : ""),
          isDeleted: replyTarget.isDeleted,
        }
      : null;

    setIsSending(true);
    try {
      // Pass text, replyTo context, and attachment to the parent handler.
      // The parent calls store.sendMessage() which puts all three in the socket payload.
      await onSendMessage(newMessage.trim(), replyTo, pendingAttachment);

      setNewMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      if (replyTarget) onCancelReply?.();
      clearAttachment(); // Reset attachment after send
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const inputDisabled = isSending || isDisabled;
  // Send is enabled if there's text OR an uploaded attachment (not just uploading)
  const sendDisabled = inputDisabled || (!newMessage.trim() && !pendingAttachment) || isUploading;

  return (
    <div className="border-t bg-background shrink-0">
      {/* ── Reply preview bar ─────────────────────────────────────────────── */}
      {replyTarget && (
        <div className="px-3 md:px-4 pt-2 pb-0 flex items-start gap-2">
          <div className="flex-1 border-l-2 border-primary pl-2 pr-1 py-0.5 rounded-sm bg-muted/30">
            <p className="text-xs font-semibold text-primary leading-tight">
              {replyTarget.isMe ? "You" : replyTarget.senderName || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground leading-snug truncate">
              {replyTarget.isDeleted
                ? "🚫 This message was deleted"
                : (replyTarget.content ?? "").slice(0, 100) +
                  ((replyTarget.content ?? "").length > 100 ? "…" : "")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground mt-0.5"
            onClick={onCancelReply}
            aria-label="Cancel reply"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* ── Attachment preview bar ────────────────────────────────────────── */}
      {/* Shown while a file is uploading or after it's ready to send.
          Displays an image thumbnail or a document icon + filename.
          The ✕ button removes the attachment so the user can pick a different one. */}
      {(isUploading || pendingAttachment || uploadError) && (
        <div className="px-3 md:px-4 pt-2 pb-0">
          {uploadError ? (
            // Upload error notice
            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <span className="flex-1">{uploadError}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-destructive"
                onClick={clearAttachment}
                aria-label="Dismiss error"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : isUploading ? (
            // Uploading spinner
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Uploading…</span>
            </div>
          ) : pendingAttachment ? (
            // Ready-to-send attachment preview
            <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-2 py-1.5 max-w-xs">
              {/* Thumbnail for images; document icon for files */}
              {pendingAttachment.type === "image" && attachmentPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={attachmentPreview}
                  alt="Preview"
                  className="h-10 w-10 rounded object-cover shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                  {pendingAttachment.type === "image" ? (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              )}
              <span className="text-xs text-muted-foreground truncate flex-1">
                {pendingAttachment.filename}
              </span>
              {/* Remove button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={clearAttachment}
                aria-label="Remove attachment"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div className="px-3 py-3 md:px-4 flex items-end gap-2">
        {/* Hidden file input — triggered by the 📎 button */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES}
          className="hidden"
          onChange={handleFileSelect}
          aria-label="Attach file"
        />

        {/* Attachment (📎) button — opens the file picker */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          disabled={inputDisabled || isUploading || !!pendingAttachment}
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Text area + emoji button */}
        <div className="flex-1 relative flex items-end">
          <Textarea
            ref={textareaRef}
            placeholder={isDisabled ? "Loading..." : "Message…"}
            className="resize-none min-h-[40px] max-h-[120px] py-2 pr-10 text-sm leading-relaxed overflow-y-auto rounded-2xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            rows={1}
            value={newMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={inputDisabled}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled={inputDisabled}
            aria-label="Emoji"
          >
            <SmilePlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          onClick={handleSend}
          disabled={sendDisabled}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
