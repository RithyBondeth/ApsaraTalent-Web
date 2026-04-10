"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LucideSendHorizonal, Mic, Paperclip, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IChatInputProps } from "./props";
import {
  CHAT_ACCEPTED_MIME_TYPES,
  CHAT_MAX_FILE_SIZE_BYTES,
  CHAT_MAX_FILE_SIZE_MB,
  CHAT_MAX_FILES,
  CHAT_TYPING_DEBOUNCE_MS,
} from "@/utils/constants/chat.constant";
import { useVoiceRecorder } from "@/hooks/chat/use-voice-recorder";
import { MessageAttachmentStrip } from "./attachment-strip";
import { VoiceRecordingUI } from "./voice-recording";
import { useThemeStore } from "@/stores/themes/theme-store";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { MessageReplyPreview } from "./reply-preview";
import { API_BASE_URL } from "@/utils/constants/apis/base.api.constant";
import type { IPendingFile } from "@/utils/interfaces/chat/chat.interface";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";

/* ------------------------------------- Handle Lazy Load ------------------------------------- */
// Lazy-load emoji-mart — ~90KB dataset + picker only needed when user opens the emoji popover
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });
// Lazy-load emoji data alongside the picker to avoid blocking initial bundle
let emojiData: unknown = null;
if (typeof window !== "undefined") {
  import("@emoji-mart/data").then((mod) => {
    emojiData = mod.default;
  });
}

/* ------------------------------------------ Helpers ----------------------------------------- */
function resolveReplyPreview(target: IMessage) {
  if (target.isDeleted) return "This message was deleted";

  const content = target.content?.trim();
  if (content) return content;

  const type = target.attachmentType;
  if (type === "audio") return "Audio message";
  if (type === "image") return "Photo";
  if (type === "document") return "Attachment";
  if (target.attachment) return "Attachment";

  return "Message";
}

function buildReplyTo(target?: IMessage | null): IMessage["replyTo"] | null {
  if (!target) return null;

  return {
    id: target.id,
    content: resolveReplyPreview(target),
    senderName: target.senderName || (target.isMe ? "You" : ""),
    isDeleted: target.isDeleted,
  };
}

export default function ChatInput(props: IChatInputProps) {
  /* ----------------------------------------- Props ----------------------------------------- */
  const {
    onSendMessage,
    onTyping,
    isDisabled = false,
    replyTarget,
    onCancelReply,
  } = props;

  /* ------------------------------------- API Integration ------------------------------------ */
  const { theme, systemTheme } = useThemeStore();
  const {
    recordingState,
    durationSeconds,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

  /* ---------------------------------------- All States -------------------------------------- */
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [pendingFiles, setPendingFiles] = useState<IPendingFile[]>([]);
  const [isEmojiOpen, setEmojiOpen] = useState<boolean>(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------------- Utils --------------------------------- */
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isRecording = recordingState === "recording";
  const isVoiceUploading = recordingState === "uploading";
  const replyPreviewText = replyTarget
    ? resolveReplyPreview(replyTarget)
    : null;
  const isUploadingAny = pendingFiles.some(
    (file) => file.status === "uploading",
  );
  const readyCount = pendingFiles.filter(
    (file) => file.status === "ready",
  ).length;
  const errorCount = pendingFiles.filter(
    (file) => file.status === "error",
  ).length;
  const hasAnyFiles = pendingFiles.length > 0;
  const atFileLimit = pendingFiles.length >= CHAT_MAX_FILES;
  const inputDisabled = isSending || isDisabled;
  const sendDisabled =
    inputDisabled || (!newMessage.trim() && readyCount === 0) || isUploadingAny;

  /* --------------------------------- Effects --------------------------------- */
  // Stop typing indicator on unmount
  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping?.(false);
    },
    [onTyping],
  );

  // Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
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

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Text Input ─────────────────────────────────────────
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

  // ── Handle Emoji Insert ─────────────────────────────────────────
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

  // ── Handle File Upload ─────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!selected.length) return;

    const slots = CHAT_MAX_FILES - pendingFiles.length;
    const toProcess = selected.slice(0, slots);

    const newEntries: IPendingFile[] = toProcess.map((file) => {
      const id = Math.random().toString(36).slice(2);
      if (file.size > CHAT_MAX_FILE_SIZE_BYTES) {
        return {
          id,
          preview: null,
          status: "error" as const,
          error: `${file.name}: exceeds ${CHAT_MAX_FILE_SIZE_MB} MB`,
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
          const accessToken = getCookie("auth-token");
          const res = await fetch(`${API_BASE_URL}/chat/upload`, {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: accessToken
              ? { Authorization: `Bearer ${String(accessToken)}` }
              : undefined,
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

  // ── Handle Attachment Cleanup ─────────────────────────────────────────
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

  // ── Handle File Picker ──────────────────────────────────────────────────
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // ── Handle Voice Recording Send ─────────────────────────────────────────
  const handleVoiceRecordingStop = () =>
    stopRecording((attachment) => {
      const replyTo = buildReplyTo(replyTarget);
      const sent = onSendMessage("", replyTo, [attachment]);
      if (sent) {
        if (replyTarget) onCancelReply?.();
        return;
      }

      setPendingFiles((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          preview: null,
          status: "ready",
          uploaded: attachment,
          filename: attachment.filename,
        },
      ]);
    });

  // ── Handle Message Send ─────────────────────────────────────────────────
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

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="px-2.5 py-2 md:px-4 md:py-3 bg-background border-t shrink-0 [padding-bottom:calc(env(safe-area-inset-bottom)+0.5rem)] md:[padding-bottom:0.75rem]">
      {/* Reply Preview Bar Section */}
      {replyTarget && (
        <MessageReplyPreview
          replyTarget={replyTarget}
          replyPreviewText={replyPreviewText ?? ""}
          onCancelReply={onCancelReply}
        />
      )}

      {/* Main Input Container Section */}
      <div className="flex items-end justify-between gap-1.5 sm:gap-2">
        {/* Hidden File Input Section */}
        <input
          ref={fileInputRef}
          type="file"
          accept={CHAT_ACCEPTED_MIME_TYPES}
          multiple
          className="hidden"
          onChange={handleFileSelect}
          aria-label="Attach files"
        />

        {/* Input Pill Section */}
        <div className="flex-1 rounded-2xl border border-border bg-muted/30 focus-within:border-primary/40 focus-within:bg-background transition-colors overflow-hidden">
          {/* Attachment Thumbnail Strip Section (inside the pill, above the textarea) */}
          {hasAnyFiles && (
            <MessageAttachmentStrip
              pendingFiles={pendingFiles}
              atFileLimit={atFileLimit}
              inputDisabled={inputDisabled}
              isUploadingAny={isUploadingAny}
              readyCount={readyCount}
              errorCount={errorCount}
              onAddMoreFiles={openFilePicker}
              onClearAll={clearAllAttachments}
              onRemoveFile={removeFile}
            />
          )}

          {/* Input Row Section (voice recording ui or textarea + icons) */}
          {isRecording || isVoiceUploading ? (
            <VoiceRecordingUI
              durationSeconds={durationSeconds}
              isUploading={isVoiceUploading}
              onCancel={cancelRecording}
              onStop={handleVoiceRecordingStop}
            />
          ) : (
            <div className="flex items-end px-2.5 sm:px-3 py-1.5 sm:py-2 gap-0.5 sm:gap-1">
              {/* Textarea Section */}
              <textarea
                ref={textareaRef}
                placeholder={isDisabled ? "Loading..." : "Enter message..."}
                className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none border-none min-h-[30px] sm:min-h-[32px] max-h-[96px] sm:max-h-[120px] overflow-y-auto py-1 disabled:opacity-50"
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

              {/* Emoji Section */}
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
                  align="end"
                  sideOffset={8}
                  className="w-[min(92vw,340px)] max-h-[55vh] overflow-hidden p-0"
                >
                  <Picker
                    data={emojiData}
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    set="native"
                    dynamicWidth
                    previewPosition="none"
                    skinTonePosition="none"
                    searchPosition="top"
                    perLine={7}
                    onEmojiSelect={(emoji: { native?: string }) =>
                      insertEmoji(emoji?.native ?? "")
                    }
                  />
                </PopoverContent>
              </Popover>

              {/* Attachment Section */}
              <button
                type="button"
                disabled={inputDisabled || atFileLimit}
                onClick={openFilePicker}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label={
                  atFileLimit
                    ? `Maximum ${CHAT_MAX_FILES} files reached`
                    : "Attach files"
                }
                title={
                  atFileLimit
                    ? `Maximum ${CHAT_MAX_FILES} files reached`
                    : "Attach files"
                }
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Microphone Section (toggle recording on click) */}
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

        {/* Send Button Section (hidden while voice recording/uploading) */}
        {!isRecording && !isVoiceUploading && (
          <Button
            variant="default"
            onClick={handleSend}
            disabled={sendDisabled}
            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 font-medium"
            aria-label="Send message"
          >
            <LucideSendHorizonal className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
