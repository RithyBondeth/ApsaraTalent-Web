import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactionPicker } from "../message-utils/reaction-picker";
import { useChatStore } from "@/stores/chat.store";
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
  Pencil,
  Phone,
  Reply,
  Trash2,
  X,
} from "lucide-react";
import { AudioPlayer } from "./audio-player";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallStore } from "@/stores/call.store";
import { normalizeMediaUrl } from "@/utils/functions/normalize-media-url";

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
  const fullUrl = normalizeMediaUrl(url) || url;

  // ── Audio voice message ────────────────────────────────────────────────────
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
          <p
            className={`text-sm font-medium truncate leading-tight ${
              isMe ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {filename || "Document"}
          </p>
          {fileSize && (
            <p
              className={`text-xs mt-0.5 ${
                isMe ? "text-primary-foreground/60" : "text-muted-foreground"
              }`}
            >
              ({formatFileSize(fileSize)})
            </p>
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
  const { message, activeChat, isLastSeen, onReply, onEdit } = props;

  const { reactToMessage, deleteMessage } = useChatStore();
  const initiateCall = useCallStore((s) => s.initiateCall);
  const { user: currentUser } = useGetCurrentUserStore();

  // ── Inline edit state ─────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(message.content);
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [showDeliveryTime, setShowDeliveryTime] = useState<boolean>(false);

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

  const handleCallAgain = () => {
    initiateCall({
      userId: activeChat.id,
      name: activeChat.name,
      avatar: activeChat.avatar,
    });
  };

  // ── Reaction helpers ──────────────────────────────────────────────────────
  const handleReact = (emoji: string | null) => {
    reactToMessage(message.id, activeChat.id, emoji);
  };

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

  const emojiList = Object.keys(reactionsByEmoji);
  const totalReactionCount = Object.keys(message.reactions || {}).length;

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return "You";
    return activeChat.name;
  };

  const handleDelete = () => deleteMessage(message.id, activeChat.id);
  const handleReply = () => onReply?.(message);

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
        <div
          className="relative"
          onClick={() => setShowDeliveryTime(!showDeliveryTime)}
        >
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
                <p className="font-semibold leading-tight mb-0.5">
                  {message.replyTo.senderName}
                </p>
                <p className="leading-snug line-clamp-2">
                  {message.replyTo.isDeleted
                    ? "🚫 This message was deleted"
                    : (message.replyTo.content ?? "").slice(0, 80) +
                      ((message.replyTo.content ?? "").length > 80 ? "…" : "")}
                </p>
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

        {/* ── Action buttons (hover reveal) ───────────────────────────────── */}
        {!message.isDeleted && !isEditing && (
          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-0.5">
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

            <ReactionPicker
              onReact={handleReact}
              currentReaction={myReaction}
            />

            {message.isMe &&
              onEdit &&
              !message.attachment &&
              message.messageType !== "call" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={startEditing}
                aria-label="Edit message"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}

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

      {/* ── Timestamp + delivery state (click to show) ────────────────────── */}
      {(message.deliveryStatus === "sending" || showDeliveryTime) && (
        <div
          className={`flex items-center gap-1 text-[10px] text-muted-foreground mt-1 ${
            message.isMe ? "justify-end" : ""
          } ${totalReactionCount > 0 ? "mb-3" : ""}`}
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
