import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IChatListProps } from "../props";

export default function CollapsedChatList(props: IChatListProps) {
  /* --------------------------------- Props --------------------------------- */
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-center gap-1 pt-2 px-1">
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
                    "relative p-1.5 rounded-xl transition-all w-full flex justify-center",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-muted" : "hover:bg-muted/60 active:bg-muted",
                  )}
                  onClick={() => onChatSelect(chat)}
                  aria-label={chat.name}
                >
                  {chat.isGroup ? (
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center border border-border">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : (
                    /* Avatar Section */
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="text-xs font-medium">
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Unread Badge Section */}
                  {chat.unread ? (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-green-500 text-white text-[9px] font-semibold flex items-center justify-center">
                      {chat.unread > 9 ? "9+" : chat.unread}
                    </span>
                  ) : isUnread ? (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                  ) : null}

                  {/* Online Dot Section */}
                  {chat.isOnline && (
                    <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
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
                    <span className="ml-1.5 text-green-500 text-xs">●</span>
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
                  <TypographyMuted className="text-xs text-muted-foreground truncate">
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
