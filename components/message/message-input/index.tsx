"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FileText,
  ImageIcon,
  LucideSendHorizonal,
  Mic,
  Paperclip,
  SmilePlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IChatInputProps } from "./props";
import { IMessage } from "../props";
import { CHAT_TYPING_DEBOUNCE_MS } from "@/utils/constants/app.constant";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { VoiceRecordingUI } from "./voice-recording-ui";
import { useThemeStore } from "@/stores/themes/theme-store";
import dynamic from "next/dynamic";

// Lazy-load emoji-mart — ~90KB dataset + picker only needed when user opens the emoji popover
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });
// Lazy-load emoji data alongside the picker to avoid blocking initial bundle
let emojiData: unknown = null;
if (typeof window !== "undefined") {
  import("@emoji-mart/data").then((mod) => {
    emojiData = mod.default;
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────
const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    : "http://localhost:3000";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 10;

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
].join(",");

// ── Per-file state ─────────────────────────────────────────────────────────────
interface PendingFile {
  id: string;
  preview: string | null;
  status: "uploading" | "ready" | "error";
  error?: string;
  uploaded?: {
    url: string;
    type: "image" | "document" | "audio";
    filename: string;
    duration?: number;
    amplitude?: number[];
  };
  filename: string;
}

/**
 * Chat input bar — redesigned to match shadcnuikit reference.
 *
 * Layout (idle):
 *   ┌──────────────────────────────────────────────────────┐  ┌──────┐
 *   │  😊  📎  🎤   Enter message...                       │  │ Send │
 *   └──────────────────────────────────────────────────────┘  └──────┘
 *
 * When files are pending, a compact thumbnail strip appears above the input
 * inside the same container card.
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
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isEmojiOpen, setEmojiOpen] = useState(false);
  const { theme, systemTheme } = useThemeStore();
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // ── Voice recorder ─────────────────────────────────────────────────────────
  const {
    recordingState,
    durationSeconds,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();
  const isRecording = recordingState === "recording";
  const isVoiceUploading = recordingState === "uploading";

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolveReplyPreview = (target: IMessage) => {
    if (target.isDeleted) return "This message was deleted";
    const content = target.content?.trim();
    if (content) return content;
    const type = target.attachmentType;
    if (type === "audio") return "Audio message";
    if (type === "image") return "Photo";
    if (type === "document") return "Attachment";
    if (target.attachment) return "Attachment";
    return "Message";
  };

  const buildReplyTo = (
    target?: IMessage | null,
  ): IMessage["replyTo"] | null => {
    if (!target) return null;
    return {
      id: target.id,
      content: resolveReplyPreview(target),
      senderName: target.senderName || (target.isMe ? "You" : ""),
      isDeleted: target.isDeleted,
    };
  };

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
        prev.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
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
      typingTimerRef.current = setTimeout(
        () => onTyping(false),
        CHAT_TYPING_DEBOUNCE_MS,
      );
    } else {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    if (inputDisabled || !emoji) return;
    const el = textareaRef.current;
    const text = newMessage;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const next = `${text.slice(0, start)}${emoji}${text.slice(end)}`;
    handleInputChange(next);
    setEmojiOpen(false);
    requestAnimationFrame(() => {
      if (!el) return;
      const pos = start + emoji.length;
      el.focus();
      el.selectionStart = pos;
      el.selectionEnd = pos;
    });
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
        return {
          id,
          preview: null,
          status: "error" as const,
          error: `${file.name}: exceeds ${MAX_FILE_SIZE_MB} MB`,
          filename: file.name,
        };
      }
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
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
          const res = await fetch(`${API_BASE}/chat/upload`, {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Upload failed (${res.status})`);
          }
          const data = await res.json();
          setPendingFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? {
                    ...f,
                    status: "ready" as const,
                    uploaded: {
                      url: data.url,
                      type: data.type as "image" | "document" | "audio",
                      filename: data.filename || file.name,
                    },
                  }
                : f,
            ),
          );
        } catch (err: unknown) {
          if (entry.preview) URL.revokeObjectURL(entry.preview);
          const message =
            err instanceof Error
              ? err.message
              : "Upload failed. Please try again.";
          setPendingFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? {
                    ...f,
                    preview: null,
                    status: "error" as const,
                    error: message,
                  }
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
      prev.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      return [];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const hasText = newMessage.trim() !== "";
    const readyFiles = pendingFiles.filter((f) => f.status === "ready");
    const isUploadingNow = pendingFiles.some((f) => f.status === "uploading");

    if (
      (!hasText && !readyFiles.length) ||
      isSending ||
      isDisabled ||
      isUploadingNow
    )
      return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTyping?.(false);

    const replyTo = buildReplyTo(replyTarget);

    setIsSending(true);
    try {
      const sent = onSendMessage(
        newMessage.trim(),
        replyTo,
        readyFiles.map((f) => f.uploaded!),
      );
      if (sent) {
        setNewMessage("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        if (replyTarget) onCancelReply?.();
        clearAllAttachments();
      }
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
  const sendDisabled =
    inputDisabled || (!newMessage.trim() && readyCount === 0) || isUploadingAny;

  return (
    <div className="px-3 py-3 md:px-4 bg-background border-t shrink-0">
      {/* ── Reply preview bar ───────────────────────────────────────────── */}
      {replyTarget && (
        <div className="mb-2 flex items-start gap-2 px-1">
          <div className="flex-1 border-l-2 border-primary pl-2 pr-1 py-0.5 rounded-sm bg-muted/40">
            <p className="text-xs font-semibold text-primary leading-tight">
              {replyTarget.isMe ? "You" : replyTarget.senderName || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground leading-snug truncate">
              {replyTarget.isDeleted
                ? "🚫 This message was deleted"
                : (() => {
                    const text = resolveReplyPreview(replyTarget);
                    return text.slice(0, 100) + (text.length > 100 ? "…" : "");
                  })()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onCancelReply}
            aria-label="Cancel reply"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* ── Main input container ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES}
          multiple
          className="hidden"
          onChange={handleFileSelect}
          aria-label="Attach files"
        />

        {/* ── Input pill ─────────────────────────────────────────────────── */}
        <div className="flex-1 rounded-2xl border border-border bg-muted/30 focus-within:border-primary/40 focus-within:bg-background transition-colors overflow-hidden">
          {/* Attachment thumbnail strip (inside the pill, above the textarea) */}
          {hasAnyFiles && (
            <div className="px-3 pt-2.5 pb-1">
              <div className="flex items-start gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {pendingFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative shrink-0 w-14 flex flex-col items-center gap-0.5"
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative w-14 h-14 rounded-lg overflow-hidden bg-muted border flex items-center justify-center ${
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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={file.preview}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
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

                    {/* Filename label */}
                    <span
                      className={`text-[9px] truncate w-full text-center leading-tight ${
                        file.status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                      title={
                        file.status === "error" ? file.error : file.filename
                      }
                    >
                      {file.status === "error" ? "Failed" : file.filename}
                    </span>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-20"
                      aria-label={`Remove ${file.filename}`}
                    >
                      <X className="h-2 w-2 text-muted-foreground" />
                    </button>
                  </div>
                ))}

                {/* Add more tile */}
                {!atFileLimit && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={inputDisabled}
                    className="shrink-0 w-14 h-14 rounded-lg border border-dashed border-border/70 bg-muted/30 flex flex-col items-center justify-center gap-0.5 hover:bg-muted/60 hover:border-border transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Add more files"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground leading-none">
                      Add
                    </span>
                  </button>
                )}
              </div>

              {/* Upload status bar */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {isUploadingAny
                    ? "Uploading…"
                    : [
                        readyCount > 0 &&
                          `${readyCount} file${readyCount !== 1 ? "s" : ""} ready`,
                        errorCount > 0 && `${errorCount} failed`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                </span>
                <button
                  type="button"
                  onClick={clearAllAttachments}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* ── Input row: recording UI OR textarea + icons ──────────────── */}
          {isRecording || isVoiceUploading ? (
            <VoiceRecordingUI
              durationSeconds={durationSeconds}
              isUploading={isVoiceUploading}
              onCancel={cancelRecording}
              onStop={() =>
                stopRecording((attachment) => {
                  const replyTo = buildReplyTo(replyTarget);
                  onSendMessage("", replyTo, [attachment]);
                  if (replyTarget) onCancelReply?.();
                })
              }
            />
          ) : (
            <div className="flex items-end px-3 py-2 gap-1">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                placeholder={isDisabled ? "Loading..." : "Enter message..."}
                className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none border-none min-h-[32px] max-h-[120px] overflow-y-auto py-1 disabled:opacity-50"
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

              {/* Emoji */}
              <Popover open={isEmojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    disabled={inputDisabled}
                    className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Emoji"
                  >
                    <SmilePlus className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  className="w-[320px] p-0"
                >
                  <Picker
                    data={emojiData}
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    set="native"
                    previewPosition="none"
                    skinTonePosition="none"
                    searchPosition="top"
                    perLine={8}
                    onEmojiSelect={(emoji: { native?: string }) =>
                      insertEmoji(emoji?.native ?? "")
                    }
                  />
                </PopoverContent>
              </Popover>

              {/* Attach */}
              <button
                type="button"
                disabled={inputDisabled || atFileLimit}
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label={
                  atFileLimit
                    ? `Maximum ${MAX_FILES} files reached`
                    : "Attach files"
                }
                title={
                  atFileLimit
                    ? `Maximum ${MAX_FILES} files reached`
                    : "Attach files"
                }
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Mic — toggle recording on click */}
              <button
                type="button"
                disabled={inputDisabled}
                onClick={startRecording}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Record voice message"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Send button — hidden while voice recording/uploading ───────── */}
        {!isRecording && !isVoiceUploading && (
          <Button
            variant="default"
            onClick={handleSend}
            disabled={sendDisabled}
            className="shrink-0 h-10 px-5 font-medium"
            aria-label="Send message"
          >
            <LucideSendHorizonal />
          </Button>
        )}
      </div>
    </div>
  );
}
