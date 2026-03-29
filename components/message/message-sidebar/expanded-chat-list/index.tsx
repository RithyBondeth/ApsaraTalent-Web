import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Users } from "lucide-react";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IChatListProps } from "../props";

export default function ExpandedChatList(props: IChatListProps) {
  /* --------------------------------- Props --------------------------------- */
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  /* ------------------------------ Empty State ------------------------------ */
  if (!chats || chats.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center h-40">
        <Users className="h-8 w-8 text-muted-foreground/40" />
        <TypographyMuted className="text-sm text-muted-foreground">
          No conversations yet
        </TypographyMuted>
      </div>
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="py-1">
      {/* Chats List Section */}
      {chats.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        const isActive = activeChat?.id === chat.id;

        return (
          <button
            key={chat.id}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 text-left transition-colors",
              "hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive && "bg-muted/60",
            )}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar + Online Dot Section */}
            <div className="relative shrink-0">
              {chat.isGroup ? (
                <div className="h-11 w-11 md:h-12 md:w-12 bg-muted rounded-full flex items-center justify-center border border-border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="h-11 w-11 md:h-12 md:w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className="text-sm font-medium">
                    {chat.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Online Status Dot Section */}
              {chat.isOnline && (
                <span className="absolute bottom-0.5 left-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* Text Content Section */}
            <div className="flex-1 min-w-0">
              {/* Name and Time Section */}
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span
                  className={cn(
                    "text-sm truncate",
                    isUnread
                      ? "font-bold text-foreground"
                      : "font-semibold text-foreground",
                  )}
                >
                  {chat.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                  {chat.time}
                </span>
              </div>

              {/* Delivery Tick, Preview and Unread Badge Section */}
              <div className="flex items-center gap-1">
                {/* Delivery Tick Section */}
                {isLastFromMe && (
                  <span className="shrink-0">
                    {chat.isRead ? (
                      <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </span>
                )}

                {/* Preview Text Section */}
                <TypographyMuted
                  className={cn(
                    "text-sm truncate flex-1",
                    isUnread
                      ? "text-foreground/80 font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {chat.preview || "No messages yet"}
                </TypographyMuted>

                {/* Unread Count Badge Section */}
                {chat.unread ? (
                  <span className="shrink-0 h-5 min-w-5 px-1 rounded-full bg-green-500 text-white text-[11px] font-semibold flex items-center justify-center leading-none">
                    {chat.unread > 99 ? "99+" : chat.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
