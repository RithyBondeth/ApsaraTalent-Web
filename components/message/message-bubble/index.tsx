import { useChatStore } from "@/stores/features/chat/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { memo, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IMessageBubbleProps } from "./props";
import { formatMessageTime } from "@/utils/functions/date";
import {
  LucideCheck,
  LucideCheckCheck,
  LucideClock,
  LucidePhone,
  LucideX,
} from "lucide-react";
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
    return (
      <LucideClock className="inline-block h-3 w-3 text-muted-foreground/60" />
    );
  if (status === "seen")
    return <LucideCheckCheck className="inline-block h-3 w-3 text-green-500" />;
  return (
    <LucideCheck className="inline-block h-3 w-3 text-muted-foreground/60" />
  );
}

function MessageBubble(props: IMessageBubbleProps) {
  /* --------------------------------- Props --------------------------------- */
  const { message, activeChat, isLastSeen, onReply, onEdit } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");

  /* ----------------------------- API Integration ---------------------------- */
  const reactToMessage = useChatStore((state) => state.reactToMessage);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const initiateCall = useCallStore((s) => s.initiateCall);
  const currentUser = useGetCurrentUserStore((state) => state.user);

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
    if (userId === currentUser?.id) return t("you");
    return activeChat.name;
  };

  // ── Handle Message Actions ────────────────────────────────────────────
  const handleDelete = () => deleteMessage(message.id, activeChat.id);
  const handleReply = () => onReply?.(message);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`group mb-4 max-w-[88%] sm:max-w-[76%] md:max-w-[70%] ${
        message.isMe ? "ml-auto" : ""
      }`}
    >
      {/* Sender Label Section (Partner Message Only) */}
      {!message.isMe && (
        <div className="mb-1 flex items-center">
          <Avatar className="mr-2 h-6 w-6 rounded-none border border-border">
            {activeChat.isGroup ? (
              <AvatarFallback className="rounded-none">
                {message.senderId
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
                <AvatarFallback className="rounded-none">
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
            className={`rounded-none border text-sm shadow-hard-sm transition-all ${
              message.isMe
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground"
            } ${message.isDeleted ? "px-3 py-2 opacity-60" : "p-3"}`}
          >
            {/* Reply / Quote block Section */}
            {message.replyTo && !message.isDeleted && (
              <div
                className={`mb-2 rounded-none border-l-2 py-0.5 pl-2 text-xs opacity-80 ${
                  message.isMe
                    ? "border-primary-foreground/60 text-primary-foreground/80"
                    : "border-primary text-muted-foreground"
                }`}
              >
                <TypographyP className="mb-0.5 font-semibold leading-tight [&:not(:first-child)]:mt-0">
                  {message.replyTo.senderName}
                </TypographyP>
                <TypographyP className="line-clamp-2 leading-snug [&:not(:first-child)]:mt-0">
                  {message.replyTo.isDeleted
                    ? t("deletedMessage")
                    : (message.replyTo.content ?? "").slice(0, 80) +
                      ((message.replyTo.content ?? "").length > 80 ? "…" : "")}
                </TypographyP>
              </div>
            )}

            {/* Message Content Section */}
            {message.isDeleted ? (
              /* Deleted Message Section */
              <span className="text-xs italic text-muted-foreground">
                {t("deletedMessage")}
              </span>
            ) : message.messageType === "call" ? (
              /* Call Section */
              <div className="flex min-w-[150px] flex-col gap-2 sm:min-w-[180px]">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <LucidePhone className="h-4 w-4" />
                  <span>{message.content || t("callLabel")}</span>
                </div>
                <Button
                  variant={message.isMe ? "secondary" : "default"}
                  size="sm"
                  className="w-full rounded-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCallAgain();
                  }}
                >
                  {t("callAgain")}
                </Button>
              </div>
            ) : isEditing ? (
              /* Edit Message Section */
              <div className="flex min-w-[160px] flex-col gap-1.5 sm:min-w-[200px]">
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
                  className="max-h-[200px] min-h-[40px] resize-none rounded-none border-primary-foreground/30 bg-transparent px-2 py-1.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/50"
                  rows={1}
                />
                <div className="flex justify-end gap-1">
                  {/* Cancel Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-none text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    onClick={cancelEditing}
                    aria-label="Cancel edit"
                  >
                    <LucideX className="h-3.5 w-3.5" />
                  </Button>
                  {/* Confirm Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-none text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    onClick={confirmEdit}
                    aria-label="Confirm edit"
                  >
                    <LucideCheck className="h-3.5 w-3.5" />
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
                  <span className="ml-1 text-[10px] italic opacity-60">
                    {t("edited")}
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
          className={`mt-1 flex items-center gap-1 text-[10px] text-muted-foreground ${
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
        <div className="mt-0.5 flex items-center justify-end gap-1">
          <Avatar className="h-4 w-4 rounded-none">
            <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
            <AvatarFallback className="rounded-none text-[8px]">
              {activeChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground">{t("seen")}</span>
        </div>
      )}
    </div>
  );
}

export default memo(MessageBubble);
