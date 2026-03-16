import React, { useEffect, useRef } from "react";
import { IChatMessagesProps, IMessage } from "./props";
import MessageTimeDivider from "./message-utils/message-time-divider";
import MessageBubble from "./message-bubble";
import { ChatTypingIndicator } from "./message-utils/typing-indicator";
import { parseMessageDate } from "@/utils/date";

export const ChatMessages = ({
  messages,
  activeChat,
  isTyping,
}: IChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const shouldShowDivider = (
    currentMsg: IMessage,
    prevMsg: IMessage | null,
  ) => {
    if (!prevMsg) return true;

    const currentDate = parseMessageDate(currentMsg.timestamp).toDateString();
    const prevDate = parseMessageDate(prevMsg.timestamp).toDateString();

    return currentDate !== prevDate;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            No messages yet. Start a conversation!
          </p>
        </div>
      ) : (
        <>
          {(() => {
            // Find the index of the last message that is mine and has been seen
            let lastSeenIdx = -1;
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].isMe && messages[i].isRead) {
                lastSeenIdx = i;
                break;
              }
            }
            return messages.map((message, idx) => {
              const prevMessage = idx > 0 ? messages[idx - 1] : null;
              const showDivider = shouldShowDivider(message, prevMessage);

              return (
                <React.Fragment key={message.id}>
                  {showDivider && (
                    <MessageTimeDivider timestamp={message.timestamp} />
                  )}
                  <MessageBubble
                    message={message}
                    activeChat={activeChat}
                    isLastSeen={idx === lastSeenIdx}
                  />
                </React.Fragment>
              );
            });
          })()}

          {/* Typing indicator */}
          {isTyping && <ChatTypingIndicator activeChat={activeChat} />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
