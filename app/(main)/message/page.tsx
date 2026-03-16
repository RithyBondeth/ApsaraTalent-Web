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
    getRecentChats,
    isConnected,
    isChatsLoaded,
    isHistoryLoading,
    setTyping,
    markAsRead,
  } = useChatStore();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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

      // Find the richer sidebar entry first
      const chatFromSidebar = activeChats.find(
        (c) => c.id.toLowerCase() === chatId.toLowerCase(),
      );

      if (chatFromSidebar) {
        setActiveChat(chatFromSidebar);
      } else if (isChatsLoaded) {
        // Sidebar is fully loaded but this chatId isn't in it —
        // open with a skeleton header; getChatHistory will fill in the name
        setActiveChat({
          id: chatId,
          name: "Loading...",
          avatar: "",
          preview: "",
          time: "",
        });
      }
      // If !isChatsLoaded yet, wait for the next render when sidebar arrives
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

  // Mark the last incoming unread message as read when the chat is open
  useEffect(() => {
    if (!activeChat || !currentMessages.length) return;
    const lastUnread = [...currentMessages]
      .reverse()
      .find((m) => !m.isMe && !m.isRead);
    if (lastUnread) markAsRead(lastUnread.id, lastUnread.senderId);
  }, [currentMessages, activeChat, markAsRead]);

  // Show full-page spinner only while the initial socket connection is being established
  const isLoading = !isConnected || !isChatsLoaded;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <ApsaraLoadingSpinner size={80} loop />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-background border-border message-xs:flex-col message-xs:[&>div]:w-full">
      <ChatSidebar
        chats={activeChats}
        activeChat={activeChat}
        isOpen={isSidebarOpen}
        currentUserId={currentUser?.id}
        onChatSelect={(chat) => {
          router.push(`/message?chatId=${chat.id}`);
        }}
      />

      {activeChat ? (
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader
            chat={activeChat}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
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
          <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Your Messages</h2>
            <p className="text-muted-foreground">
              Select a conversation to start chatting. Your messages are
              synchronized across all your devices in real-time.
            </p>
          </div>
        </div>
      )}
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
