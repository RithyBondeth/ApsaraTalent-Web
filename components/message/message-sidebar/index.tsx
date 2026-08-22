"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucidePlus, LucideSearch, LucideX } from "lucide-react";
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
        "flex h-full flex-col overflow-hidden border-r border-border bg-card transition-all duration-300 ease-in-out",
        widthClass,
        !isResizable && "lg:w-auto",
        className,
      )}
      style={minWidthStyle}
    >
      {/* Sidebar Header Section */}
      {isOpen ? (
        <div className="flex shrink-0 items-end justify-between border-b border-border px-3 pb-3 pt-4 md:px-4 md:pb-4 md:pt-5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              01
            </span>
            <h1 className="text-xl font-black tracking-[-0.035em] text-foreground md:text-2xl">
              {t("chats")}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {/* On New Chat Button Section */}
            {onNewChat && (
              <button
                onClick={onNewChat}
                aria-label="New conversation"
                className="flex h-9 w-9 items-center justify-center rounded-none border border-foreground bg-foreground text-background transition-colors hover:border-primary hover:bg-primary"
              >
                <LucidePlus className="h-4 w-4" />
              </button>
            )}
            {/* On Close Button Section */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none lg:hidden"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <LucideX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Sidebar Collapsed Header Section */
        <div className="flex shrink-0 flex-col items-center py-4">
          {onNewChat && (
            <button
              onClick={onNewChat}
              aria-label="New conversation"
              className="flex h-9 w-9 items-center justify-center rounded-none border border-foreground bg-foreground text-background transition-colors hover:border-primary hover:bg-primary"
            >
              <LucidePlus className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Sidebar Search Section */}
      {isOpen && (
        <div className="shrink-0 border-b border-border px-3 py-3 md:px-4">
          <div className="relative">
            <LucideSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("chatsSearch")}
              className="h-10 rounded-none border-border bg-muted/30 pl-9 focus-visible:ring-1 focus-visible:ring-primary"
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
