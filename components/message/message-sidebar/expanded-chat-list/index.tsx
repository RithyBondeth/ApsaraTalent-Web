import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, LucideMessagesSquare, Users } from "lucide-react";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IChatListProps } from "../props";
import { useTranslations } from "next-intl";
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
        icon={LucideMessagesSquare}
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
              "flex w-full items-center gap-3 border-b border-l-[4px] border-border px-3 py-3 text-left transition-colors md:px-4",
              "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-muted",
              isActive
                ? "border-l-primary bg-primary/5"
                : "border-l-transparent",
            )}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar + Online Dot Section */}
            <div className="relative shrink-0">
              {chat.isGroup ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-none border border-border bg-muted md:h-12 md:w-12">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="h-11 w-11 rounded-none border border-border md:h-12 md:w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className="rounded-none text-sm font-medium">
                    {getNameInitials(chat.name)}
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Online Status Dot Section */}
              {chat.isOnline && (
                <span className="absolute bottom-0.5 left-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
              )}
            </div>

            {/* Text Content Section */}
            <div className="min-w-0 flex-1">
              {/* Name and Time Section */}
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "truncate text-sm",
                    isUnread
                      ? "font-bold text-foreground"
                      : "font-semibold text-foreground",
                  )}
                >
                  {chat.name}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
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
                    "flex-1 truncate text-sm",
                    isUnread
                      ? "font-medium text-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {chat.preview || t("noMessagesPreview")}
                </TypographyMuted>

                {/* Unread Count Badge Section */}
                {chat.unread ? (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-none bg-primary px-1 text-[11px] font-semibold leading-none text-primary-foreground">
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
