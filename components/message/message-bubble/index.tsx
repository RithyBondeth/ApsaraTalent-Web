import { useChatStore } from "@/stores/features/chat/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IMessageBubbleProps } from "./props";
import { formatMessageTime } from "../../../utils/date";
import {
  Check,
  CheckCheck,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Phone,
  X,
} from "lucide-react";
import { AudioPlayer } from "./audio-player";
import { Button } from "@/components/ui/button";
import { MessageBubbleActions } from "./message-actions";
import { MessageReactionSummary } from "./reaction-summary";
import { Textarea } from "@/components/ui/textarea";
import { useCallStore } from "@/stores/features/call/call.store";
import { normalizeMediaUrl } from "@/utils/functions/normalize-media-url";
import { TypographyP } from "@/components/utils/typography/typography-p";

// ─── URL Detection ───────────────────────────────────────────────────────────
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;

function renderTextWithLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    const href = url.startsWith("www.") ? `https://${url}` : url;
    parts.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 break-all hover:opacity-80"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>,
    );
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

// ─── Delivery Status Icon ────────────────────────────────────────────────────
function DeliveryIcon({
  status,
}: {
  status: "sending" | "sent" | "seen" | undefined;
}) {
  if (!status) return null;
  /* -------------------------------- Render UI -------------------------------- */
  if (status === "sending")
    return <Clock className="h-3 w-3 text-muted-foreground/60 inline-block" />;
  if (status === "seen")
    return <CheckCheck className="h-3 w-3 text-green-500 inline-block" />;
  return <Check className="h-3 w-3 text-muted-foreground/60 inline-block" />;
}

// ─── Format file size ────────────────────────────────────────────────────────
function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Attachment Renderer ─────────────────────────────────────────────────────
/**
 * Renders the file attached to a message.
 *
 * Image    → inline <img> preview with click-to-open.
 * Document → rich card matching shadcnuikit:
 *            [icon] filename (size)
 *            [ Download ]  [ Preview ]
 */
function AttachmentBlock({
  url,
  type,
  filename,
  fileSize,
  isMe,
  duration,
  amplitude,
}: {
  url: string;
  type: "image" | "document" | "audio";
  filename?: string;
  fileSize?: number;
  isMe?: boolean;
  duration?: number;
  amplitude?: number[];
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const fullUrl = normalizeMediaUrl(url) || url;

  // ── Audio voice message ────────────────────────────────────────────────────
  /* -------------------------------- Render UI -------------------------------- */
  if (type === "audio") {
    return (
      <AudioPlayer
        url={fullUrl}
        duration={duration}
        amplitude={amplitude}
        isMe={isMe}
      />
    );
  }

  if (type === "image") {
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-1"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullUrl}
          alt={filename || "Image attachment"}
          className="max-w-full rounded-xl max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
        />
      </a>
    );
  }

  // ── Document card (shadcnuikit style) ─────────────────────────────────────
  return (
    <div
      className={`mt-2 rounded-2xl border overflow-hidden ${
        isMe
          ? "border-primary-foreground/20 bg-primary-foreground/10"
          : "border-border bg-background"
      }`}
    >
      {/* File info row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <FileText
          className={`h-8 w-8 shrink-0 ${
            isMe ? "text-primary-foreground/70" : "text-muted-foreground/60"
          }`}
        />
        <div className="min-w-0">
          <TypographyP
            className={`[&:not(:first-child)]:mt-0 text-sm font-medium truncate leading-tight ${
              isMe ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {filename || "Document"}
          </TypographyP>
          {fileSize && (
            <TypographyMuted
              className={`text-xs mt-0.5 ${
                isMe ? "text-primary-foreground/60" : "text-muted-foreground"
              }`}
            >
              ({formatFileSize(fileSize)})
            </TypographyMuted>
          )}
        </div>
      </div>

      {/* Action buttons row */}
      <div className={`flex gap-2 px-4 pb-3`}>
        <a
          href={fullUrl}
          download={filename}
          className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isMe
              ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              : "border-border text-foreground hover:bg-muted"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-3 w-3" />
          Download
        </a>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isMe
              ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              : "border-border text-foreground hover:bg-muted"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3" />
          Preview
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MessageBubble(props: IMessageBubbleProps) {
  /* --------------------------------- Props --------------------------------- */
  const { message, activeChat, isLastSeen, onReply, onEdit } = props;

  /* ----------------------------- API Integration ---------------------------- */
  const { reactToMessage, deleteMessage } = useChatStore();
  const initiateCall = useCallStore((s) => s.initiateCall);
  const { user: currentUser } = useGetCurrentUserStore();

  // ── Inline edit state ─────────────────────────────────────────────────────
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

  // ── Handle Delivery Details ─────────────────────────────────────────
  const toggleDeliveryTime = () => {
    setShowDeliveryTime((previousValue) => !previousValue);
  };

  // ── Handle Call Actions ─────────────────────────────────────────
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

  // ── Handle Message Actions ─────────────────────────────────────────
  const handleDelete = () => deleteMessage(message.id, activeChat.id);
  const handleReply = () => onReply?.(message);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`mb-3 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] group ${
        message.isMe ? "ml-auto" : ""
      }`}
    >
      {/* ── Sender label (partner messages only) ──────────────────────────── */}
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

      {/* ── Bubble row: bubble + action buttons ───────────────────────────── */}
      <div
        className={`flex items-center gap-2 ${
          message.isMe ? "flex-row-reverse" : ""
        }`}
      >
        {/* ── Bubble ────────────────────────────────────────────────────── */}
        <div className="relative" onClick={toggleDeliveryTime}>
          <div
            className={`rounded-2xl text-sm transition-all ${
              message.isMe
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            } ${message.isDeleted ? "px-3 py-2 opacity-60" : "p-3"}`}
          >
            {/* ── Reply / Quote block ──────────────────────────────────── */}
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

            {/* ── Message content ──────────────────────────────────────── */}
            {message.isDeleted ? (
              <span className="italic text-muted-foreground text-xs">
                🚫 This message was deleted
              </span>
            ) : message.messageType === "call" ? (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={cancelEditing}
                    aria-label="Cancel edit"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
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
                {message.content && (
                  <span className="whitespace-pre-wrap break-words">
                    {renderTextWithLinks(message.content)}
                  </span>
                )}

                {message.attachment && (
                  <AttachmentBlock
                    url={message.attachment}
                    type={message.attachmentType ?? "document"}
                    filename={message.attachmentFilename}
                    isMe={message.isMe}
                    duration={message.attachmentDuration}
                    amplitude={message.attachmentAmplitude}
                  />
                )}

                {message.isEdited && (
                  <span className="text-[10px] opacity-60 ml-1 italic">
                    (edited)
                  </span>
                )}
              </>
            )}
          </div>

          {/* ── Reaction display badge ──────────────────────────────────── */}
          <MessageReactionSummary
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

        {/* ── Action buttons (hover reveal) ───────────────────────────────── */}
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

      {/* ── Timestamp + delivery state (click to show) ────────────────────── */}
      {(message.deliveryStatus === "sending" || showDeliveryTime) && (
        <div
          className={`flex items-center gap-1 text-[10px] text-muted-foreground mt-1 ${
            message.isMe ? "justify-end" : ""
          } ${showReactionBadge ? "mb-3" : ""}`}
        >
          {formatMessageTime(message.timestamp)}
          {message.isMe && <DeliveryIcon status={message.deliveryStatus} />}
        </div>
      )}

      {/* ── "Seen" avatar indicator (last read message) ───────────────────── */}
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
