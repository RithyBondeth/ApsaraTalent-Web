import type { StoreApi } from "zustand";
import type { INotification } from "@/utils/interfaces/notification/notification.interface";
import type { TChatProfile, TChatState, SocketInstance } from "./types";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";
import { parseRawChatMessage, resolveMessageSnippet } from "./utils";
import { formatSidebarTime, parseMessageDate } from "@/utils/functions/date";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { normalizeMediaUrl } from "@/utils/functions/media";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { toast } from "sonner";

/* ------------------------------------- Unmatch Suppression -------------------------------- */
/* 
  Module-level flag: set by the initiating party right before calling the unmatch API,
  cleared when the resulting socket event is processed.  This reliably prevents the
  initiator from seeing the "You have been unmatched" toast that is meant for the
  OTHER party — timing-safe because it is set BEFORE the API call, not after.
*/
let _suppressUnmatchToast = false;

// ── Mark Unmatch Initiated ─────────────────────────────────────────────
export function markUnmatchInitiated() {
  _suppressUnmatchToast = true;
}

/* ------------------------------------- Helper Functions ---------------------------------- */
// ── Silent Refetch Interviews ────────────────────────────────────────────
function silentRefetchInterviews() {
  const user = useGetCurrentUserStore.getState().user;
  const role = user?.role;
  const id =
    role === USER_ROLE.EMPLOYEE ? user?.employee?.id : user?.company?.id;
  if (role && id) {
    void useInterviewStore.getState().silentRefetch(id, role);
  }
}

// ── Silent Refetch Matching List ─────────────────────────────────────────
function silentRefetchMatchingList() {
  const user = useGetCurrentUserStore.getState().user;
  const role = user?.role;
  const id =
    role === USER_ROLE.EMPLOYEE ? user?.employee?.id : user?.company?.id;
  if (!role || !id) return;
  if (role === USER_ROLE.EMPLOYEE) {
    void useGetCurrentEmployeeMatchingStore.getState().silentRefetch(id);
  } else {
    void useGetCurrentCompanyMatchingStore.getState().silentRefetch(id);
  }
}

// ── Increment Matching Count ─────────────────────────────────────────────
function incrementMatchingCount() {
  const user = useGetCurrentUserStore.getState().user;
  if (user?.role === USER_ROLE.EMPLOYEE) {
    useCountCurrentEmployeeMatchingStore.getState().incrementCount();
  } else if (user?.role === USER_ROLE.COMPANY) {
    useCountCurrentCompanyMatchingStore.getState().incrementCount();
  }
}

// ── Decrement Matching Count ─────────────────────────────────────────────
function decrementMatchingCount() {
  const user = useGetCurrentUserStore.getState().user;
  if (user?.role === USER_ROLE.EMPLOYEE) {
    useCountCurrentEmployeeMatchingStore.getState().decrementCount();
  } else if (user?.role === USER_ROLE.COMPANY) {
    useCountCurrentCompanyMatchingStore.getState().decrementCount();
  }
}

function isNotification(value: unknown): value is INotification {
  if (!value || typeof value !== "object") return false;
  const notification = value as Record<string, unknown>;
  return (
    typeof notification.id === "string" &&
    typeof notification.title === "string" &&
    typeof notification.message === "string" &&
    (typeof notification.type === "string" || notification.type === null) &&
    typeof notification.isRead === "boolean" &&
    typeof notification.createdAt === "string" &&
    typeof notification.updatedAt === "string" &&
    (notification.data === null ||
      (typeof notification.data === "object" &&
        !Array.isArray(notification.data)))
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown";
}

function getSenderName(
  sender: string | TChatProfile | null | undefined,
  senderId: string | undefined,
): string {
  return (typeof sender === "string" ? sender : sender?.name) ?? senderId ?? "";
}

/* ------------------------------------ Socket Listeners ------------------------------------ */
// ── Register Socket Listeners ─────────────────────────────────────────────
export const registerSocketListeners = (
  socket: SocketInstance,
  set: StoreApi<TChatState>["setState"],
  get: () => TChatState,
) => {
  // ── Incoming New Message ────────────────────────────────────────────────
  socket.on("newMessage", (payload: unknown) => {
    const message = parseRawChatMessage(payload);
    if (!message) return;
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
      message.sentAt || message.timestamp || new Date(),
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
    /* 
      The notification badge is updated exclusively via the 'newNotification'
      socket event (emitted after the DB record is confirmed).  Calling
      queryUnreadCount() here would fire on EVERY message — including every
      message the user sends — causing one unnecessary network round-trip per
      message.  The 'newNotification' event is the single source of truth.
    */

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
            senderId: message.senderId ?? "",
            senderName: getSenderName(message.sender, message.senderId),
            content: message.content ?? "",
            timestamp: parseMessageDate(
              message.timestamp || message.sentAt || new Date(),
            ),
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
        senderId: message.senderId ?? "",
        senderName: getSenderName(message.sender, message.senderId),
        content: message.content ?? "",
        timestamp: parseMessageDate(
          message.timestamp || message.sentAt || new Date(),
        ),
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
  socket.on("newNotification", (notification: unknown) => {
    if (isNotification(notification)) {
      useNotificationStore.getState().addNotification(notification);
    }
    // New mutual match → bump the matching badge + refresh the matching list
    if (isNotification(notification) && notification.type === "match") {
      incrementMatchingCount();
      silentRefetchMatchingList();
    }
    // New interview → refresh the interview list + badge
    if (isNotification(notification) && notification.type === "interview") {
      silentRefetchInterviews();
    }
  });

  // ── Badge Increment ───────────────────────────────────────────────────────
  // Fired for match/like/interview notifications where only the badge count
  // needs immediate update (full notification data is fetched lazily on open).
  socket.on("badgeIncrement", () => {
    useNotificationStore.getState().incrementUnreadCount();
  });

  // ── Interview Update ──────────────────────────────────────────────────────
  // Fired when the other party creates or changes the status of an interview.
  // Silently re-fetches so the interview page updates without a skeleton flash.
  socket.on("interviewUpdate", () => {
    silentRefetchInterviews();
  });

  // ── Unmatch Update ────────────────────────────────────────────────────────
  // Fired to BOTH parties when a match is deleted. The initiating party
  // already removed things optimistically; this event updates the OTHER party
  // so their matching list, interview list, and badge all update live.
  socket.on("unmatchUpdate", () => {
    silentRefetchMatchingList();
    silentRefetchInterviews();
    decrementMatchingCount();

    /* 
      Only notify the OTHER party — not the one who initiated the unmatch.
      _suppressUnmatchToast is set synchronously before the API call, so it
      is still true when this socket event arrives even though the API has
      already finished.
    */
    if (_suppressUnmatchToast) {
      _suppressUnmatchToast = false; // consume the flag
    } else {
      toast.info("You have been unmatched", {
        description: "Someone removed the match with you.",
        duration: 5000,
      });
    }
  });

  socket.on("error", (error: unknown) => {
    console.error("Socket error:", getErrorMessage(error));
  });
};
