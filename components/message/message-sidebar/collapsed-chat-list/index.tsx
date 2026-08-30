import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LucideUsers } from "lucide-react";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IChatListProps } from "../props";
import { getNameInitials } from "@/utils/functions/text";

export default function CollapsedChatList(props: IChatListProps) {
  /* --------------------------------- Props --------------------------------- */
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-center gap-1 px-1 pt-2">
      {/* Chats List Section */}
      {chats?.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        const isActive = activeChat?.id === chat.id;

        return (
          <TooltipProvider key={chat.id} delayDuration={200}>
            <Tooltip>
              {/* Chat Tooltip Trigger Section */}
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "relative flex w-full justify-center rounded-none border-l-[3px] p-1.5 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "border-l-primary bg-primary/5"
                      : "border-l-transparent hover:bg-muted/60 active:bg-muted",
                  )}
                  onClick={() => onChatSelect(chat)}
                  aria-label={chat.name}
                >
                  {chat.isGroup ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-none border border-border bg-muted">
                      <LucideUsers className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : (
                    /* Avatar Section */
                    <Avatar className="h-10 w-10 rounded-none border border-border">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="rounded-none text-xs font-medium">
                        {getNameInitials(chat.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Unread Badge Section */}
                  {chat.unread ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-none bg-primary px-0.5 text-[9px] font-semibold text-primary-foreground">
                      {chat.unread > 9 ? "9+" : chat.unread}
                    </span>
                  ) : isUnread ? (
                    <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                  ) : null}

                  {/* Online Dot Section */}
                  {chat.isOnline && (
                    <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                  )}
                </button>
              </TooltipTrigger>

              {/* Chat Tooltip Content Section */}
              <TooltipContent side="right" className="max-w-[180px]">
                <TypographyP
                  className={cn(
                    "[&:not(:first-child)]:mt-0",
                    cn("font-medium", isUnread && "font-semibold"),
                  )}
                >
                  {/* Chat Name Section */}
                  {chat.name}
                  {chat.isOnline && (
                    <span className="ml-1.5 text-xs text-green-500">●</span>
                  )}
                </TypographyP>
                {/* Chat Tag Section */}
                {chat.tag && (
                  <TypographyMuted className="text-xs text-muted-foreground">
                    {chat.tag}
                  </TypographyMuted>
                )}
                {/* Chat Preview Section */}
                {chat.preview && (
                  <TypographyMuted className="truncate text-xs text-muted-foreground">
                    {chat.preview}
                  </TypographyMuted>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
