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
const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")
    : "http://localhost:3000";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 10;

const ACCEPTED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
].join(",");

// ── Per-file state ────────────────────────────────────────────────────────────
interface PendingFile {
  id: string;
  preview: string | null;
  status: "uploading" | "ready" | "error";
  error?: string;
  uploaded?: { url: string; type: "image" | "document"; filename: string };
  filename: string;
}

/**
 * Chat input bar with multi-file attachment support.
 *
 * Attachment flow:
 *  1. User clicks 📎 → native picker opens with `multiple` enabled.
 *  2. Each file is validated client-side (size; MIME filtered by `accept`).
 *  3. All valid files are uploaded concurrently via POST /chat/upload.
 *  4. A scrollable thumbnail strip shows each file's state:
 *       spinner = uploading · normal = ready · red ✕ = failed.
 *  5. An "Add more" tile lets the user queue extra files without
 *     re-opening the picker from the toolbar.
 *  6. On send the parent receives all ready attachments; page.tsx dispatches
 *     each as its own socket message (text goes on the first file's message).
 */
export default function ChatInput(props: IChatInputProps) {
  const { onSendMessage, onTyping, isDisabled = false, replyTarget, onCancelReply } = props;

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop typing indicator on unmount
  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping?.(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setPendingFiles((prev) => {
        prev.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
        return [];
      });
    };
  }, []);

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

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    if (!onTyping) return;
    if (value.trim()) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => onTyping(false), CHAT_TYPING_DEBOUNCE_MS);
    } else {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping(false);
    }
  };

  // ── File selection & upload ───────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!selected.length) return;

    const slots = MAX_FILES - pendingFiles.length;
    const toProcess = selected.slice(0, slots);

    const newEntries: PendingFile[] = toProcess.map((file) => {
      const id = Math.random().toString(36).slice(2);
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return { id, preview: null, status: "error" as const, error: `${file.name}: exceeds ${MAX_FILE_SIZE_MB} MB`, filename: file.name };
      }
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      return { id, preview, status: "uploading" as const, filename: file.name };
    });

    setPendingFiles((prev) => [...prev, ...newEntries]);

    await Promise.all(
      toProcess.map(async (file, i) => {
        const entry = newEntries[i];
        if (entry.status === "error") return;

        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch(`${API_BASE}/chat/upload`, { method: "POST", body: formData, credentials: "include" });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Upload failed (${res.status})`);
          }
          const data = await res.json();
          setPendingFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: "ready" as const, uploaded: { url: data.url, type: data.type as "image" | "document", filename: data.filename || file.name } }
                : f,
            ),
          );
        } catch (err: any) {
          if (entry.preview) URL.revokeObjectURL(entry.preview);
          setPendingFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, preview: null, status: "error" as const, error: err?.message || "Upload failed. Please try again." }
                : f,
            ),
          );
        }
      }),
    );
  };

  const removeFile = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAllAttachments = () => {
    setPendingFiles((prev) => {
      prev.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
      return [];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const hasText = newMessage.trim() !== "";
    const readyFiles = pendingFiles.filter((f) => f.status === "ready");
    const isUploadingNow = pendingFiles.some((f) => f.status === "uploading");

    if ((!hasText && !readyFiles.length) || isSending || isDisabled || isUploadingNow) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTyping?.(false);

    const replyTo: IMessage["replyTo"] | null = replyTarget
      ? {
          id: replyTarget.id,
          content: replyTarget.isDeleted ? "This message was deleted" : replyTarget.content,
          senderName: replyTarget.senderName || (replyTarget.isMe ? "You" : ""),
          isDeleted: replyTarget.isDeleted,
        }
      : null;

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim(), replyTo, readyFiles.map((f) => f.uploaded!));
      setNewMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      if (replyTarget) onCancelReply?.();
      clearAllAttachments();
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  // ── Derived flags ─────────────────────────────────────────────────────────
  const isUploadingAny = pendingFiles.some((f) => f.status === "uploading");
  const readyCount = pendingFiles.filter((f) => f.status === "ready").length;
  const errorCount = pendingFiles.filter((f) => f.status === "error").length;
  const hasAnyFiles = pendingFiles.length > 0;
  const atFileLimit = pendingFiles.length >= MAX_FILES;
  const inputDisabled = isSending || isDisabled;
  const sendDisabled = inputDisabled || (!newMessage.trim() && readyCount === 0) || isUploadingAny;

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
                : (replyTarget.content ?? "").slice(0, 100) + ((replyTarget.content ?? "").length > 100 ? "…" : "")}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground mt-0.5" onClick={onCancelReply} aria-label="Cancel reply">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* ── Multi-file attachment strip ───────────────────────────────────── */}
      {hasAnyFiles && (
        <div className="px-3 md:px-4 pt-2 pb-0">
          {/* Horizontally scrollable thumbnail row */}
          <div className="flex items-start gap-2 overflow-x-auto pb-1 no-scrollbar">
            {pendingFiles.map((file) => (
              <div key={file.id} className="relative shrink-0 w-20 flex flex-col items-center gap-1">
                {/* Thumbnail card */}
                <div className={`relative w-20 h-20 rounded-lg overflow-hidden bg-muted border flex items-center justify-center ${file.status === "error" ? "border-destructive/50" : "border-border/50"}`}>
                  {/* Uploading spinner */}
                  {file.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10">
                      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  )}
                  {/* Error overlay */}
                  {file.status === "error" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-destructive/15 z-10">
                      <X className="h-6 w-6 text-destructive" />
                    </div>
                  )}
                  {/* Image preview or document icon */}
                  {file.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.preview} alt={file.filename} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 p-2">
                      {file.filename.match(/\.(jpe?g|png|gif|webp)$/i)
                        ? <ImageIcon className="h-7 w-7 text-muted-foreground" />
                        : <FileText className="h-7 w-7 text-muted-foreground" />}
                    </div>
                  )}
                </div>

                {/* Filename / error label */}
                <span
                  className={`text-[10px] truncate w-full text-center leading-tight px-0.5 ${file.status === "error" ? "text-destructive" : "text-muted-foreground"}`}
                  title={file.status === "error" ? file.error : file.filename}
                >
                  {file.status === "error" ? "Failed" : file.filename}
                </span>

                {/* Remove × */}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-20"
                  aria-label={`Remove ${file.filename}`}
                >
                  <X className="h-2.5 w-2.5 text-muted-foreground" />
                </button>
              </div>
            ))}

            {/* "Add more" tile */}
            {!atFileLimit && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={inputDisabled}
                className="shrink-0 w-20 h-20 rounded-lg border border-dashed border-border/70 bg-muted/30 flex flex-col items-center justify-center gap-1 hover:bg-muted/60 hover:border-border transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Add more files"
              >
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Add more</span>
              </button>
            )}
          </div>

          {/* Status summary + clear-all */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-muted-foreground">
              {isUploadingAny
                ? "Uploading…"
                : [
                    readyCount > 0 && `${readyCount} file${readyCount !== 1 ? "s" : ""} ready`,
                    errorCount > 0 && `${errorCount} failed`,
                  ].filter(Boolean).join(" · ")}
            </span>
            <button type="button" onClick={clearAllAttachments} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div className="px-3 py-3 md:px-4 flex items-end gap-2">
        {/* Hidden multi-file input */}
        <input ref={fileInputRef} type="file" accept={ACCEPTED_MIME_TYPES} multiple className="hidden" onChange={handleFileSelect} aria-label="Attach files" />

        {/* Paperclip button */}
        <Button
          variant="ghost" size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          disabled={inputDisabled || atFileLimit}
          aria-label={atFileLimit ? `Maximum ${MAX_FILES} files reached` : "Attach files"}
          title={atFileLimit ? `Maximum ${MAX_FILES} files reached` : "Attach files"}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Textarea + emoji button */}
        <div className="flex-1 relative flex items-end">
          <Textarea
            ref={textareaRef}
            placeholder={isDisabled ? "Loading..." : "Message…"}
            className="resize-none min-h-[40px] max-h-[120px] py-2 pr-10 text-sm leading-relaxed overflow-y-auto rounded-2xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            rows={1}
            value={newMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            disabled={inputDisabled}
          />
          <Button variant="ghost" size="icon" className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground hover:text-foreground" disabled={inputDisabled} aria-label="Emoji">
            <SmilePlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button size="icon" className="h-9 w-9 shrink-0 rounded-full" onClick={handleSend} disabled={sendDisabled} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
