import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IChatInputProps } from "./props";
import { CHAT_TYPING_DEBOUNCE_MS } from "@/utils/constants/app.constant";

export default function ChatInput(props: IChatInputProps) {
  const { onSendMessage, onTyping, isDisabled = false } = props;

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    },
    [],
  );

  const handleInputChange = (value: string) => {
    setNewMessage(value);

    if (!onTyping) return;

    if (value.trim()) {
      // Notify "is typing" immediately
      onTyping(true);

      // Reset the debounce timer — fires "stopped typing" after 1.5s of no keystrokes
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(
        () => onTyping(false),
        CHAT_TYPING_DEBOUNCE_MS,
      );
    } else {
      // Input cleared — stop typing immediately
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping(false);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim() === "" || isSending || isDisabled) return;

    // Cancel typing indicator immediately on send
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTyping?.(false);

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const inputDisabled = isSending || isDisabled;
  const sendDisabled = inputDisabled || !newMessage.trim();

  return (
    <div className="p-4 border-t flex items-center gap-2">
      <Button variant="ghost" size="icon" disabled={inputDisabled}>
        <Paperclip className="h-5 w-5" />
      </Button>

      <div className="flex-1 relative flex items-center">
        <Input
          type="text"
          placeholder={isDisabled ? "Loading..." : "Type your message..."}
          className="pr-10"
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
          className="absolute right-2"
          disabled={inputDisabled}
        >
          <SmilePlus className="h-5 w-5" />
        </Button>
      </div>

      <Button size="icon" onClick={handleSend} disabled={sendDisabled}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
