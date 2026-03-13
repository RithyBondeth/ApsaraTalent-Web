"use client";

import { ChatMessages } from "@/components/message";
import ChatHeader from "@/components/message/message-header";
import ChatInput from "@/components/message/message-input";
import ChatSidebar from "@/components/message/message-sidebar";
import { IChatPreview } from "@/components/message/props";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/chat.store";
import axiosInstance from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MessagePageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get("chatId"); // Using this as receiverId
  const currentUser = useGetCurrentUserStore((state) => state.user);

  const {
    connect,
    sendMessage,
    currentMessages,
    socket,
    isConnected,
    isTyping,
    setTyping,
    markAsRead,
  } = useChatStore();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chats, setChats] = useState<IChatPreview[]>([]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Connect WebSocket — reads token from document.cookie internally
  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [connect, isConnected]);

  const fetchRecent = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await axiosInstance.get(`${baseUrl}/chat/recent`);

      const currentUserId = currentUser?.id;

      // Resolve the display name and avatar from the nested employee/company profile
      const resolveProfile = (user: any) => {
        if (!user)
          return {
            name: "Unknown User",
            avatar: "/avatars/default.png",
            email: "",
          };
        const emp = user.employee;
        const co = user.company;

        const name = emp
          ? [emp.firstname, emp.lastname].filter(Boolean).join(" ") ||
            emp.username ||
            user.email
          : co?.name || user.email;

        const avatar = emp?.avatar || co?.avatar || "/avatars/default.png";

        return { name, avatar, email: user.email };
      };

      // Deduplicate by conversation partner — backend orders by sentAt DESC
      const seenPartners = new Map<string, IChatPreview>();
      res.data.forEach((chat: any) => {
        const isSenderMe = chat.sender?.id === currentUserId;
        const otherUser = isSenderMe ? chat.receiver : chat.sender;
        const partnerId = otherUser?.id || chat.id;

        if (!seenPartners.has(partnerId)) {
          const { name, avatar } = resolveProfile(otherUser);
          seenPartners.set(partnerId, {
            id: partnerId,
            name,
            avatar,
            preview: chat.content,
            time: new Date(
              chat.sendAt || chat.sentAt || chat.createdAt || Date.now(),
            ).toLocaleTimeString(),
            isRead: chat.isRead,
            lastMessageSenderId: chat.sender?.id,
          });
        }
      });

      setChats(Array.from(seenPartners.values()));
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load recent chats", err);
      setIsLoading(false);
    }
  };

  // Load Recent Chats via HTTP
  useEffect(() => {
    if (currentUser) {
      fetchRecent();
    }
  }, [currentUser]);

  // Refresh sidebar when a new message arrives
  useEffect(() => {
    if (currentMessages.length > 0) {
      fetchRecent();
    }
  }, [currentMessages.length]);

  // Effect 1: Open the chat panel immediately when chatId is in the URL
  // Does NOT require socket — so clicking a sidebar item always opens the conversation
  useEffect(() => {
    if (!chatId) {
      setActiveChat(null);
      return;
    }
    const chat = chats.find((c) => c.id === chatId);
    setActiveChat(
      chat ?? {
        id: chatId,
        name: "Loading...",
        avatar: "/avatars/default.png",
        preview: "",
        time: "",
      },
    );
  }, [chatId, chats]);

  // Effect 2: Load message history via WebSocket once socket connects
  useEffect(() => {
    if (!chatId || !isConnected || !socket) return;

    setIsLoadingMessages(true);
    socket.emit(
      "getChatHistory",
      { userId2: chatId, limit: 100, offset: 0 },
      (response: any) => {
        setIsLoadingMessages(false);
        if (Array.isArray(response)) {
          const currentUserId = currentUser?.id;
          useChatStore.setState({
            currentMessages: response
              .map((msg: any) => ({
                id: msg.id,
                senderId: msg.sender?.id,
                content: msg.content,
                timestamp: new Date(msg.sentAt || msg.createdAt || Date.now()),
                isMe: msg.sender?.id === currentUserId,
                isRead: msg.isRead,
                reactions: msg.reactions || {},
              }))
              .reverse(),
          });

          // Auto-mark all unread incoming messages as read
          response.forEach((msg: any) => {
            if (!msg.isRead && msg.sender?.id !== currentUser?.id) {
              markAsRead(msg.id, msg.sender?.id);
            }
          });
        }
      },
    );
  }, [chatId, isConnected, socket, currentUser]);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !chatId) return;

    const currentUserId = currentUser?.id ?? "me";

    // Always show the bubble immediately (optimistic UI)
    const optimisticMsg = {
      id: `optimistic-${Date.now()}`,
      senderId: currentUserId,
      content: text.trim(),
      timestamp: new Date(),
      isMe: true,
      isRead: false,
    };
    useChatStore.setState((state) => ({
      currentMessages: [...state.currentMessages, optimisticMsg],
    }));

    // Attempt socket delivery if connected
    if (socket?.connected) {
      socket.emit("sendMessage", {
        receiverId: chatId,
        content: text.trim(),
        type: "text",
      });
    } else {
      console.warn("Socket not connected — message shown locally only");
    }
  };

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
        chats={chats}
        activeChat={activeChat}
        isOpen={isSidebarOpen}
        currentUserId={currentUser?.id}
        onChatSelect={(chat) => {
          router.push(`/message?chatId=${chat.id}`);
        }}
      />

      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            chat={activeChat}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />

          {isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <ApsaraLoadingSpinner size={40} loop />
                <p className="text-muted-foreground text-sm">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages
              messages={currentMessages}
              activeChat={activeChat}
              isTyping={chatId ? (isTyping[chatId] ?? false) : false}
            />
          )}

          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={(typing) => chatId && setTyping(chatId, typing)}
            isDisabled={isLoadingMessages}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium">No conversation selected</h2>
            <p className="text-muted-foreground mt-2">
              Select a chat from the sidebar to start messaging.
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
