"use client";

import { ChatMessages } from "@/components/message";
import ChatHeader from "@/components/message/message-header";
import ChatInput from "@/components/message/message-input";
import MessagePageSkeleton, {
  MessagePaneSkeleton,
  MessageThreadSkeleton,
} from "@/components/message/message-page-skeleton";
import ChatSidebar from "@/components/message/message-sidebar";
import { CallOrchestrator } from "@/components/call";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/chat.store";
import { useCallStore } from "@/stores/call.store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IMessage } from "@/components/message/props";
import type { ImperativePanelHandle } from "react-resizable-panels";

/**
 * Message page — orchestrates the full chat experience.
 *
 * ── Layout Strategy ───────────────────────────────────────────────────────────
 *   Mobile  (< 768px):  Single-column, full-screen.
 *     • No chatId in URL → show full-height sidebar list.
 *     • chatId in URL    → show chat view; back arrow goes back to list.
 *     • Hamburger in header opens sidebar as an overlay sheet.
 *   Desktop (≥ 768px):  Classic side-by-side split.
 *     • Sidebar (w-80) is collapsible via toggle chevron in header.
 *
 * ── Key State ─────────────────────────────────────────────────────────────────
 *   replyTarget — the IMessage the user wants to reply to.
 *     Set by: MessageBubble → ChatMessages.onReply → here.
 *     Consumed by: ChatInput (shows quote bar; attaches replyTo to send).
 *     Cleared by: ChatInput after send, or when user presses ✕.
 */
const MessagePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const currentUser = useGetCurrentUserStore((state) => state.user);

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

  // Stable action refs — read directly from the store singleton so they never
  // appear in useEffect dependency arrays (which would re-fire effects and
  // call disconnect() on every store update, wiping currentMessages).
  const sendMessage = useChatStore((s) => s.sendMessage);
  const editMessageAction = useChatStore((s) => s.editMessage);

  // ── Voice call initiation ─────────────────────────────────────────────────
  const initiateCall = useCallStore((s) => s.initiateCall);
  const handleStartVoiceCall = () => {
    if (!activeChat) return;
    initiateCall({
      userId: activeChat.id,
      name: activeChat.name,
      avatar: activeChat.avatar,
    });
  };

  // Desktop: sidebar open by default. Mobile: always false (overlay takes over).
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);
  // Mobile overlay open state
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /**
   * Reply target — when set, the input bar shows a quote preview.
   * Flow: bubble.onReply(msg) → setReplyTarget(msg) → ChatInput shows preview
   *       → user sends → handleSendMessage passes replyTo → store attaches it.
   */
  const [replyTarget, setReplyTarget] = useState<IMessage | null>(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Keep resizable panel state in sync with the sidebar toggle (avoid calling
  // panel methods inside setState which triggers render-phase updates).
  useEffect(() => {
    const panel = sidebarPanelRef.current;
    if (!panel) return;
    if (isSidebarOpen) panel.expand();
    else panel.collapse();
  }, [isSidebarOpen]);
  const openMobileSidebar = () => setMobileSidebarOpen(true);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  // ── 1. Core socket connection ────────────────────────────────────────────
  // IMPORTANT: connect/disconnect are read via getState() (not reactive hooks)
  // so this effect only runs when currentUser actually changes (login/logout).
  // Using them as reactive dependencies would re-fire the effect on every store
  // update, calling disconnect() and wiping currentMessages mid-session.
  useEffect(() => {
    const { connect, disconnect } = useChatStore.getState();
    if (currentUser) {
      connect(currentUser);
    }
    return () => disconnect();
  }, [currentUser]);

  // ── 2. URL → Store sync ──────────────────────────────────────────────────
  // Runs only when chatId or the chats list changes.
  // activeChat is read via getState() (not the reactive value) so the guard
  // always reflects the current store value without needing it in deps.
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

      // Skip entirely if:
      //  (a) already on this chat AND messages are loaded (normal guard), OR
      //  (b) already on this chat AND history is currently loading (getChatHistory
      //      was already started — don't kick off a second concurrent request)
      if (alreadyOnChat && (hasMessages || isHistoryLoading)) return;

      const chatFromSidebar = activeChats.find(
        (c) => c.id.toLowerCase() === chatId.toLowerCase(),
      );

      if (chatFromSidebar) {
        // Found in sidebar — setActiveChat will atomically set loading state + fetch
        setChat(chatFromSidebar);
      } else if (isChatsLoaded && !alreadyOnChat) {
        // Not in sidebar yet (e.g. brand-new chat navigated to directly).
        // Set a skeleton placeholder so the header renders; getChatHistory will
        // resolve the name + avatar from partnerProfile when it returns.
        setChat({
          id: chatId,
          name: "Loading...",
          avatar: "",
          preview: "",
          time: "",
        });
      }
      // If !isChatsLoaded, wait — the effect will re-run when isChatsLoaded becomes true
    } else if (currentActiveChat) {
      setChat(null);
    }
  }, [chatId, activeChats, isChatsLoaded, isConnected, currentUser]);

  // ── 3. Mark unread messages as read when opening a chat ─────────────────
  useEffect(() => {
    if (!activeChat || !currentMessages.length) return;
    const lastUnread = [...currentMessages]
      .reverse()
      .find((m) => !m.isMe && !m.isRead);
    if (lastUnread)
      useChatStore.getState().markAsRead(lastUnread.id, lastUnread.senderId);
  }, [currentMessages, activeChat]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /**
   * Send a message (with optional reply-to context and/or file attachments).
   *
   * Multi-file strategy: each file becomes its own chat message so every
   * attachment renders as a separate bubble (consistent with how most chat
   * apps handle multi-file sends).  The text (if any) travels with the
   * FIRST file so it reads naturally as a caption.  Extra files after the
   * first are sent as attachment-only messages immediately after.
   *
   * Examples:
   *   text="check this" + [img1, img2]
   *     → msg1: content="check this", attachment=img1
   *     → msg2: content="",            attachment=img2
   *
   *   text="hello" + no attachments
   *     → msg1: content="hello"
   *
   *   text="" + [doc1]
   *     → msg1: content="", attachment=doc1
   */
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

  /**
   * Edit an existing message's text content.
   * Called by MessageBubble when the user confirms an inline edit.
   */
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (chatId) editMessageAction(messageId, chatId, newContent);
  };

  const handleTyping = (typing: boolean) => {
    if (chatId) setTyping(chatId, typing);
  };

  const handleChatSelect = (chat: { id: string }) => {
    closeMobileSidebar();
    // Clear reply state when switching chats
    setReplyTarget(null);
    router.push(`/message?chatId=${chat.id}`);
  };

  const handleBack = () => {
    setReplyTarget(null);
    router.push("/message");
  };

  // Show full-page spinner only during initial load (connection + first chat list fetch).
  // Use a 5-second timeout so a connection error doesn't leave the page stuck forever.
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  useEffect(() => {
    // Reset timeout flag whenever we successfully connect so a future disconnect
    // → reconnect cycle can show the spinner briefly again if needed.
    if (isConnected && isChatsLoaded) {
      setLoadingTimedOut(false);
      return;
    }
    const t = setTimeout(() => setLoadingTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [isConnected, isChatsLoaded]);

  const isLoading = (!isConnected || !isChatsLoaded) && !loadingTimedOut;

  if (isLoading) {
    return <MessagePageSkeleton />;
  }

  const chatView = activeChat ? (
    <div className="flex flex-col h-full min-w-0">
      <ChatHeader
        chat={activeChat}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onOpenMobileSidebar={openMobileSidebar}
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
          onReply={(msg) => setReplyTarget(msg)} // ← reply handler
          onEdit={handleEditMessage} // ← edit handler
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

  const desktopEmptyState = (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-muted/5">
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
  );

  return (
    <div className="w-full h-full flex bg-background overflow-hidden relative">
      {/* Call overlay + incoming modal — persists across chat switches */}
      <CallOrchestrator />
      {/*
       * MOBILE / TABLET  (<= 768px):  Full-screen sidebar overlays chat.
       *   - No chatId → show sidebar list (full height)
       *   - chatId    → show chat view; back arrow returns to list
       *   - Hamburger in header opens sidebar sheet over chat view
       *
       * DESKTOP  (> 768px):  Classic side-by-side split view.
       *   - Sidebar is collapsible (w-80 ↔ w-16) via toggle in header
       */}

      {/* ── DESKTOP RESIZABLE LAYOUT ─────────────────────────────────────── */}
      <ResizablePanelGroup
        direction="horizontal"
        className="hidden md:flex w-full h-full"
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
            onNewChat={() => {
              // TODO: open contact picker modal
              // For now we just navigate to /message to show the empty state
              router.push("/message");
            }}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={60} className="flex flex-col min-w-0">
          {chatView ?? desktopEmptyState}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────────────────── */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop — clicking dismisses the overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
          {/* Sidebar panel slides in from the left */}
          <div className="relative w-[85vw] max-w-sm h-full bg-background shadow-xl z-10 animate-in slide-in-from-left duration-300">
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={true}
              currentUserId={currentUser?.id}
              onChatSelect={handleChatSelect}
              onClose={closeMobileSidebar}
              onNewChat={() => {
                closeMobileSidebar();
                router.push("/message");
              }}
            />
          </div>
        </div>
      )}

      {/* ── MOBILE CONTENT AREA ──────────────────────────────────────────── */}
      <div className="md:hidden flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile: show full-height sidebar list when no chat is selected */}
        {!chatId && (
          <div className="md:hidden h-full flex flex-col">
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={true}
              currentUserId={currentUser?.id}
              onChatSelect={handleChatSelect}
              onNewChat={() => router.push("/message")}
            />
          </div>
        )}

        {/* Chat view — shown when a chatId is in the URL */}
        {chatId && chatView}
        {chatId && !chatView && (
          <div className="flex-1 min-w-0">
            <MessagePaneSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default function MessagePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<MessagePageSkeleton />}>
        <MessagePageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
