import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactionPicker } from "../message-utils/reaction-picker";
import { useChatStore } from "@/stores/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IMessageBubbleProps } from "./props";
import { formatMessageTime } from "../../../utils/date";
import { Check, CheckCheck, Clock, Reply, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── URL Detection ───────────────────────────────────────────────────────────
// Matches http/https URLs and bare www. addresses in text.
// Used to auto-linkify message content.
const URL_REGEX =
  /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;

/**
 * Splits `text` into segments of plain text and detected URLs.
 * Returns an array of React nodes so the bubble can render each part correctly.
 *
 * Example:
 *   "Check https://example.com out"
 *   → ["Check ", <a href="https://example.com">https://example.com</a>, " out"]
 */
function renderTextWithLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state (important when using global flag)
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;

    // Text before the URL
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    // Ensure the URL has a protocol for the href attribute
    const href = url.startsWith("www.") ? `https://${url}` : url;

    parts.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        // Underline links; ensure they break nicely in narrow bubbles
        className="underline underline-offset-2 break-all hover:opacity-80"
        onClick={(e) => e.stopPropagation()} // Prevent bubble click handlers
      >
        {url}
      </a>,
    );

    lastIndex = start + url.length;
  }

  // Any trailing text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ─── Delivery Status Icon ────────────────────────────────────────────────────
/**
 * Shows a small icon next to the timestamp for outgoing messages:
 *  ⏳ sending  — clock (optimistic, not yet ack'd)
 *  ✓  sent     — single grey check
 *  ✓✓ seen     — double blue check
 *
 * Incoming messages (isMe=false) never show a delivery icon.
 */
function DeliveryIcon({
  status,
}: {
  status: "sending" | "sent" | "seen" | undefined;
}) {
  if (!status) return null;

  if (status === "sending") {
    // Clock: message is in-flight (optimistic)
    return <Clock className="h-3 w-3 text-muted-foreground/60 inline-block" />;
  }
  if (status === "seen") {
    // Double-check in primary colour: partner has read it
    return <CheckCheck className="h-3 w-3 text-primary inline-block" />;
  }
  // Default: 'sent' — single grey check
  return <Check className="h-3 w-3 text-muted-foreground/60 inline-block" />;
}

export default function MessageBubble(props: IMessageBubbleProps) {
  const { message, activeChat, isLastSeen, onReply } = props;

  const { reactToMessage, deleteMessage } = useChatStore();
  const { user: currentUser } = useGetCurrentUserStore();

  // ── Reaction helpers ──────────────────────────────────────────────────────
  const handleReact = (emoji: string | null) => {
    reactToMessage(message.id, activeChat.id, emoji);
  };

  const myReaction = currentUser
    ? message.reactions?.[currentUser.id]
    : undefined;

  // Group user IDs by emoji for the reaction detail popover
  const reactionsByEmoji = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    Object.entries(message.reactions || {}).forEach(([userId, emoji]) => {
      if (!grouped[emoji]) grouped[emoji] = [];
      grouped[emoji].push(userId);
    });
    return grouped;
  }, [message.reactions]);

  const emojiList = Object.keys(reactionsByEmoji);
  const totalReactionCount = Object.keys(message.reactions || {}).length;

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return "You";
    return activeChat.name;
  };

  // ── Delete handler ────────────────────────────────────────────────────────
  // Only the sender can delete their own messages (enforced server-side too).
  const handleDelete = () => {
    deleteMessage(message.id, activeChat.id);
  };

  // ── Reply handler ─────────────────────────────────────────────────────────
  // Lift reply intent to the parent (ChatMessages → MessagePage → ChatInput)
  // so the input bar shows the quote preview.
  const handleReply = () => {
    onReply?.(message);
  };

  return (
    <div
      className={`mb-3 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] group ${
        message.isMe ? "ml-auto" : ""
      }`}
    >
      {/* ── Sender label (only in group chats or for partner messages) ──── */}
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
          <TypographyMuted>{activeChat.name}</TypographyMuted>
        </div>
      )}

      {/* ── Bubble row: bubble + action buttons ───────────────────────── */}
      <div
        className={`flex items-center gap-2 ${
          message.isMe ? "flex-row-reverse" : ""
        }`}
      >
        {/* ── Bubble ──────────────────────────────────────────────────── */}
        <div className="relative">
          <div
            className={`rounded-2xl text-sm transition-all ${
              message.isMe
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-background text-foreground rounded-tl-none shadow-sm"
            } ${
              // Tombstone styling: lighter, italic
              message.isDeleted ? "px-3 py-2 opacity-60" : "p-3"
            }`}
          >
            {/* ── Reply / Quote block ──────────────────────────────────── */}
            {/* Shown above the message content when this message is a reply.
                The quote previews the first 80 chars of the original message.
                If the original was deleted, show a placeholder. */}
            {message.replyTo && !message.isDeleted && (
              <div
                className={`mb-2 pl-2 border-l-2 text-xs opacity-80 rounded-sm py-0.5 ${
                  message.isMe
                    ? "border-primary-foreground/60 text-primary-foreground/80"
                    : "border-primary text-muted-foreground"
                }`}
              >
                <p className="font-semibold leading-tight mb-0.5">
                  {message.replyTo.senderName}
                </p>
                <p className="leading-snug line-clamp-2">
                  {message.replyTo.isDeleted
                    ? "🚫 This message was deleted"
                    : message.replyTo.content.slice(0, 80) +
                      (message.replyTo.content.length > 80 ? "…" : "")}
                </p>
              </div>
            )}

            {/* ── Message content ──────────────────────────────────────── */}
            {message.isDeleted ? (
              // Tombstone — always shown for deleted messages
              <span className="italic text-muted-foreground text-xs">
                🚫 This message was deleted
              </span>
            ) : (
              // Normal content with auto-linked URLs
              <span className="whitespace-pre-wrap break-words">
                {renderTextWithLinks(message.content)}
              </span>
            )}
          </div>

          {/* ── Reaction display badge ───────────────────────────────── */}
          {/* Only shown when there are reactions (not for deleted messages) */}
          {totalReactionCount > 0 && !message.isDeleted && (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`absolute -bottom-2 flex gap-1 bg-background/80 backdrop-blur-sm border shadow-sm rounded-full px-1.5 py-0.5 z-10 cursor-pointer hover:bg-muted transition-colors ${
                    message.isMe ? "right-0" : "left-0"
                  }`}
                >
                  {Object.entries(reactionsByEmoji).map(([emoji, userIds]) => (
                    <div key={emoji} className="flex items-center gap-0.5">
                      <span className="text-xs leading-none">{emoji}</span>
                      {userIds.length > 1 && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {userIds.length}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 overflow-hidden" side="top">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b px-2 gap-2 overflow-x-auto no-scrollbar">
                    <TabsTrigger
                      value="all"
                      className="text-xs h-7 px-2 data-[state=active]:bg-background"
                    >
                      All {totalReactionCount}
                    </TabsTrigger>
                    {emojiList.map((emoji) => (
                      <TabsTrigger
                        key={emoji}
                        value={emoji}
                        className="text-xs h-7 px-2 data-[state=active]:bg-background"
                      >
                        {emoji} {reactionsByEmoji[emoji].length}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="max-h-48 overflow-y-auto p-2">
                    <TabsContent value="all" className="mt-0 outline-none">
                      <div className="space-y-2">
                        {Object.entries(message.reactions || {}).map(
                          ([userId, emoji]) => (
                            <div
                              key={userId}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  {userId === currentUser?.id ? (
                                    <>
                                      <AvatarImage
                                        src={
                                          currentUser?.employee?.avatar ||
                                          currentUser?.company?.avatar
                                        }
                                      />
                                      <AvatarFallback className="text-[10px]">
                                        ME
                                      </AvatarFallback>
                                    </>
                                  ) : (
                                    <>
                                      <AvatarImage src={activeChat.avatar} />
                                      <AvatarFallback className="text-[10px]">
                                        {activeChat.name[0]}
                                      </AvatarFallback>
                                    </>
                                  )}
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {getUserName(userId)}
                                </span>
                              </div>
                              <span className="text-lg">{emoji}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </TabsContent>
                    {emojiList.map((emoji) => (
                      <TabsContent
                        key={emoji}
                        value={emoji}
                        className="mt-0 outline-none"
                      >
                        <div className="space-y-2">
                          {reactionsByEmoji[emoji].map((userId) => (
                            <div
                              key={userId}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-6 w-6">
                                {userId === currentUser?.id ? (
                                  <>
                                    <AvatarImage
                                      src={
                                        currentUser?.employee?.avatar ||
                                        currentUser?.company?.avatar
                                      }
                                    />
                                    <AvatarFallback className="text-[10px]">
                                      ME
                                    </AvatarFallback>
                                  </>
                                ) : (
                                  <>
                                    <AvatarImage src={activeChat.avatar} />
                                    <AvatarFallback className="text-[10px]">
                                      {activeChat.name[0]}
                                    </AvatarFallback>
                                  </>
                                )}
                              </Avatar>
                              <span className="text-sm font-medium">
                                {getUserName(userId)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* ── Action buttons (hover/touch reveal) ─────────────────────── */}
        {/* Hidden by default; appear on hover via group-hover / focus-within.
            On deleted messages we hide actions entirely (nothing to react/delete). */}
        {!message.isDeleted && (
          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-0.5">
            {/* Reply button — available on all non-deleted messages */}
            {onReply && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={handleReply}
                aria-label="Reply to message"
              >
                <Reply className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Reaction picker — available on all non-deleted messages */}
            <ReactionPicker
              onReact={handleReact}
              currentReaction={myReaction}
            />

            {/* Delete button — only shown on the current user's own messages */}
            {message.isMe && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
                aria-label="Delete message"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Timestamp + delivery state ───────────────────────────────────── */}
      <div
        className={`flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5 ${
          message.isMe ? "justify-end" : ""
        }`}
      >
        {formatMessageTime(message.timestamp)}
        {/* Delivery icon only for outgoing (isMe) messages */}
        {message.isMe && (
          <DeliveryIcon status={message.deliveryStatus} />
        )}
      </div>

      {/* ── Legacy "Seen" indicator ───────────────────────────────────────── */}
      {/* Still shown for the last seen message (backward compat with isLastSeen prop).
          The deliveryStatus='seen' icon on the timestamp also shows ✓✓ so this
          provides a more prominent avatar-based confirmation at the bottom. */}
      {isLastSeen && (
        <div className="flex items-center justify-end gap-1 mt-1">
          <Avatar className="h-4 w-4">
            <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
            <AvatarFallback className="text-[8px]">
              {activeChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground">Seen</span>
        </div>
      )}
    </div>
  );
}
