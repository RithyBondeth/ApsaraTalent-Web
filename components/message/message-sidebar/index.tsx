"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Plus, Search, Users, X } from "lucide-react";
import { useState } from "react";
import { IChatListProps, IChatSidebarProps } from "./props";

/**
 * Chat sidebar — conversation list with search and "New Chat" button.
 *
 * Redesigned to match the shadcnuikit reference:
 *   - "Chats" heading + circle `+` button
 *   - Full-width rounded search bar ("Chats search...")
 *   - Chat rows: large avatar, bold name, time top-right, ✓/✓✓ + preview second line
 *   - Green unread count badge (right side), online dot bottom-left of avatar
 *   - Active row: subtle muted background fill
 *   - Collapsed mode: icon-only strip with tooltips
 */
export default function ChatSidebar(props: IChatSidebarProps) {
  const {
    chats,
    activeChat,
    className,
    isOpen,
    isResizable,
    currentUserId,
    onChatSelect,
    onClose,
    onNewChat,
  } = props;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = searchQuery
    ? chats?.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.preview?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chats;

  const widthClass = isResizable ? "w-full" : isOpen ? "w-80" : "w-16";
  const minWidthStyle = isResizable
    ? undefined
    : isOpen
      ? { minWidth: "var(--sidebar-open-width, 20rem)" }
      : { minWidth: "var(--sidebar-closed-width, 4rem)" };

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden border-r bg-background",
        widthClass,
        !isResizable && "md:w-auto",
        className,
      )}
      style={minWidthStyle}
    >
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      {isOpen ? (
        <div className="px-4 pt-5 pb-3 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Chats
          </h1>
          <div className="flex items-center gap-1">
            {onNewChat && (
              <button
                onClick={onNewChat}
                aria-label="New conversation"
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
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
        </div>
      ) : (
        /* Collapsed header */
        <div className="py-4 flex flex-col items-center shrink-0">
          {onNewChat && (
            <button
              onClick={onNewChat}
              aria-label="New conversation"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* ── SEARCH (expanded mode only) ──────────────────────────────────── */}
      {isOpen && (
        <div className="px-4 pb-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Chats search..."
              className="pl-9 h-10 rounded-full bg-muted/40 border-muted focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── CHAT LIST ─────────────────────────────────────────────────────── */}
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

// ── Expanded chat list ────────────────────────────────────────────────────────

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
    <div className="py-1">
      {chats.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        const isActive = activeChat?.id === chat.id;

        return (
          <button
            key={chat.id}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
              "hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive && "bg-muted/60",
            )}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar + online dot */}
            <div className="relative shrink-0">
              {chat.isGroup ? (
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center border border-border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="h-12 w-12">
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

              {/* Online status dot — bottom-left of avatar */}
              {chat.isOnline && (
                <span className="absolute bottom-0.5 left-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              {/* Row 1: name + time */}
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

              {/* Row 2: delivery tick + preview + unread badge */}
              <div className="flex items-center gap-1">
                {/* Delivery checkmark */}
                {isLastFromMe && (
                  <span className="shrink-0">
                    {chat.isRead ? (
                      <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </span>
                )}

                {/* Preview text */}
                <p
                  className={cn(
                    "text-sm truncate flex-1",
                    isUnread
                      ? "text-foreground/80 font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {chat.preview || "No messages yet"}
                </p>

                {/* Unread count badge — green circle */}
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
};

// ── Collapsed icon-only list (desktop only) ──────────────────────────────────

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
                      ? "bg-muted"
                      : "hover:bg-muted/60 active:bg-muted",
                  )}
                  onClick={() => onChatSelect(chat)}
                  aria-label={chat.name}
                >
                  {chat.isGroup ? (
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center border border-border">
                      <Users className="h-5 w-5 text-muted-foreground" />
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

                  {/* Unread badge */}
                  {chat.unread ? (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-green-500 text-white text-[9px] font-semibold flex items-center justify-center">
                      {chat.unread > 9 ? "9+" : chat.unread}
                    </span>
                  ) : isUnread ? (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                  ) : null}

                  {/* Online dot */}
                  {chat.isOnline && (
                    <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[180px]">
                <p className={cn("font-medium", isUnread && "font-semibold")}>
                  {chat.name}
                  {chat.isOnline && (
                    <span className="ml-1.5 text-green-500 text-xs">●</span>
                  )}
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
