"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { IChatSidebarProps } from "./props";
import ExpandedChatList from "./expanded-chat-list";
import CollapsedChatList from "./collapsed-chat-list";
import { useTranslations } from "next-intl";

export default function ChatSidebar(props: IChatSidebarProps) {
  /* --------------------------------- Props --------------------------------- */
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

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");

  /* -------------------------------- All States ------------------------------ */
  const [searchQuery, setSearchQuery] = useState<string>("");

  /* ---------------------------------- Utils --------------------------------- */
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredChats = normalizedSearchQuery
    ? chats?.filter(
        (chat) =>
          chat.name.toLowerCase().includes(normalizedSearchQuery) ||
          chat.preview?.toLowerCase().includes(normalizedSearchQuery),
      )
    : chats;

  const widthClass = isResizable
    ? "w-full"
    : isOpen
      ? "w-full lg:w-80"
      : "w-16";
  const minWidthStyle =
    !isResizable && !isOpen
      ? { minWidth: "var(--sidebar-closed-width, 4rem)" }
      : undefined;

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Chat Search ─────────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden border-r border-border bg-card",
        widthClass,
        !isResizable && "lg:w-auto",
        className,
      )}
      style={minWidthStyle}
    >
      {/* Sidebar Header Section */}
      {isOpen ? (
        <div className="px-3 md:px-4 pt-4 md:pt-5 pb-3 md:pb-4 flex items-end justify-between shrink-0 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              01
            </span>
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-[-0.035em]">
              {t("chats")}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {/* On New Chat Button Section */}
            {onNewChat && (
              <button
                onClick={onNewChat}
                aria-label="New conversation"
                className="h-9 w-9 rounded-none border border-foreground bg-foreground flex items-center justify-center text-background hover:bg-primary hover:border-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            {/* On Close Button Section */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 lg:hidden rounded-none"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Sidebar Collapsed Header Section */
        <div className="py-4 flex flex-col items-center shrink-0">
          {onNewChat && (
            <button
              onClick={onNewChat}
              aria-label="New conversation"
              className="h-9 w-9 rounded-none border border-foreground bg-foreground flex items-center justify-center text-background hover:bg-primary hover:border-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Sidebar Search Section */}
      {isOpen && (
        <div className="px-3 md:px-4 py-3 shrink-0 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("chatsSearch")}
              className="pl-9 h-10 rounded-none bg-muted/30 border-border focus-visible:ring-1 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Sidebar Chat List Section */}
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
