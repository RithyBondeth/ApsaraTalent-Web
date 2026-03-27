"use client";

import { ChatMessages } from "@/components/message";
import ChatHeader from "@/components/message/message-header";
import ChatInput from "@/components/message/message-input";
import {
  MessagePaneSkeleton,
  MessageThreadSkeleton,
} from "@/components/message/message-page-skeleton";
import ChatSidebar from "@/components/message/message-sidebar";
import { CallOrchestrator } from "@/components/message/voicecall/call-orchestrator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/features/chat.store";
import { useCallStore } from "@/stores/features/call.store";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { TypographyP } from "@/components/utils/typography/typography-p";
import Image from "next/image";
import MessageLoadingSkeleton from "@/components/message/skeleton/index";
import { MessageSvgImage } from "@/utils/constants/asset.constant";
import { CHAT_LOADING_TIMEOUT_MS } from "@/utils/constants/chat.constant";
import { IMessage } from "@/components/message/props";

export default function MessagePageContent() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const currentUser = useGetCurrentUserStore((state) => state.user);

  // Chat APIs
  const {
    activeChat,
    activeChats,
    currentMessages,
    isTyping,
    isConnected,
    isChatsLoaded,
    isHistoryLoading,
    setTyping,
  } = useChatStore();
  const sendMessage = useChatStore((s) => s.sendMessage);
  const editMessageAction = useChatStore((s) => s.editMessage);

  // Voice Call Initiation
  const initiateCall = useCallStore((s) => s.initiateCall);

  /* -------------------------------- All States ------------------------------ */
  // Desktop: sidebar open by default (resizable). Mobile uses list → chat navigation.
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);

  // Reply target — when set, the input bar shows a quote preview.
  const [replyTarget, setReplyTarget] = useState<IMessage | null>(null);

  // Loading timeout flag
  const [loadingTimedOut, setLoadingTimedOut] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  // Keep resizable panel state in sync with the sidebar toggle (avoid calling
  // panel methods inside setState which triggers render-phase updates).
  useEffect(() => {
    const panel = sidebarPanelRef.current;
    if (!panel) return;
    if (isSidebarOpen) panel.expand();
    else panel.collapse();
  }, [isSidebarOpen]);

  // 1. Core Socket Connection
  // IMPORTANT: connect/disconnect are read via getState() (not reactive hooks)
  // so this effect only runs when currentUser actually changes (login/logout).
  useEffect(() => {
    const { connect, disconnect } = useChatStore.getState();
    if (currentUser) {
      connect(currentUser);
    }
    return () => disconnect();
  }, [currentUser]);

  // 2. URL → Store sync
  useEffect(() => {
    if (!currentUser || !isConnected) return;

    const { activeChat: currentActiveChat, setActiveChat: setChat } =
      useChatStore.getState();

    if (chatId) {
      const { currentMessages: msgs, isHistoryLoading } =
        useChatStore.getState();
      const alreadyOnChat =
        currentActiveChat?.id.toLowerCase() === chatId.toLowerCase();
      const hasMessages = msgs.length > 0;

      if (alreadyOnChat && (hasMessages || isHistoryLoading)) return;

      const chatFromSidebar = activeChats.find(
        (c) => c.id.toLowerCase() === chatId.toLowerCase(),
      );

      if (chatFromSidebar) {
        setChat(chatFromSidebar);
      } else if (isChatsLoaded && !alreadyOnChat) {
        setChat({
          id: chatId,
          name: "Loading...",
          avatar: "",
          preview: "",
          time: "",
        });
      }
    } else if (currentActiveChat) {
      setChat(null);
    }
  }, [chatId, activeChats, isChatsLoaded, isConnected, currentUser]);

  // 3. Mark unread messages as read when opening a chat
  useEffect(() => {
    if (!activeChat || !currentMessages.length) return;
    const lastUnread = [...currentMessages]
      .reverse()
      .find((m) => !m.isMe && !m.isRead);
    if (lastUnread)
      useChatStore.getState().markAsRead(lastUnread.id, lastUnread.senderId);
  }, [currentMessages, activeChat]);

  // 4. Show full-page spinner only during initial load
  useEffect(() => {
    if (isConnected && isChatsLoaded) {
      setLoadingTimedOut(false);
      return;
    }
    const t = setTimeout(
      () => setLoadingTimedOut(true),
      CHAT_LOADING_TIMEOUT_MS,
    );
    return () => clearTimeout(t);
  }, [isConnected, isChatsLoaded]);

  /* --------------------------------- Methods --------------------------------- */
  // ── 1. Toggle Sidebar ────────────────────────────────────────
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ── 2. Handle Start Voice Call ───────────────────────────────
  const handleStartVoiceCall = () => {
    if (!activeChat) return;
    initiateCall({
      userId: activeChat.id,
      name: activeChat.name,
      avatar: activeChat.avatar,
    });
  };

  // ── 3. Send Message ─────────────────────────────────────────
  const handleSendMessage = (
    text: string,
    replyTo?: IMessage["replyTo"] | null,
    attachments?: Array<{
      url: string;
      type: "image" | "document" | "audio";
      filename: string;
      duration?: number;
      amplitude?: number[];
    }>,
  ): boolean => {
    if (!chatId) return false;

    const files = attachments ?? [];

    if (files.length === 0) {
      // Plain text message
      return sendMessage(chatId, text, "text", replyTo, null);
    }

    // First file carries the text + replyTo
    const sent = sendMessage(chatId, text, "text", replyTo, files[0]);
    if (!sent) return false;

    // Remaining files are sent as caption-less attachment messages
    for (let i = 1; i < files.length; i++) {
      sendMessage(chatId, "", "text", null, files[i]);
    }

    return true;
  };

  // ── 4. Edit Message ─────────────────────────────────────────
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (chatId) editMessageAction(messageId, chatId, newContent);
  };

  // ── 5. Handle Typing ─────────────────────────────────────────
  const handleTyping = (typing: boolean) => {
    if (chatId) setTyping(chatId, typing);
  };

  // ── 6. Handle Chat Select ─────────────────────────────────────
  const handleChatSelect = (chat: { id: string }) => {
    setReplyTarget(null);
    router.push(`/message?chatId=${chat.id}`);
  };

  // ── 7. Handle Back ────────────────────────────────────────────
  const handleBack = () => {
    setReplyTarget(null);
    router.push("/message");
  };

  /* ------------------------------- Loading State ----------------------------- */
  const isLoading = (!isConnected || !isChatsLoaded) && !loadingTimedOut;

  if (isLoading) return <MessageLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  const chatView = activeChat ? (
    <div className="flex flex-col h-full min-h-0 min-w-0">
      <ChatHeader
        chat={activeChat}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onStartVoiceCall={handleStartVoiceCall}
      />

      {/* Message area — spinner while history is loading */}
      {isHistoryLoading ? (
        <MessageThreadSkeleton />
      ) : (
        <ChatMessages
          messages={currentMessages}
          activeChat={activeChat}
          isTyping={isTyping[activeChat.id] || false}
          onReply={(msg) => setReplyTarget(msg)}
          onEdit={handleEditMessage}
        />
      )}

      {/* Input bar — shows quote preview when replyTarget is set */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        replyTarget={replyTarget}
        onCancelReply={() => setReplyTarget(null)}
      />
    </div>
  ) : null;

  const desktopEmptyStateView = (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-muted/5">
      <div className="w-full flex flex-col items-center justify-center my-16">
        <Image
          src={MessageSvgImage}
          alt="Message"
          height={300}
          width={300}
          className="animate-float"
        />
        <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
          Select a conversation from the sidebar to start chatting.
        </TypographyP>
      </div>
    </div>
  );

  return (
    <div className="w-full h-[calc(100dvh-4rem)] md:h-full min-h-0 flex bg-background overflow-hidden relative animate-page-in">
      {/* Call Overlay + Incoming Modal */}
      <CallOrchestrator />

      {/* Desktop Resizable Layout Section */}
      <div className="hidden lg:flex w-full h-full min-h-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full min-h-0"
        >
          <ResizablePanel
            ref={sidebarPanelRef}
            defaultSize={26}
            minSize={18}
            maxSize={40}
            collapsible
            collapsedSize={6}
            onCollapse={() => setSidebarOpen(false)}
            onExpand={() => setSidebarOpen(true)}
          >
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={isSidebarOpen}
              isResizable
              className="h-full"
              currentUserId={currentUser?.id}
              onChatSelect={(chat) => router.push(`/message?chatId=${chat.id}`)}
              onNewChat={() => router.push("/message")}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={60} className="flex flex-col min-w-0">
            {chatView ?? desktopEmptyStateView}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Content Area */}
      <div className="lg:hidden flex-1 flex flex-col min-w-0 h-full min-h-0">
        {/* Mobile Section: show full-height sidebar list when no chat is selected */}
        {!chatId && (
          <div className="h-full min-h-0 flex flex-col">
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={true}
              className="h-full w-full"
              currentUserId={currentUser?.id}
              onChatSelect={handleChatSelect}
              onNewChat={() => router.push("/message")}
            />
          </div>
        )}

        {/* Chat View Section: shown when a chatId is in the URL */}
        {chatId && chatView}
        {chatId && !chatView && (
          <div className="flex-1 min-w-0 min-h-0">
            <MessagePaneSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
