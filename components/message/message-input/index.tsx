import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IChatInputProps } from "./props";
import { CHAT_TYPING_DEBOUNCE_MS } from "@/utils/constants/app.constant";

export default function ChatInput(props: IChatInputProps) {
  const { onSendMessage, onTyping, isDisabled = false } = props;

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clean up timer on unmount
  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    },
    [],
  );

  // Auto-resize textarea height as user types (max ~5 lines)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [newMessage]);

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

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
      // Reset textarea height
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const inputDisabled = isSending || isDisabled;
  const sendDisabled = inputDisabled || !newMessage.trim();

  return (
    <div className="px-3 py-3 md:px-4 border-t bg-background flex items-end gap-2 shrink-0">
      {/* Attachment button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
        disabled={inputDisabled}
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {/* Input + emoji */}
      <div className="flex-1 relative flex items-end">
        <Textarea
          ref={textareaRef}
          placeholder={isDisabled ? "Loading..." : "Message…"}
          className="resize-none min-h-[40px] max-h-[120px] py-2 pr-10 text-sm leading-relaxed overflow-y-auto rounded-2xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
          rows={1}
          value={newMessage}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends on desktop; Shift+Enter = newline always
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
  );
}
