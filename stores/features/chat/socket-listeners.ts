import { TChatState, SocketInstance } from "./types";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";
import { resolveMessageSnippet } from "./utils";
import { formatSidebarTime, parseMessageDate } from "@/utils/functions/date";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { normalizeMediaUrl } from "@/utils/functions/media";

export const registerSocketListeners = (
  socket: SocketInstance,
  set: (partial: any) => void,
  get: () => TChatState,
) => {
  // ── Incoming New Message ────────────────────────────────────────────────
  socket.on("newMessage", (message: any) => {
    const { activeChat, currentMessages, getRecentChats, me } = get();

    // ── Resolve Reply To ────
    const resolveReplyTo = (
      replyToId: string | null | undefined,
    ): IMessage["replyTo"] => {
      if (!replyToId) return undefined;
      const parent = currentMessages.find((m) => m.id === replyToId);
      if (parent) {
        const preview = parent.isDeleted
          ? "This message was deleted"
          : resolveMessageSnippet(parent) || "Message";
        return {
          id: parent.id,
          content: preview,
          senderName: parent.senderName || (parent.isMe ? "You" : ""),
          isDeleted: parent.isDeleted,
        };
      }
      return { id: replyToId, content: "", senderName: "", isDeleted: false };
    };

    // ── Resolve Message ────
    const isFromMe = message.senderId === me?.id;
    const isForMe = message.receiverId === me?.id;
    const isActiveChatOpen =
      activeChat &&
      (message.senderId === activeChat.id ||
        message.receiverId === activeChat.id);

    const partnerId = isFromMe ? message.receiverId : message.senderId;
    const preview = resolveMessageSnippet(message) || "";
    const previewText = isFromMe ? `You: ${preview}` : preview;
    const newTime = formatSidebarTime(
      message.sentAt || message.timestamp || Date.now(),
    );
    const isNewUnread = !isFromMe && isForMe && !isActiveChatOpen;

    // ── Update Active Chats ────
    set((state: TChatState) => {
      const exists = state.activeChats.some((c) => c.id === partnerId);
      if (exists) {
        return {
          activeChats: state.activeChats.map((c) => {
            if (c.id !== partnerId) return c;
            return {
              ...c,
              preview: previewText || c.preview,
              time: newTime,
              isRead: isActiveChatOpen ? true : isFromMe ? c.isRead : false,
              lastMessageSenderId: message.senderId,
              unread: isNewUnread ? (c.unread ?? 0) + 1 : (c.unread ?? 0),
            };
          }),
          unreadCount: isNewUnread ? state.unreadCount + 1 : state.unreadCount,
        };
      }
      getRecentChats();
      return {};
    });

    // ── Update Unread Count ────
    // Note: notification badge is updated via the 'newNotification' socket event
    // (emitted after the DB record is confirmed) — NOT here. Doing it here caused
    // a race condition where the badge incremented before the notification existed in DB.
    if (!isFromMe && isForMe && !isActiveChatOpen) {
      // No-op: badge will increment when 'newNotification' arrives
    } else {
      void useNotificationStore.getState().queryUnreadCount();
    }

    // ── Update Current Messages ────
    const isForActiveChat =
      activeChat &&
      (message.senderId === activeChat.id ||
        message.receiverId === activeChat.id);

    if (isForActiveChat) {
      const existsById = currentMessages.some((m) => m.id === message.id);
      if (existsById) return;

      const isFromMeResolved =
        message.senderId === me?.id || message.senderId === "me";

      if (isFromMeResolved) {
        const optimisticIndex = currentMessages.findIndex(
          (m) =>
            (m.senderId === me?.id || m.senderId === "me") &&
            m.content === message.content &&
            m.id.length < 10,
        );

        if (optimisticIndex !== -1) {
          const updatedMessages = [...currentMessages];
          updatedMessages[optimisticIndex] = {
            id: message.id,
            senderId: message.senderId,
            senderName: message.sender?.name || message.senderId,
            content: message.content,
            timestamp: parseMessageDate(message.timestamp || message.sentAt),
            isRead: message.isRead,
            isMe: true,
            messageType:
              message.messageType ??
              updatedMessages[optimisticIndex].messageType,
            reactions: message.reactions || {},
            isDeleted: message.isDeleted ?? false,
            isEdited: message.isEdited ?? false,
            replyTo:
              updatedMessages[optimisticIndex].replyTo ??
              resolveReplyTo(message.replyToId),
            deliveryStatus: "sent",
            attachment:
              normalizeMediaUrl(message.attachment) ??
              updatedMessages[optimisticIndex].attachment ??
              null,
            attachmentType:
              message.attachmentType ??
              updatedMessages[optimisticIndex].attachmentType,
            attachmentFilename:
              message.attachmentFilename ??
              updatedMessages[optimisticIndex].attachmentFilename,
            attachmentDuration:
              message.attachmentDuration ??
              updatedMessages[optimisticIndex].attachmentDuration,
            attachmentAmplitude:
              message.attachmentAmplitude ??
              updatedMessages[optimisticIndex].attachmentAmplitude,
          };
          set({ currentMessages: updatedMessages });
          return;
        }
      }

      const formattedMsg: IMessage = {
        id: message.id || Math.random().toString(36).substring(7),
        senderId: message.senderId,
        senderName: message.sender?.name || message.senderId,
        content: message.content,
        timestamp: parseMessageDate(message.timestamp || message.sentAt),
        isRead: message.isRead,
        isMe:
          message.isMe ||
          message.senderId === me?.id ||
          message.senderId === "me",
        messageType: message.messageType,
        reactions: message.reactions || {},
        isDeleted: message.isDeleted ?? false,
        isEdited: message.isEdited ?? false,
        replyTo: resolveReplyTo(message.replyToId),
        deliveryStatus: undefined,
        attachment: normalizeMediaUrl(message.attachment) ?? null,
        attachmentType: message.attachmentType ?? undefined,
        attachmentFilename: message.attachmentFilename ?? undefined,
        attachmentDuration: message.attachmentDuration ?? undefined,
        attachmentAmplitude: message.attachmentAmplitude ?? undefined,
      };

      set({ currentMessages: [...currentMessages, formattedMsg] });
    }
  });

  // ── Typing Indicator ────────────────────────────────────────────────────
  socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
    set((state: TChatState) => ({
      isTyping: { ...state.isTyping, [data.userId]: data.isTyping },
    }));
  });

  // ── Reaction Update ─────────────────────────────────────────────────────
  socket.on(
    "messageReaction",
    (data: { messageId: string; reactions: Record<string, string> }) => {
      const { currentMessages } = get();
      const exists = currentMessages.some((m) => m.id === data.messageId);
      if (exists) {
        set({
          currentMessages: currentMessages.map((m) =>
            m.id === data.messageId ? { ...m, reactions: data.reactions } : m,
          ),
        });
      }
    },
  );

  // ── Message Read Receipt ────────────────────────────────────────────────
  socket.on("messageRead", (data: { messageId: string; readerId?: string }) => {
    const { currentMessages, activeChat } = get();
    const msg = currentMessages.find((m) => m.id === data.messageId);
    if (msg) {
      set({
        currentMessages: currentMessages.map((m) =>
          m.id === data.messageId
            ? { ...m, isRead: true, deliveryStatus: "seen" }
            : m,
        ),
      });
    }

    const readerId = data.readerId ?? activeChat?.id;
    if (readerId) {
      set((state: TChatState) => ({
        activeChats: state.activeChats.map((c) =>
          c.id === readerId ? { ...c, isRead: true, unread: 0 } : c,
        ),
      }));
    }
  });

  // ── Online and Offline Status ─────────────────────────────────────────────
  socket.on("userStatus", (data: { userId: string; status: string }) => {
    const isOnline = data.status === "online";
    set((state: TChatState) => ({
      onlineUsers: { ...state.onlineUsers, [data.userId]: isOnline },
      activeChats: state.activeChats.map((chat) =>
        chat.id === data.userId ? { ...chat, isOnline } : chat,
      ),
      activeChat:
        state.activeChat?.id === data.userId
          ? { ...state.activeChat, isOnline }
          : state.activeChat,
    }));
  });

  // ── Soft-Delete Broadcast ───────────────────────────────────────────────
  socket.on("messageDeleted", (data: { messageId: string }) => {
    const { currentMessages } = get();
    const exists = currentMessages.some((m) => m.id === data.messageId);
    if (exists) {
      set({
        currentMessages: currentMessages.map((m) =>
          m.id === data.messageId ? { ...m, isDeleted: true } : m,
        ),
      });
    }
  });

  // ── Edit Broadcast ───────────────────────────────────────────────────────
  socket.on(
    "messageEdited",
    (data: { messageId: string; newContent: string; isEdited: boolean }) => {
      const { currentMessages } = get();
      const exists = currentMessages.some((m) => m.id === data.messageId);
      if (exists) {
        set({
          currentMessages: currentMessages.map((m) =>
            m.id === data.messageId
              ? { ...m, content: data.newContent, isEdited: true }
              : m,
          ),
        });
      }
    },
  );

  // ── New Notification ─────────────────────────────────────────────────────
  // Fired by the server AFTER the notification record is confirmed saved in DB.
  // This is the single source of truth for badge + list updates — no race condition.
  socket.on("newNotification", (notification: any) => {
    if (notification?.id) {
      useNotificationStore.getState().addNotification(notification);
    }
  });

  socket.on("error", (error: any) => {
    console.error("Socket error:", error?.message || error || "Unknown");
  });
};
