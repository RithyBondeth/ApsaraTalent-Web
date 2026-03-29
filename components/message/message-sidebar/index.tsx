"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { IChatSidebarProps } from "./props";
import ExpandedChatList from "./expanded-chat-list";
import CollapsedChatList from "./collapesed-chat-list";

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
        "flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden border-r bg-background",
        widthClass,
        !isResizable && "lg:w-auto",
        className,
      )}
      style={minWidthStyle}
    >
      {/* Sidebar Header Section */}
      {isOpen ? (
        <div className="px-3 md:px-4 pt-4 md:pt-5 pb-2.5 md:pb-3 flex items-center justify-between shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            Chats
          </h1>
          <div className="flex items-center gap-1">
            {/* On New Chat Button */}
            {onNewChat && (
              <button
                onClick={onNewChat}
                aria-label="New conversation"
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            {/* On Close Button */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 lg:hidden"
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
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Sidebar Search Section */}
      {isOpen && (
        <div className="px-3 md:px-4 pb-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Chats search..."
              className="pl-9 h-10 rounded-full bg-muted/40 border-muted focus-visible:ring-1"
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
