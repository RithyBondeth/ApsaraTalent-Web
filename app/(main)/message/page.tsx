"use client";

import { ChatMessages } from "@/components/message";
import ChatHeader from "@/components/message/message-header";
import ChatInput from "@/components/message/message-input";
import ChatSidebar from "@/components/message/message-sidebar";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/chat.store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MessagePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const currentUser = useGetCurrentUserStore((state) => state.user);

  const {
    connect,
    disconnect,
    activeChat,
    activeChats,
    currentMessages,
    isTyping,
    setActiveChat,
    isConnected,
    isChatsLoaded,
    isHistoryLoading,
    setTyping,
    markAsRead,
  } = useChatStore();

  // Desktop: sidebar open by default. Mobile: always false (sheet takes over).
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  // Mobile sheet overlay open state
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const openMobileSidebar = () => setMobileSidebarOpen(true);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  // 1. Core Connection
  useEffect(() => {
    if (currentUser) {
      connect(currentUser);
    }
    return () => disconnect();
  }, [connect, disconnect, currentUser]);

  // 2. URL -> Store sync: runs only when chatId or the chats list changes.
  // Intentionally excludes `activeChat` from deps to avoid infinite loops.
  useEffect(() => {
    if (!currentUser || !isConnected) return;

    if (chatId) {
      // Only switch if we're not already on this chat
      if (activeChat?.id.toLowerCase() === chatId.toLowerCase()) return;

      const chatFromSidebar = activeChats.find(
        (c) => c.id.toLowerCase() === chatId.toLowerCase(),
      );

      if (chatFromSidebar) {
        setActiveChat(chatFromSidebar);
      } else if (isChatsLoaded) {
        setActiveChat({
          id: chatId,
          name: "Loading...",
          avatar: "",
          preview: "",
          time: "",
        });
      }
    } else if (activeChat) {
      setActiveChat(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, activeChats, isChatsLoaded, isConnected, currentUser]);

  const handleSendMessage = (text: string) => {
    if (chatId) useChatStore.getState().sendMessage(chatId, text);
  };

  const handleTyping = (typing: boolean) => {
    if (chatId) setTyping(chatId, typing);
  };

  const handleChatSelect = (chat: { id: string }) => {
    closeMobileSidebar();
    router.push(`/message?chatId=${chat.id}`);
  };

  const handleBack = () => {
    router.push("/message");
  };

  // Mark the last incoming unread message as read when the chat is open
  useEffect(() => {
    if (!activeChat || !currentMessages.length) return;
    const lastUnread = [...currentMessages]
      .reverse()
      .find((m) => !m.isMe && !m.isRead);
    if (lastUnread) markAsRead(lastUnread.id, lastUnread.senderId);
  }, [currentMessages, activeChat, markAsRead]);

  // Show full-page spinner only while initial socket connection is being established
  const isLoading = !isConnected || !isChatsLoaded;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <ApsaraLoadingSpinner size={80} loop />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-background overflow-hidden relative">
      {/*
       * MOBILE / TABLET  (<= 768px):  Full-screen sidebar overlays chat.
       *   - No chatId in URL  → show sidebar list
       *   - chatId in URL     → show chat view (back arrow navigates to list)
       *   - Hamburger in header opens sidebar sheet over chat view
       *
       * DESKTOP  (> 768px):  Classic side-by-side split view.
       *   - Sidebar is collapsible (w-80 ↔ w-16) via toggle button in header
       */}

      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────── */}
      <div className="hidden md:flex h-full">
        <ChatSidebar
          chats={activeChats}
          activeChat={activeChat}
          isOpen={isSidebarOpen}
          currentUserId={currentUser?.id}
          onChatSelect={(chat) => router.push(`/message?chatId=${chat.id}`)}
        />
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────────────── */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
          {/* Sidebar panel slides in from left */}
          <div className="relative w-[85vw] max-w-sm h-full bg-background shadow-xl z-10 animate-in slide-in-from-left duration-300">
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={true}
              currentUserId={currentUser?.id}
              onChatSelect={handleChatSelect}
              onClose={closeMobileSidebar}
            />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile: show sidebar list when no chat selected */}
        {!chatId && (
          <div className="md:hidden h-full flex flex-col">
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={true}
              currentUserId={currentUser?.id}
              onChatSelect={handleChatSelect}
            />
          </div>
        )}

        {/* Chat view — shown when chatId is in URL */}
        {activeChat ? (
          <div className="flex flex-col h-full min-w-0">
            <ChatHeader
              chat={activeChat}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
              onBack={handleBack}
              onOpenMobileSidebar={openMobileSidebar}
            />
            {isHistoryLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <ApsaraLoadingSpinner size={48} loop />
              </div>
            ) : (
              <ChatMessages
                messages={currentMessages}
                activeChat={activeChat}
                isTyping={isTyping[activeChat.id] || false}
              />
            )}
            <ChatInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
            />
          </div>
        ) : (
          /* Desktop empty state when no chat selected */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-muted/5">
            <div className="max-w-md space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Your Messages</h2>
              <p className="text-muted-foreground">
                Select a conversation from the sidebar to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MessagePage() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <ApsaraLoadingSpinner size={80} loop />
          </div>
        }
      >
        <MessagePageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
