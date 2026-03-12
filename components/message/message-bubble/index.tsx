// src/components/message/ChatMessages.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef } from "react";
import { IChatPreview, IMessage } from "../props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

interface ChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
  isTyping?: boolean;
}

const ChatMessages = ({
  messages,
  activeChat,
  isTyping,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
          <div className="text-center text-xs text-muted-foreground mb-4">
            Today
          </div>

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              activeChat={activeChat}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator activeChat={activeChat} />}
        </>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

/* ─── Typing Indicator ─────────────────────────────────────────────────────── */

const TypingIndicator = ({ activeChat }: { activeChat: IChatPreview }) => (
  <div className="mb-4 flex items-end gap-2">
    <Avatar className="h-7 w-7">
      <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
      <AvatarFallback className="text-xs">
        {activeChat.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>

    <div className="flex flex-col items-start gap-1">
      <div className="bg-background text-foreground rounded-lg rounded-tl-none shadow-sm px-4 py-3 flex items-center gap-1">
        <style>{`
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .typing-dot { animation: typing-bounce 1.2s infinite ease-in-out; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
        <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
      </div>
      <TypographyMuted className="text-xs">
        {activeChat.name} is typing...
      </TypographyMuted>
    </div>
  </div>
);

interface MessageBubbleProps {
  message: IMessage;
  activeChat: IChatPreview;
}

const MessageBubble = ({ message, activeChat }: MessageBubbleProps) => (
  <div className={`mb-4 max-w-xs ${message.isMe ? "ml-auto" : ""}`}>
    {!message.isMe && (
      <div className="flex items-center mb-1">
        <Avatar className="h-6 w-6 mr-2">
          {activeChat.isGroup ? (
            <AvatarFallback>
              {message.senderId
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
              <AvatarFallback>
                {activeChat.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        {activeChat.isGroup && (
          <span className="text-xs font-medium text-foreground">
            {message.senderId}
          </span>
        )}
      </div>
    )}
    <div
      className={`p-3 rounded-lg ${
        message.isMe
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-background text-foreground rounded-tl-none shadow-sm"
      }`}
    >
      {message.content}
    </div>
    <div
      className={`text-xs text-muted-foreground mt-1 ${message.isMe ? "text-right" : ""}`}
    >
      {message.timestamp instanceof Date
        ? message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
    </div>
  </div>
);

export default ChatMessages;
