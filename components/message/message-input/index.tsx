import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, SmilePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IChatInputProps } from "./props";
import { IMessage } from "../props";
import { CHAT_TYPING_DEBOUNCE_MS } from "@/utils/constants/app.constant";

/**
 * Chat input bar with optional reply/quote mode.
 *
 * Reply flow:
 *  1. User taps the Reply button on a MessageBubble.
 *  2. MessageBubble fires onReply(message) → MessagePage stores replyTarget.
 *  3. MessagePage passes replyTarget + onCancelReply down to this component.
 *  4. This component shows a dismissible quote preview bar above the textarea.
 *  5. User types → sends → onSendMessage(content, replyTo) is called.
 *  6. The store's sendMessage() attaches replyTo to the optimistic message
 *     and passes replyToId to the socket so the DB stores the reference.
 *  7. After a successful send, onCancelReply() is called to reset the target.
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
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clean up typing timer on unmount to avoid memory leaks
  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    },
    [],
  );

  // Auto-resize textarea height as user types (max ~5 lines / 120px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [newMessage]);

  // When a reply target is set, focus the textarea so the user can type immediately
  useEffect(() => {
    if (replyTarget) {
      textareaRef.current?.focus();
    }
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

  const handleSend = async () => {
    if (newMessage.trim() === "" || isSending || isDisabled) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTyping?.(false);

    // Build the IMessage["replyTo"] preview object from the replyTarget.
    // We only send a slim preview (id, content snippet, senderName) — not the
    // full IMessage — because the store and socket only need these fields.
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
      await onSendMessage(newMessage.trim(), replyTo);
      setNewMessage("");
      // Reset textarea height after clearing content
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      // Dismiss the reply preview after send — the quote has been attached
      if (replyTarget) onCancelReply?.();
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const inputDisabled = isSending || isDisabled;
  const sendDisabled = inputDisabled || !newMessage.trim();

  return (
    <div className="border-t bg-background shrink-0">
      {/* ── Reply preview bar ──────────────────────────────────────────────
          Shown when the user has tapped Reply on a bubble.
          Layout:  | [left border]  ↩ Replying to [Name]  [preview]  [✕]
          The left border uses border-primary to visually match the quote
          block inside the bubble itself. */}
      {replyTarget && (
        <div className="px-3 md:px-4 pt-2 pb-0 flex items-start gap-2">
          <div className="flex-1 border-l-2 border-primary pl-2 pr-1 py-0.5 rounded-sm bg-muted/30">
            <p className="text-xs font-semibold text-primary leading-tight">
              {/* Show "You" for own messages, partner name otherwise */}
              {replyTarget.isMe
                ? "You"
                : replyTarget.senderName || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground leading-snug truncate">
              {replyTarget.isDeleted
                ? "🚫 This message was deleted"
                : (replyTarget.content ?? "").slice(0, 100) +
                  ((replyTarget.content ?? "").length > 100 ? "…" : "")}
            </p>
          </div>
          {/* ✕ dismiss button — calls onCancelReply so the parent clears replyTarget */}
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

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div className="px-3 py-3 md:px-4 flex items-end gap-2">
        {/* Attachment button — placeholder (no file upload implemented yet) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          disabled={inputDisabled}
          aria-label="Attach file"
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
              // Enter sends on desktop; Shift+Enter always inserts a newline
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
