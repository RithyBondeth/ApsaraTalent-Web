"use client";

import { ChatMessages } from "@/components/message";
import ChatHeader from "@/components/message/message-header";
import ChatInput from "@/components/message/message-input";
import ChatSidebar from "@/components/message/message-sidebar";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";
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

  // 2. Synchronization Logic
  useEffect(() => {
    if (!currentUser) return;

    // Refresh sidebar on load
    if (activeChats.length === 0) getRecentChats();

    // URL -> Store Sync
    if (chatId) {
      // Find the chat in the sidebar list (if loaded)
      const chatFromSidebar = activeChats.find(
        (c) => c.id.toLowerCase() === chatId.toLowerCase(),
      );

      if (chatFromSidebar) {
        // Sync with existing sidebar entry (preferred)
        if (!activeChat || activeChat.id !== chatFromSidebar.id) {
          setActiveChat(chatFromSidebar);
        }
      } else {
        // Fallback: Initialize with skeleton if not in sidebar or sidebar still loading
        // This ensures the chat window opens immediately
        if (
          !activeChat ||
          activeChat.id.toLowerCase() !== chatId.toLowerCase()
        ) {
          setActiveChat({
            id: chatId,
            name: "Loading...",
            avatar: "",
            preview: "",
            time: "",
          });
        }
      }
    } else if (activeChat) {
      // Clear selection if no chatId in URL
      setActiveChat(null);
    }
  }, [
    chatId,
    activeChats,
    activeChat,
    currentUser,
    getRecentChats,
    setActiveChat,
  ]);

  const handleSendMessage = (text: string) => {
    if (chatId) useChatStore.getState().sendMessage(chatId, text);
  };

  const handleTyping = (typing: boolean) => {
    if (chatId) setTyping(chatId, typing);
  };

  // Mark incoming messages as read when the chat is open
  useEffect(() => {
    if (!activeChat || !currentMessages.length) return;
    const lastUnread = [...currentMessages]
      .reverse()
      .find((m) => !m.isMe && !m.isRead);
    if (lastUnread) markAsRead(lastUnread.id, lastUnread.senderId);
  }, [currentMessages, activeChat, markAsRead]);

  const isLoading = !isConnected || (activeChats.length === 0 && !chatId);

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
          <ChatMessages
            messages={currentMessages}
            activeChat={activeChat}
            isTyping={isTyping[activeChat.id] || false}
          />
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
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <ApsaraLoadingSpinner size={80} loop />
        </div>
      }
    >
      <MessagePageContent />
    </Suspense>
  );
}
