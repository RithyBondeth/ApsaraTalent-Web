import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Users } from "lucide-react";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IChatListProps } from "../props";
import { useTranslations } from "next-intl";
import { messageSvg } from "@/utils/constants/asset.constant";
import { getNameInitials } from "@/utils/functions/text";
import { PageState } from "@/components/utils/feedback/page-state";

export default function ExpandedChatList(props: IChatListProps) {
  /* --------------------------------- Props --------------------------------- */
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  /* ---------------------------------- Utils -------------------------------- */
  const t = useTranslations("message");

  /* ------------------------------ Empty State ------------------------------ */
  if (!chats || chats.length === 0)
    return (
      <PageState
        variant="empty"
        title={t("noConversations")}
        description={t("noConversationsDescription")}
        image={messageSvg}
        compact
        className="m-3 w-auto shadow-none"
        action={{ label: t("discoverMatches"), href: "/matching" }}
      />
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div>
      {/* Chats List Section */}
      {chats.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        const isActive = activeChat?.id === chat.id;

        return (
          <button
            key={chat.id}
            className={cn(
              "w-full flex items-center gap-3 px-3 md:px-4 py-3 text-left transition-colors border-b border-border border-l-[4px]",
              "hover:bg-muted/40 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive
                ? "bg-primary/5 border-l-primary"
                : "border-l-transparent",
            )}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar + Online Dot Section */}
            <div className="relative shrink-0">
              {chat.isGroup ? (
                <div className="h-11 w-11 md:h-12 md:w-12 bg-muted rounded-none flex items-center justify-center border border-border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="h-11 w-11 md:h-12 md:w-12 rounded-none border border-border">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className="text-sm font-medium rounded-none">
                    {getNameInitials(chat.name)}
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
                  {chat.preview || t("noMessagesPreview")}
                </TypographyMuted>

                {/* Unread Count Badge Section */}
                {chat.unread ? (
                  <span className="shrink-0 h-5 min-w-5 px-1 rounded-none bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center leading-none">
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
