import React, { useEffect, useRef } from "react";
import MessageTimeDivider from "./message-utils/message-time-divider";
import MessageBubble from "./message-bubble";
import { ChatTypingIndicator } from "./message-utils/typing-indicator";
import { parseMessageDate } from "@/utils/functions/date";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";
import { IChatMessagesProps } from "./props";
import { useTranslations } from "next-intl";
import { PageState } from "@/components/utils/feedback/page-state";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

/* --------------------------------- Helper --------------------------------- */
// Resolve last seen message index
function resolveLastSeenMessageIndex(messages: IMessage[]): number {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (messages[index].isMe && messages[index].isRead) return index;
  }

  return -1;
}

export const ChatMessages = (props: IChatMessagesProps) => {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

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
      messagesEndRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
    }
  }, [messages, isTyping, prefersReducedMotion]);

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
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/10 px-3 py-4 sm:px-4 md:px-5">
      {messages.length === 0 ? (
        /* Empty State Section */
        <PageState
          variant="empty"
          title={t("noMessagesTitle")}
          description={t("noMessages")}
          compact
          className="h-full min-h-0 shadow-none"
        />
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

          {/* Typing Indicator Section— shown below messages when partner is typing */}
          {isTyping && <ChatTypingIndicator activeChat={activeChat} />}
        </>
      )}
      {/* Invisible Sentinel Element Section — scroll target for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};
