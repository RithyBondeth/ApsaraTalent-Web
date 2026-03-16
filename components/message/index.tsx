import React, { useEffect, useRef } from "react";
import { IChatMessagesProps, IMessage } from "./props";
import MessageTimeDivider from "./message-utils/message-time-divider";
import MessageBubble from "./message-bubble";
import { ChatTypingIndicator } from "./message-utils/typing-indicator";
import { parseMessageDate } from "@/utils/date";

/**
 * Extends the base IChatMessagesProps with:
 *  - onReply: callback the parent uses to capture which message is being replied to
 *  - onEdit:  callback the parent uses to save an inline edit (messageId, newContent)
 */
interface ChatMessagesProps extends IChatMessagesProps {
  onReply?: (message: IMessage) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}

export const ChatMessages = ({
  messages,
  activeChat,
  isTyping,
  onReply,
  onEdit,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages change or typing indicator toggles
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /**
   * Returns true when the current message starts a new calendar day compared
   * to the previous message. Used to show the date divider ("Today", "Mon 12 Jan").
   */
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
    <div className="flex-1 px-3 py-4 md:px-4 overflow-y-auto overscroll-contain bg-muted/20">
      {messages.length === 0 ? (
        /* Empty state */
        <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">No messages yet. Say hello! 👋</p>
        </div>
      ) : (
        <>
          {(() => {
            // Find the index of the last outgoing message that has been read.
            // We only show the "Seen" avatar indicator on the very last seen message
            // to avoid cluttering the chat with multiple "Seen" indicators.
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
                    onReply={onReply} // Pass reply handler so each bubble can trigger it
                    onEdit={onEdit}   // Pass edit handler so each bubble can confirm edits
                  />
                </React.Fragment>
              );
            });
          })()}

          {/* Typing indicator — shown below messages when partner is typing */}
          {isTyping && <ChatTypingIndicator activeChat={activeChat} />}
        </>
      )}
      {/* Invisible sentinel element — scroll target for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};
