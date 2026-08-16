"use client";

import { ChatMessages } from "@/components/message";
import ChatHeader from "@/components/message/message-header";
import ChatInput from "@/components/message/message-input";
import ChatSidebar from "@/components/message/message-sidebar";
import { CallOrchestrator } from "@/components/message/message-voicecall/call-orchestrator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/features/chat/chat.store";
import { useCallStore } from "@/stores/features/call/call.store";
import { useInitiateChatStore } from "@/stores/apis/chat/initiate-chat.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import NewChatDialog from "@/components/message/new-chat-dialog";
import type { INewChatCandidate } from "@/components/message/new-chat-dialog/props";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ImperativePanelHandle } from "react-resizable-panels";
import MessageLoadingSkeleton, {
  MessagePaneSkeleton,
  MessageThreadSkeleton,
} from "@/components/message/skeleton/index";
import { CHAT_LOADING_TIMEOUT_MS } from "@/utils/constants/chat.constant";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";
import { useTranslations } from "next-intl";
import { PageState } from "@/components/utils/feedback/page-state";

export default function MessagePageContent() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("message");
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  /* -------------------------------- All States ------------------------------ */
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);
  const [replyTarget, setReplyTarget] = useState<IMessage | null>(null);
  const [loadingTimedOut, setLoadingTimedOut] = useState<boolean>(false);
  const [isNewChatOpen, setNewChatOpen] = useState<boolean>(false);
  const [startingChatId, setStartingChatId] = useState<string | null>(null);

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

  // New Chat: only matched people may be messaged, so the picker is fed by the
  // same matching lists the matching page uses — companies for an employee,
  // employees for a company.
  const { initiateChat } = useInitiateChatStore();
  const isEmployee = currentUser?.role === "employee";
  const {
    currentEmployeeMatching: matchedCompanies,
    loading: matchedCompaniesLoading,
    queryCurrentEmployeeMatching,
  } = useGetCurrentEmployeeMatchingStore();
  const {
    currentCompanyMatching: matchedEmployees,
    loading: matchedEmployeesLoading,
    queryCurrentCompanyMatching,
  } = useGetCurrentCompanyMatchingStore();

  const newChatCandidates: INewChatCandidate[] = useMemo(() => {
    if (isEmployee) {
      return (matchedCompanies ?? []).map((company) => ({
        id: company.id ?? "",
        name: company.name ?? t("unknown"),
        avatar: company.avatar,
        subtitle: company.industry,
      }));
    }
    return (matchedEmployees ?? []).map((employee) => ({
      id: employee.id ?? "",
      name:
        [employee.firstname, employee.lastname].filter(Boolean).join(" ") ||
        employee.username ||
        t("unknown"),
      avatar: employee.avatar,
      subtitle: employee.job,
    }));
  }, [isEmployee, matchedCompanies, matchedEmployees, t]);

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
          name: t("loadingChat"),
          avatar: "",
          preview: "",
          time: "",
        });
      }
    } else if (currentActiveChat) {
      setChat(null);
    }
  }, [chatId, activeChats, isChatsLoaded, isConnected, currentUser, t]);

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
  // ── Toggle Sidebar ────────────────────────────────────────
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ── Handle Start Voice Call ───────────────────────────────
  const handleStartVoiceCall = () => {
    if (!activeChat) return;
    initiateCall({
      userId: activeChat.id,
      name: activeChat.name,
      avatar: activeChat.avatar,
    });
  };

  // ── Handle New Chat ───────────────────────────────────────
  // Matches are fetched when the picker opens rather than on mount, so the
  // message page does not pay for a list most visits never use.
  const handleOpenNewChat = useCallback(() => {
    setNewChatOpen(true);
    const profileId = isEmployee
      ? currentUser?.employee?.id
      : currentUser?.company?.id;
    if (!profileId) return;
    if (isEmployee) void queryCurrentEmployeeMatching(profileId);
    else void queryCurrentCompanyMatching(profileId);
  }, [
    currentUser,
    isEmployee,
    queryCurrentCompanyMatching,
    queryCurrentEmployeeMatching,
  ]);

  const handleSelectNewChat = useCallback(
    async (candidate: INewChatCandidate) => {
      const senderId = isEmployee
        ? currentUser?.employee?.id
        : currentUser?.company?.id;
      if (!senderId || !candidate.id || startingChatId) return;

      setStartingChatId(candidate.id);
      try {
        const chat = await initiateChat(senderId, candidate.id);
        setNewChatOpen(false);
        router.push(`/message?chatId=${chat.id}`);
      } catch (error) {
        console.error("Failed to start chat:", error);
      } finally {
        setStartingChatId(null);
      }
    },
    [currentUser, initiateChat, isEmployee, router, startingChatId],
  );

  // ── Send Message ─────────────────────────────────────────
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

  // ── Edit Message ─────────────────────────────────────────
  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (chatId) editMessageAction(messageId, chatId, newContent);
    },
    [chatId, editMessageAction],
  );

  // ── Handle Typing ─────────────────────────────────────────
  const handleTyping = useCallback(
    (typing: boolean) => {
      if (chatId) setTyping(chatId, typing);
    },
    [chatId, setTyping],
  );

  const handleReply = useCallback((message: IMessage) => {
    setReplyTarget(message);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  // ── Handle Chat Select ─────────────────────────────────────
  const handleChatSelect = (chat: { id: string }) => {
    setReplyTarget(null);
    router.push(`/message?chatId=${chat.id}`);
  };

  // ── Handle Back ────────────────────────────────────────────
  const handleBack = () => {
    setReplyTarget(null);
    router.push("/message");
  };

  /* ------------------------------- Loading State ----------------------------- */
  const isLoading = (!isConnected || !isChatsLoaded) && !loadingTimedOut;

  if (isLoading) return <MessageLoadingSkeleton />;

  if (loadingTimedOut && (!isConnected || !isChatsLoaded))
    return (
      <div className="flex h-full w-full items-center">
        <PageState
          variant="error"
          title={t("connectionError")}
          description={t("connectionErrorDescription")}
          action={{
            label: t("retry"),
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );

  /* -------------------------------- Render UI -------------------------------- */
  // Chat View Section
  const chatView = activeChat ? (
    <div className="bg-background/92 flex h-full min-h-0 min-w-0 flex-col">
      {/* Chat Header Section */}
      <ChatHeader
        chat={activeChat}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        onBack={handleBack}
        onStartVoiceCall={handleStartVoiceCall}
      />

      {/* Message Area Section — Spinner while history is loading */}
      {isHistoryLoading ? (
        <MessageThreadSkeleton />
      ) : (
        <ChatMessages
          messages={currentMessages}
          activeChat={activeChat}
          isTyping={isTyping[activeChat.id] || false}
          onReply={handleReply}
          onEdit={handleEditMessage}
        />
      )}

      {/* Input Bar Section — Shows quote preview when replyTarget is set */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        replyTarget={replyTarget}
        onCancelReply={handleCancelReply}
      />
    </div>
  ) : null;

  // Desktop Empty State View Section
  const desktopEmptyStateView = (
    <div className="flex min-h-0 flex-1">
      <PageState
        variant="empty"
        title={t("selectConversationTitle")}
        description={t("selectConversation")}
        compact
      />
    </div>
  );

  return (
    <div className="message-editorial relative flex h-full min-h-0 w-full overflow-hidden border border-border bg-background">
      {/* Call Overlay + Incoming Modal Section */}
      <CallOrchestrator />

      {/* New Chat Picker Section */}
      <NewChatDialog
        open={isNewChatOpen}
        onOpenChange={setNewChatOpen}
        candidates={newChatCandidates}
        loading={isEmployee ? matchedCompaniesLoading : matchedEmployeesLoading}
        startingId={startingChatId}
        onSelect={handleSelectNewChat}
      />

      {/* Desktop Resizable Layout Section */}
      <div className="hidden h-full min-h-0 w-full lg:flex">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full min-h-0 w-full"
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
              onNewChat={handleOpenNewChat}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={60} className="flex min-w-0 flex-col">
            {chatView ?? desktopEmptyStateView}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Content Area Section */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col lg:hidden">
        {/* Mobile Section: show full-height sidebar list when no chat is selected */}
        {!chatId && (
          <div className="flex h-full min-h-0 flex-col">
            <ChatSidebar
              chats={activeChats}
              activeChat={activeChat}
              isOpen={true}
              className="h-full w-full"
              currentUserId={currentUser?.id}
              onChatSelect={handleChatSelect}
              onNewChat={handleOpenNewChat}
            />
          </div>
        )}

        {/* Chat View Section: shown when a chatId is in the URL */}
        {chatId && chatView}
        {chatId && !chatView && (
          <div className="min-h-0 min-w-0 flex-1">
            <MessagePaneSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
