import { useChatStore } from "@/stores/features/chat/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IMessageBubbleProps } from "./props";
import { formatMessageTime } from "@/utils/functions/date";
import { Check, CheckCheck, Clock, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubbleActions } from "./message-bubble-action";
import { Textarea } from "@/components/ui/textarea";
import { useCallStore } from "@/stores/features/call/call.store";
import { TypographyP } from "@/components/utils/typography/typography-p";
import renderTextWithLinks from "./message-bubble-utils/render-text-with-link";
import AttachmentRender from "./message-bubble-utils/attachment-renderer";
import ReactionSummary from "./message-bubble-utils/reaction-summary";

/* --------------------------------- Helper --------------------------------- */
function DeliveryStatusIcon({
  status,
}: {
  status: "sending" | "sent" | "seen" | undefined;
}) {
  if (!status) return null;
  if (status === "sending")
    return <Clock className="h-3 w-3 text-muted-foreground/60 inline-block" />;
  if (status === "seen")
    return <CheckCheck className="h-3 w-3 text-green-500 inline-block" />;
  return <Check className="h-3 w-3 text-muted-foreground/60 inline-block" />;
}

export default function MessageBubble(props: IMessageBubbleProps) {
  /* --------------------------------- Props --------------------------------- */
  const { message, activeChat, isLastSeen, onReply, onEdit } = props;

  /* ----------------------------- API Integration ---------------------------- */
  const { reactToMessage, deleteMessage } = useChatStore();
  const initiateCall = useCallStore((s) => s.initiateCall);
  const { user: currentUser } = useGetCurrentUserStore();

  /* -------------------------------- All States ------------------------------ */
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(message.content);
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showDeliveryTime, setShowDeliveryTime] = useState<boolean>(false);

  /* ---------------------------------- Utils --------------------------------- */
  const myReaction = currentUser
    ? message.reactions?.[currentUser.id]
    : undefined;

  const reactionsByEmoji = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    Object.entries(message.reactions || {}).forEach(([userId, emoji]) => {
      if (!grouped[emoji]) grouped[emoji] = [];
      grouped[emoji].push(userId);
    });
    return grouped;
  }, [message.reactions]);

  const reactionEntries = Object.entries(message.reactions || {});
  const emojiList = Object.keys(reactionsByEmoji);
  const totalReactionCount = reactionEntries.length;
  const isMyMessage = Boolean(message.isMe);
  const showReactionBadge = totalReactionCount > 0 && !message.isDeleted;
  const canEditMessage =
    isMyMessage &&
    Boolean(onEdit) &&
    !message.attachment &&
    message.messageType !== "call";
  const canShowActionButtons = !message.isDeleted && !isEditing;
  const canReply = Boolean(onReply);
  const canDelete = isMyMessage;
  const currentUserAvatar =
    currentUser?.employee?.avatar || currentUser?.company?.avatar;

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Inline Editing ─────────────────────────────────────────
  const startEditing = () => {
    setEditValue(message.content);
    setIsEditing(true);
    setTimeout(() => editTextareaRef.current?.focus(), 0);
  };

  const cancelEditing = () => setIsEditing(false);

  const confirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== message.content) {
      onEdit?.(message.id, trimmed);
    }
    setIsEditing(false);
  };

  // ── Handle Delivery Details ────────────────────────────────────────
  const toggleDeliveryTime = () => {
    setShowDeliveryTime((previousValue) => !previousValue);
  };

  // ── Handle Call Actions ────────────────────────────────────────────
  const handleCallAgain = () => {
    initiateCall({
      userId: activeChat.id,
      name: activeChat.name,
      avatar: activeChat.avatar,
    });
  };

  // ── Handle Message Reactions ─────────────────────────────────────────
  const handleReact = (emoji: string | null) => {
    reactToMessage(message.id, activeChat.id, emoji);
  };

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return "You";
    return activeChat.name;
  };

  // ── Handle Message Actions ────────────────────────────────────────────
  const handleDelete = () => deleteMessage(message.id, activeChat.id);
  const handleReply = () => onReply?.(message);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`mb-3 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] group ${
        message.isMe ? "ml-auto" : ""
      }`}
    >
      {/* Sender Label Section (Partner Message Only) */}
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

      {/* Bubble Row Section: Bubble + Action Buttons */}
      <div
        className={`flex items-center gap-2 ${
          message.isMe ? "flex-row-reverse" : ""
        }`}
      >
        {/* Message Bubble Section */}
        <div className="relative" onClick={toggleDeliveryTime}>
          <div
            className={`rounded-2xl text-sm transition-all ${
              message.isMe
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            } ${message.isDeleted ? "px-3 py-2 opacity-60" : "p-3"}`}
          >
            {/* Reply / Quote block Section */}
            {message.replyTo && !message.isDeleted && (
              <div
                className={`mb-2 pl-2 border-l-2 text-xs opacity-80 rounded-sm py-0.5 ${
                  message.isMe
                    ? "border-primary-foreground/60 text-primary-foreground/80"
                    : "border-primary text-muted-foreground"
                }`}
              >
                <TypographyP className="[&:not(:first-child)]:mt-0 font-semibold leading-tight mb-0.5">
                  {message.replyTo.senderName}
                </TypographyP>
                <TypographyP className="[&:not(:first-child)]:mt-0 leading-snug line-clamp-2">
                  {message.replyTo.isDeleted
                    ? "🚫 This message was deleted"
                    : (message.replyTo.content ?? "").slice(0, 80) +
                      ((message.replyTo.content ?? "").length > 80 ? "…" : "")}
                </TypographyP>
              </div>
            )}

            {/* Message Content Section */}
            {message.isDeleted ? (
              /* Deleted Message Section */
              <span className="italic text-muted-foreground text-xs">
                🚫 This message was deleted
              </span>
            ) : message.messageType === "call" ? (
              /* Call Section */
              <div className="flex flex-col gap-2 min-w-[150px] sm:min-w-[180px]">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  <span>{message.content || "Call"}</span>
                </div>
                <Button
                  variant={message.isMe ? "secondary" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCallAgain();
                  }}
                >
                  Call again
                </Button>
              </div>
            ) : isEditing ? (
              /* Edit Message Section */
              <div className="flex flex-col gap-1.5 min-w-[160px] sm:min-w-[200px]">
                <Textarea
                  ref={editTextareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      confirmEdit();
                    }
                    if (e.key === "Escape") cancelEditing();
                  }}
                  className="text-sm resize-none min-h-[40px] max-h-[200px] py-1.5 px-2
                    bg-transparent border-primary-foreground/30 text-primary-foreground
                    placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/50"
                  rows={1}
                />
                <div className="flex gap-1 justify-end">
                  {/* Cancel Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={cancelEditing}
                    aria-label="Cancel edit"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                  {/* Confirm Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={confirmEdit}
                    aria-label="Confirm edit"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Message Content Section */}
                {message.content && (
                  <span className="whitespace-pre-wrap break-words">
                    {renderTextWithLinks(message.content)}
                  </span>
                )}

                {/* Attachment Section */}
                {message.attachment && (
                  <AttachmentRender
                    url={message.attachment}
                    type={message.attachmentType ?? "document"}
                    filename={message.attachmentFilename}
                    isMe={message.isMe}
                    duration={message.attachmentDuration}
                    amplitude={message.attachmentAmplitude}
                  />
                )}

                {/* Edited Message Section */}
                {message.isEdited && (
                  <span className="text-[10px] opacity-60 ml-1 italic">
                    (edited)
                  </span>
                )}
              </>
            )}
          </div>

          {/* Reaction Display Badge Section */}
          <ReactionSummary
            isVisible={showReactionBadge}
            isMe={isMyMessage}
            totalReactionCount={totalReactionCount}
            emojiList={emojiList}
            reactionsByEmoji={reactionsByEmoji}
            reactionEntries={reactionEntries}
            currentUserId={currentUser?.id}
            currentUserAvatar={currentUserAvatar}
            activeChatAvatar={activeChat.avatar}
            activeChatName={activeChat.name}
            getUserName={getUserName}
          />
        </div>

        {/* Action Buttons Section (Hover Reveal) */}
        <MessageBubbleActions
          isVisible={canShowActionButtons}
          canReply={canReply}
          canEdit={Boolean(canEditMessage)}
          canDelete={Boolean(canDelete)}
          currentReaction={myReaction}
          onReply={handleReply}
          onReact={handleReact}
          onEdit={startEditing}
          onDelete={handleDelete}
        />
      </div>

      {/* Timestamp + Delivery State Section (Click to Show) */}
      {(message.deliveryStatus === "sending" || showDeliveryTime) && (
        <div
          className={`flex items-center gap-1 text-[10px] text-muted-foreground mt-1 ${
            message.isMe ? "justify-end" : ""
          } ${showReactionBadge ? "mb-3" : ""}`}
        >
          {formatMessageTime(message.timestamp)}
          {message.isMe && (
            <DeliveryStatusIcon status={message.deliveryStatus} />
          )}
        </div>
      )}

      {/* "Seen" Avatar Indicator (Last Read Message) Section */}
      {isLastSeen && (
        <div className="flex items-center justify-end gap-1 mt-0.5">
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
