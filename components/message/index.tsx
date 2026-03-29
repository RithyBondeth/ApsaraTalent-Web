import React, { useEffect, useRef } from "react";
import MessageTimeDivider from "./message-utils/message-time-divider";
import MessageBubble from "./message-bubble";
import { ChatTypingIndicator } from "./message-utils/typing-indicator";
import { parseMessageDate } from "@/utils/functions/date";
import { IMessage } from "@/utils/interfaces/chat";
import { IChatMessagesProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

/* --------------------------------- Helper --------------------------------- */
// Resolve last seen message index
function resolveLastSeenMessageIndex(messages: IMessage[]): number {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (messages[index].isMe && messages[index].isRead) return index;
  }

  return -1;
}

export const ChatMessages = (props: IChatMessagesProps) => {
  /* --------------------------------- Props --------------------------------- */
  const { messages, activeChat, isTyping, onReply, onEdit } = props;

  /* -------------------------------- All States ------------------------------ */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  /* ---------------------------------- Utils --------------------------------- */
  const lastSeenMessageIndex = resolveLastSeenMessageIndex(messages);

  // Auto-scroll to the bottom whenever messages change or typing indicator toggles.
  // Use "instant" on initial load (first paint of the full history) so the browser
  // jumps straight to the bottom before the user sees anything — avoids the flash
  // of the top of a long conversation.
  // Use "smooth" only for incremental new messages (count goes up by 1-2) so the
  // scroll animation feels natural during live chat.
  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    const prevCount = prevMessageCountRef.current;
    const currentCount = messages.length;
    prevMessageCountRef.current = currentCount;

    if (!messagesEndRef.current) return;

    // Initial load or history fetch: jump instantly to bottom
    const isInitialLoad = prevCount === 0 && currentCount > 0;
    // New message(s) arriving during active chat: smooth scroll
    const isNewMessage = prevCount > 0 && currentCount > prevCount;

    if (isInitialLoad) {
      // Defer one tick so the browser finishes painting all messages before
      // we scroll — otherwise the container height may not be final yet and
      // the scroll lands in the wrong position on long histories.
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      }, 0);
    } else if (isNewMessage || isTyping) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Resolve Date Divider Visibility ─────────────────────────────────────────
  const shouldShowDivider = (
    currentMsg: IMessage,
    prevMsg: IMessage | null,
  ) => {
    if (!prevMsg) return true;

    const currentDate = parseMessageDate(currentMsg.timestamp).toDateString();
    const prevDate = parseMessageDate(prevMsg.timestamp).toDateString();

    return currentDate !== prevDate;
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-muted/20 px-2.5 py-3 sm:px-3 sm:py-4 md:px-4">
      {messages.length === 0 ? (
        /* Empty State Section */
        <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <TypographyMuted className="text-sm text-muted-foreground">
            No messages yet. Say hello! 👋
          </TypographyMuted>
        </div>
      ) : (
        /* Messages Section */
        <>
          {messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const showDivider = shouldShowDivider(message, previousMessage);

            return (
              <React.Fragment key={message.id}>
                {showDivider && (
                  <MessageTimeDivider timestamp={message.timestamp} />
                )}
                <MessageBubble
                  message={message}
                  activeChat={activeChat}
                  isLastSeen={index === lastSeenMessageIndex}
                  onReply={onReply}
                  onEdit={onEdit}
                />
              </React.Fragment>
            );
          })}

          {/* Typing indicator — shown below messages when partner is typing */}
          {isTyping && <ChatTypingIndicator activeChat={activeChat} />}
        </>
      )}
      {/* Invisible sentinel element — scroll target for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};
