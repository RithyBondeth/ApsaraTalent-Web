"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Search, Users, X } from "lucide-react";
import { useState } from "react";
import { IChatListProps, IChatSidebarProps } from "./props";

export default function ChatSidebar(props: IChatSidebarProps) {
  const {
    chats,
    activeChat,
    className,
    isOpen,
    currentUserId,
    onChatSelect,
    onClose,
  } = props;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = searchQuery
    ? chats?.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.preview?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chats;

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden border-r",
        // Desktop: collapsible between w-80 and w-16
        // Mobile (when rendered as overlay): always full width
        isOpen ? "w-80" : "w-16",
        "md:w-auto", // let desktop control width via isOpen
        className,
      )}
      style={
        isOpen
          ? { minWidth: "var(--sidebar-open-width, 20rem)" }
          : { minWidth: "var(--sidebar-closed-width, 4rem)" }
      }
    >
      {/* ── HEADER ───────────────────────────────────────────────── */}
      {isOpen ? (
        <div className="px-4 py-3 border-b flex items-center justify-between shrink-0">
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Messages
          </h1>
          {/* Close button only shown in mobile overlay mode */}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="py-3 flex flex-col items-center border-b shrink-0">
          <Avatar className="size-9">
            <AvatarImage src="/avatars/me.jpg" alt="Your Profile" />
            <AvatarFallback className="text-xs">ME</AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* ── SEARCH ───────────────────────────────────────────────── */}
      {isOpen && (
        <div className="px-4 py-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search conversations…"
              className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── CHAT LIST ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {isOpen ? (
          <ExpandedChatList
            chats={filteredChats}
            activeChat={activeChat}
            currentUserId={currentUserId}
            onChatSelect={onChatSelect}
          />
        ) : (
          <CollapsedChatList
            chats={filteredChats}
            activeChat={activeChat}
            currentUserId={currentUserId}
            onChatSelect={onChatSelect}
          />
        )}
      </div>
    </div>
  );
}

// ── Expanded chat list ──────────────────────────────────────────────────────

const ExpandedChatList = (props: IChatListProps) => {
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  if (!chats || chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center h-40">
        <Users className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {chats.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        const isActive = activeChat?.id === chat.id;

        return (
          <button
            key={chat.id}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
              "hover:bg-muted/60 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive && "bg-muted/70",
              isUnread && !isActive && "bg-primary/5",
            )}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar + unread indicator */}
            <div className="relative shrink-0">
              {chat.isGroup ? (
                <div className="h-11 w-11 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <Avatar className="h-11 w-11">
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
              {/* Unread badge */}
              {chat.unread ? (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] flex items-center justify-center"
                >
                  {chat.unread > 99 ? "99+" : chat.unread}
                </Badge>
              ) : isUnread ? (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
              ) : null}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={cn(
                      "text-sm truncate",
                      isUnread
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground/90",
                    )}
                  >
                    {chat.name}
                  </span>
                  {chat.tag && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800 shrink-0"
                    >
                      {chat.tag}
                    </Badge>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] shrink-0 tabular-nums",
                    isUnread
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {chat.time}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {isLastFromMe && (
                  <span className="shrink-0 text-muted-foreground">
                    {chat.isRead ? (
                      <CheckCheck className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </span>
                )}
                <p
                  className={cn(
                    "text-xs truncate",
                    isUnread
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {chat.preview || "No messages yet"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ── Collapsed icon-only list (desktop only) ─────────────────────────────────

const CollapsedChatList = (props: IChatListProps) => {
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  return (
    <div className="flex flex-col items-center gap-1 pt-2 px-1">
      {chats?.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        const isActive = activeChat?.id === chat.id;

        return (
          <TooltipProvider key={chat.id} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "relative p-1.5 rounded-xl transition-all w-full flex justify-center",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-muted scale-105"
                      : "hover:bg-muted/60 active:bg-muted",
                  )}
                  onClick={() => onChatSelect(chat)}
                  aria-label={chat.name}
                >
                  {chat.isGroup ? (
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
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
                  {chat.unread ? (
                    <Badge
                      variant="default"
                      className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 text-[9px] flex items-center justify-center"
                    >
                      {chat.unread > 9 ? "9+" : chat.unread}
                    </Badge>
                  ) : isUnread ? (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                  ) : null}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[180px]">
                <p className={cn("font-medium", isUnread && "font-semibold")}>
                  {chat.name}
                </p>
                {chat.tag && (
                  <p className="text-xs text-muted-foreground">{chat.tag}</p>
                )}
                {chat.preview && (
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.preview}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
