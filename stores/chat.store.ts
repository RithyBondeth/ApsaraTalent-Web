import io from "socket.io-client";
import { create } from "zustand";
import { IChatPreview, IMessage } from "@/components/message/props";
import { formatSidebarTime, parseMessageDate } from "@/utils/date";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import axios from "@/lib/axios";
import { getCookie } from "cookies-next";
import {
  getApiOrigin,
  normalizeMediaUrl,
} from "@/utils/functions/normalize-media-url";

type SocketInstance = ReturnType<typeof io>;

// ── Module-level socket singleton ───────────────────────────────────────────
// Kept OUTSIDE the Zustand store so React StrictMode's double-invoke
// (mount → cleanup → mount) doesn't destroy the socket between the two mounts.
//
// Problem: In development, React StrictMode calls every useEffect cleanup
// immediately after the first mount, then remounts.  If connect/disconnect
// lived purely inside the store, the cleanup `disconnect()` from the first
// mount would call socket.disconnect() while the WebSocket handshake was
// still in-flight — producing "WebSocket closed before connection established"
// — and the second mount's connect() would see socket.connected=false and
// try to create a new socket, but the old one was already being torn down.
//
// Fix: the socket lives here, at module scope.  React's cleanup fires
// `disconnect()` but we use a short-delay guard (`_pendingDisconnect`) to
// cancel the actual socket teardown if `connect()` is called again within
// 80 ms.  This is exactly the StrictMode double-invoke window.
let _socket: SocketInstance | null = null;
let _pendingDisconnect: ReturnType<typeof setTimeout> | null = null;

// Helper to resolve display name and avatar from user object
const resolveProfile = (user: any) => {
  if (!user) return { name: "Unknown", avatar: "/avatars/default.png" };
  const emp = user.employee;
  const co = user.company;

  const name = emp
    ? [emp.firstname, emp.lastname].filter(Boolean).join(" ") ||
      emp.username ||
      user.email
    : co?.name || user.email;

  const avatar =
    normalizeMediaUrl(emp?.avatar || co?.avatar) || "/avatars/default.png";
  return { name, avatar };
};

// Build a short message snippet for previews (text or attachment labels).
const resolveMessageSnippet = (message: {
  content?: string | null;
  attachmentType?: string | null;
  messageType?: string | null;
  attachment?: string | null;
}) => {
  const content =
    typeof message?.content === "string" ? message.content.trim() : "";
  if (content) return content;

  const type = String(
    message?.attachmentType || message?.messageType || "",
  ).toLowerCase();
  if (type === "audio") return "Audio message";
  if (type === "image") return "Photo";
  if (type === "document") return "Attachment";
  if (type === "call") return "Call";
  if (message?.attachment) return "Attachment";
  return "";
};

// Build sidebar preview text for last message, including attachment-only messages.
const resolvePreview = (chat: any, currentUserId: string) => {
  const senderId =
    typeof chat?.sender === "string"
      ? chat.sender
      : chat.sender?.id || chat.senderId;
  const isSenderMe =
    senderId && senderId.toLowerCase() === currentUserId.toLowerCase();
  const senderProfile = typeof chat?.sender === "string" ? null : chat?.sender;
  const senderName = isSenderMe ? "You" : resolveProfile(senderProfile).name;

  const base = resolveMessageSnippet(chat) || "No messages yet";

  if (base === "No messages yet") return base;
  const prefix = senderName ? `${senderName}: ` : "";
  return `${prefix}${base}`;
};

interface ChatState {
  socket: SocketInstance | null;
  isConnected: boolean;
  isChatsLoaded: boolean; // true once getRecentChats has returned (even if empty list)
  isHistoryLoading: boolean; // true while getChatHistory is in-flight
  me: any | null; // Tracks current user profile
  activeChat: IChatPreview | null; // Tracks current conversation
  activeChats: IChatPreview[]; // List for sidebar
  currentMessages: IMessage[];
  unreadCount: number;
  isTyping: Record<string, boolean>; // ReceiverId -> isTyping

  /**
   * Live online-status map: userId → true/false.
   * Populated by 'userStatus' socket events from the server.
   * Components read this to show green / grey dots without individual subscriptions.
   */
  onlineUsers: Record<string, boolean>;

  // Actions
  connect: (user?: any) => void;
  disconnect: () => void;
  setMe: (user: any) => void;
  sendMessage: (
    receiverId: string,
    content: string,
    type?: string,
    replyTo?: IMessage["replyTo"] | null,
    attachment?: {
      url: string;
      type: "image" | "document" | "audio";
      filename: string;
      duration?: number;
      amplitude?: number[];
    } | null,
  ) => boolean;
  getRecentChats: () => void;
  getChatHistory: (userId2: string) => void;
  getUnreadCount: () => void;
  markAsRead: (messageId: string, senderId: string) => void;
  reactToMessage: (
    messageId: string,
    receiverId: string,
    emoji: string | null,
  ) => void;
  setTyping: (receiverId: string, isTyping: boolean) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
  /**
   * Soft-delete a message the current user sent.
   * Emits 'deleteMessage' to the socket; the server broadcasts 'messageDeleted'
   * back to both participants and the store listener updates the local list.
   */
  deleteMessage: (messageId: string, receiverId: string) => void;

  /**
   * Edit the text content of a message the current user sent.
   * Emits 'editMessage' to the socket; the server broadcasts 'messageEdited'
   * back to both participants and the store listener updates content + isEdited flag.
   */
  editMessage: (
    messageId: string,
    receiverId: string,
    newContent: string,
  ) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  isChatsLoaded: false,
  isHistoryLoading: false,
  me: null,
  activeChat: null,
  activeChats: [],
  currentMessages: [],
  unreadCount: 0,
  isTyping: {},
  onlineUsers: {}, // Starts empty; filled as users connect/disconnect

  setMe: (user: any) => set({ me: user }),

  connect: (user?: any) => {
    // Update `me` before anything else so callbacks have user context
    if (user) set({ me: user });

    // ── Cancel any pending StrictMode disconnect ─────────────────────────
    // If disconnect() was called < 80 ms ago (StrictMode cleanup between
    // first and second mount), cancel the teardown and reuse the live socket.
    if (_pendingDisconnect !== null) {
      clearTimeout(_pendingDisconnect);
      _pendingDisconnect = null;
    }

    // Reuse the module-level socket if it's already fully connected
    if (_socket?.connected) {
      // Sync store state in case it was cleared by the StrictMode cleanup path
      set({ isConnected: true, socket: _socket });
      get().getRecentChats();
      get().getUnreadCount();
      return;
    }

    // If a socket exists but hasn't connected yet AND hasn't been disconnected,
    // it's mid-handshake from the first StrictMode mount — wait for it.
    // The existing socket.on("connect") handler will fire when ready.
    // IMPORTANT: only reuse if _socket is truly in a "connecting" state.
    // If _socket.disconnected is true the socket is dead — fall through to create a new one.
    if (_socket && !_socket.connected && !_socket.disconnected) {
      // Still connecting — don't create a second socket, existing handlers will fire
      set({ socket: _socket });
      return;
    }

    // If we reach here, _socket is either null or in a disconnected/dead state — create fresh
    if (_socket) {
      // Clean up any stale dead socket before replacing it
      _socket.removeAllListeners();
      _socket = null;
    }

    const socketUrl = getApiOrigin();

    const socketToken = getCookie("auth-token");

    // Prefer explicit token auth in socket handshake so production does not
    // depend on third-party cookie behavior for cross-origin websocket upgrades.
    const socket: SocketInstance = io(`${socketUrl}/chat`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: socketToken ? { token: String(socketToken) } : undefined,
    } as any);

    _socket = socket;

    socket.on("connect", () => {
      // Set socket AND connected in one atomic update so getRecentChats
      // doesn't run while socket is still null in state
      set({ isConnected: true, socket });
      // Fetch sidebar + unread right after connection is stable
      get().getRecentChats();
      get().getUnreadCount();
      // Register WebRTC call signaling listeners on this socket
      // (lazy import avoids circular dependency at module level)
      import("./call.store")
        .then(({ useCallStore }) => {
          useCallStore.getState().initCallSignaling(socket);
        })
        .catch((err) => {
          console.warn("[Chat] Failed to init call signaling:", err);
        });
    });

    socket.on("connect_error", (err: Error) => {
      console.error("[Socket] Connection error:", err.message);
      set({ isConnected: false });
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("[Socket] Disconnected:", reason);
      set({ isConnected: false });
    });

    // ── Incoming new message ────────────────────────────────────────────────
    socket.on("newMessage", (message: any) => {
      const {
        activeChat,
        currentMessages,
        getRecentChats,
        getUnreadCount,
        me,
      } = get();

      // Helper: resolve the replyTo preview object from the current message list.
      // The server sends replyToId (a plain UUID); we look up the parent message
      // in the already-loaded currentMessages to get content + senderName.
      // If the parent isn't loaded yet, we fall back to a minimal placeholder
      // (id only) so the quote block can still render something.
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
        // Parent not in loaded history — return minimal placeholder so at least
        // the quote block frame renders. Content will be empty string (safe after ?? fix).
        return { id: replyToId, content: "", senderName: "", isDeleted: false };
      };

      // ── Real-time sidebar patch ──────────────────────────────────────────
      // Instead of re-fetching ALL chats (slow round-trip), surgically update
      // only the affected chat row so the sidebar reflects the new message
      // instantly: preview text, timestamp, and unread badge.
      const isFromMe = message.senderId === get().me?.id;
      const isForMe = message.receiverId === get().me?.id;
      const isActiveChatOpen =
        activeChat &&
        (message.senderId === activeChat.id ||
          message.receiverId === activeChat.id);

      // The partner is whoever is NOT me in this exchange
      const partnerId = isFromMe ? message.receiverId : message.senderId;
      const preview = resolveMessageSnippet(message) || "";
      const previewText = isFromMe ? `You: ${preview}` : preview;
      const newTime = formatSidebarTime(
        message.sentAt || message.timestamp || Date.now(),
      );
      // A message is unread if it's for me AND the chat is not currently open
      const isNewUnread = !isFromMe && isForMe && !isActiveChatOpen;

      set((state) => {
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
            // Bump total unread count immediately for the sidebar badge
            unreadCount: isNewUnread
              ? state.unreadCount + 1
              : state.unreadCount,
          };
        }
        // Partner not yet in sidebar — trigger a full fetch to add them
        getRecentChats();
        return {};
      });

      // ── Notification bell badge — real-time update ───────────────────────
      // Only bump the badge when:
      //  (a) the message was sent by someone else (not me), AND
      //  (b) the receiver is the current user (message is for me), AND
      //  (c) the chat is NOT currently open (if I'm reading it, no unread badge needed)
      if (!isFromMe && isForMe && !isActiveChatOpen) {
        // Increment immediately so the badge reacts the instant the message arrives
        useNotificationStore.getState().incrementUnreadCount();
      } else {
        // If the chat is open or it's my own message, sync the true count from API
        // to correct any drift (e.g. mark-as-read just happened)
        void useNotificationStore.getState().fetchUnreadCount();
      }

      // Only add to current message list if it belongs to the ACTIVE chat
      const isForActiveChat =
        activeChat &&
        (message.senderId === activeChat.id ||
          message.receiverId === activeChat.id);

      if (isForActiveChat) {
        // 1. Exact ID check (prevents duplicates from synced tabs or resolved callbacks)
        const existsById = currentMessages.some((m) => m.id === message.id);
        if (existsById) return;

        // 2. Optimistic match — replace the temp message with the real one from server.
        // Optimistic IDs are short random strings (< 10 chars); real IDs are UUIDs.
        const isFromMe =
          message.senderId === me?.id || message.senderId === "me";

        if (isFromMe) {
          const optimisticIndex = currentMessages.findIndex(
            (m) =>
              (m.senderId === me?.id || m.senderId === "me") &&
              m.content === message.content &&
              m.id.length < 10, // Optimistic IDs are short (random36/7)
          );

          if (optimisticIndex !== -1) {
            // Swap optimistic → real message.
            // deliveryStatus upgrades: 'sending' → 'sent' once the server echoes back
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
              // Preserve the replyTo object that was already on the optimistic message
              // (built from the live replyTarget in MessageInput). Only resolve from
              // the ID as a fallback if the optimistic message somehow lost it.
              replyTo:
                updatedMessages[optimisticIndex].replyTo ??
                resolveReplyTo(message.replyToId),
              deliveryStatus: "sent", // Server confirmed → upgrade from 'sending'
              // Preserve optimistic attachment fields (already shown locally);
              // the server echoes back the same URL so no flicker.
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

        // 3. Add fresh incoming message
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
          // Resolve replyTo from loaded messages using the UUID the server sent.
          // Previously we stored the raw UUID string here, which caused the
          // quote block header (senderName) to be undefined and appear blank.
          replyTo: resolveReplyTo(message.replyToId),
          // New incoming message from the partner has no delivery state
          // (delivery state is only relevant for outgoing messages)
          deliveryStatus: undefined,
          // Attachment fields from the server payload
          attachment: normalizeMediaUrl(message.attachment) ?? null,
          attachmentType: message.attachmentType ?? undefined,
          attachmentFilename: message.attachmentFilename ?? undefined,
          attachmentDuration: message.attachmentDuration ?? undefined,
          attachmentAmplitude: message.attachmentAmplitude ?? undefined,
        };

        set({ currentMessages: [...currentMessages, formattedMsg] });
      }
    });

    // ── Typing indicator ────────────────────────────────────────────────────
    socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
      set((state) => ({
        isTyping: { ...state.isTyping, [data.userId]: data.isTyping },
      }));
    });

    // ── Reaction update ─────────────────────────────────────────────────────
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

    // ── Message read receipt ────────────────────────────────────────────────
    // When the recipient opens a chat and reads the last message, the server
    // fires 'messageRead' back to the sender. We upgrade deliveryStatus → 'seen'
    // and set isRead=true on the local message so the ✓✓ turns blue.
    socket.on(
      "messageRead",
      (data: { messageId: string; readerId?: string }) => {
        const { currentMessages, activeChat } = get();

        // Update the message bubble: delivery status → "seen", isRead → true
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

        // Also patch the sidebar row so the ✓✓ tick turns green instantly
        // and the bold/unread indicator clears for the reader's side
        const readerId = data.readerId ?? activeChat?.id;
        if (readerId) {
          set((state) => ({
            activeChats: state.activeChats.map((c) =>
              c.id === readerId ? { ...c, isRead: true, unread: 0 } : c,
            ),
          }));
        }
      },
    );

    // ── Online / offline status ─────────────────────────────────────────────
    // Server emits 'userStatus' on every connect and disconnect.
    // We maintain a simple userId → boolean map (onlineUsers).
    // Both the sidebar and the chat header read this map to show the green dot.
    //
    // IMPORTANT: This event may fire before getRecentChats has populated
    // activeChats (race condition on initial load).  We always write to
    // onlineUsers first — then getRecentChats reads onlineUsers when it
    // builds each IChatPreview, so the dot will be correct even if this
    // event arrives early.  The activeChats.map() update handles live
    // changes that arrive AFTER the sidebar is already rendered.
    socket.on("userStatus", (data: { userId: string; status: string }) => {
      const isOnline = data.status === "online";

      set((state) => ({
        // Always persist in the map — this is the source of truth
        onlineUsers: { ...state.onlineUsers, [data.userId]: isOnline },
        // Patch sidebar rows that are already rendered
        activeChats: state.activeChats.map((chat) =>
          chat.id === data.userId ? { ...chat, isOnline } : chat,
        ),
        // Patch the open chat header in real time
        activeChat:
          state.activeChat?.id === data.userId
            ? { ...state.activeChat, isOnline }
            : state.activeChat,
      }));
    });

    // ── Soft-delete broadcast ───────────────────────────────────────────────
    // Server broadcasts 'messageDeleted' to both sender and receiver.
    // We mark the local message as isDeleted=true so the tombstone renders
    // without needing to re-fetch the entire history.
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

    // ── Edit broadcast ───────────────────────────────────────────────────────
    // Server broadcasts 'messageEdited' to both sender and receiver.
    // We update the local message's content and mark isEdited=true so the
    // "(edited)" label appears without needing to re-fetch history.
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

    socket.on("error", (error: any) => {
      console.error("Socket error:", error?.message || error || "Unknown");
    });

    set({ socket });
  },

  disconnect: () => {
    // ── StrictMode-safe disconnect ───────────────────────────────────────
    // React StrictMode calls cleanup (disconnect) then immediately remounts
    // (connect) within ~1 ms.  We defer the actual teardown by 80 ms so
    // connect() can cancel it before it fires.  On a real unmount (navigation,
    // logout) connect() is never called again, so the teardown runs normally.
    if (_pendingDisconnect !== null) return; // Already scheduled

    _pendingDisconnect = setTimeout(() => {
      _pendingDisconnect = null;
      // Null out _socket BEFORE calling disconnect() so that any concurrent
      // connect() call that fires during the async teardown doesn't try to
      // reuse the half-closed socket (which would leave isConnected=false
      // forever because no new socket.on("connect") is ever registered).
      const socketToClose = _socket;
      _socket = null;
      if (socketToClose) {
        socketToClose.disconnect();
      }
      set({
        socket: null,
        isConnected: false,
        isChatsLoaded: false,
        isHistoryLoading: false,
        activeChats: [],
        currentMessages: [],
        onlineUsers: {}, // Reset online map on disconnect
        // activeChat intentionally NOT reset here — the URL sync effect re-evaluates
        // it when isConnected / isChatsLoaded flip back to true on reconnect.
        // Resetting it here would unmount ChatInput mid-render causing it to disappear.
      });
    }, 80);
  },

  /**
   * Send a message with optional reply-to context and/or file attachment.
   *
   * Flow:
   *  1. An optimistic message is inserted immediately into currentMessages
   *     with deliveryStatus='sending' so the user sees instant feedback.
   *  2. The socket emits 'sendMessage'. The server callback returns the real DB ID.
   *  3. We swap the temp ID for the real ID and upgrade deliveryStatus → 'sent'.
   *     (If the server already broadcast 'newMessage' first, the optimistic
   *      entry is removed to avoid a duplicate.)
   *
   * Attachments are pre-uploaded via POST /api/chat/upload before this is called.
   * The `attachment` param holds the server's response { url, type, filename }.
   */
  sendMessage: (
    receiverId: string,
    content: string,
    type = "text",
    replyTo?: IMessage["replyTo"] | null,
    attachment?: {
      url: string;
      type: "image" | "document" | "audio";
      filename: string;
      duration?: number;
      amplitude?: number[];
    } | null,
  ) => {
    const { socket, currentMessages, me } = get();
    if (!socket?.connected) {
      console.warn(
        "[Chat] sendMessage: socket not connected — message not sent",
      );
      return false;
    }

    // Derive message type from attachment before building optimistic message
    const resolvedType = attachment?.type ?? type;

    // Build optimistic message — shown instantly before the server responds
    const tempId = Math.random().toString(36).substring(7);
    const optimisticMsg: IMessage = {
      id: tempId,
      senderId: me?.id || "me",
      content,
      timestamp: new Date(),
      isMe: true,
      isRead: false,
      messageType: resolvedType,
      deliveryStatus: "sending", // Clock icon — waiting for server ack
      replyTo: replyTo ?? undefined, // Inline quote block (if replying)
      // Attachment fields — shown immediately via local preview URL while ack awaits
      attachment: normalizeMediaUrl(attachment?.url) ?? null,
      attachmentType: attachment?.type ?? undefined,
      attachmentFilename: attachment?.filename ?? undefined,
      attachmentDuration: attachment?.duration ?? undefined,
      attachmentAmplitude: attachment?.amplitude ?? undefined,
    };

    set({ currentMessages: [...currentMessages, optimisticMsg] });

    // Emit to server; replyToId carries the parent UUID so the DB stores the link.
    // attachment carries the pre-uploaded URL so the server saves it to the DB.
    // attachmentFilename carries the original name so the receiver sees "report.pdf"
    // instead of a UUID path — the server includes it in the 'newMessage' broadcast.
    // Derive messageType from the attachment — the server uses this to set the
    // messageType enum column which we later read back as attachmentType.
    socket.emit(
      "sendMessage",
      {
        receiverId,
        content,
        type: resolvedType,
        replyToId: replyTo?.id ?? null,
        attachment: normalizeMediaUrl(attachment?.url) ?? null,
        attachmentFilename: attachment?.filename ?? null,
        attachmentDuration: attachment?.duration ?? null,
        attachmentAmplitude: attachment?.amplitude ?? null,
      },
      (response: any) => {
        const realId = response?.message?.id;
        if (realId) {
          set((state) => {
            // If the socket broadcast arrived before this ack (race condition),
            // the real message is already in the list → just remove the temp entry
            const alreadyExists = state.currentMessages.some(
              (m) => m.id === realId,
            );

            if (alreadyExists) {
              return {
                currentMessages: state.currentMessages.filter(
                  (msg) => msg.id !== tempId,
                ),
              };
            }

            // Normal path: swap tempId → realId and upgrade delivery status
            return {
              currentMessages: state.currentMessages.map((msg) =>
                msg.id === tempId
                  ? { ...msg, id: realId, deliveryStatus: "sent" as const }
                  : msg,
              ),
            };
          });
        }
      },
    );

    return true;
  },

  getRecentChats: () => {
    const { socket, me } = get();
    if (!socket?.connected || !me) {
      // Mark chats as loaded even if we can't fetch so the UI doesn't block
      set({ isChatsLoaded: true });
      return;
    }

    const applyRecentChats = (chats: any[]) => {
      const currentUserId = me.id;
      const seenPartners = new Map<string, IChatPreview>();
      // Count unread messages per partner (messages sent TO me that I haven't read)
      const unreadPerPartner = new Map<string, number>();

      chats.forEach((chat: any) => {
        // Robust ID resolution: handle both nested objects and scalar IDs
        const senderId =
          typeof chat.sender === "string"
            ? chat.sender
            : chat.sender?.id || chat.senderId;
        const receiverId =
          typeof chat.receiver === "string"
            ? chat.receiver
            : chat.receiver?.id || chat.receiverId;

        const isSenderMe =
          senderId?.toLowerCase() === currentUserId.toLowerCase();
        const otherUser = isSenderMe ? chat.receiver : chat.sender;

        const partnerId = isSenderMe ? receiverId : senderId;
        if (!partnerId) return;

        // Count unread: messages FROM partner TO me that are not yet read
        if (!isSenderMe && chat.isRead === false) {
          unreadPerPartner.set(
            partnerId,
            (unreadPerPartner.get(partnerId) ?? 0) + 1,
          );
        }

        if (!seenPartners.has(partnerId)) {
          const { name, avatar } = resolveProfile(otherUser);
          // Carry over existing isOnline state from the onlineUsers map
          const isOnline = get().onlineUsers[partnerId] ?? false;
          seenPartners.set(partnerId, {
            id: partnerId,
            name,
            avatar,
            preview: resolvePreview(chat, currentUserId),
            time: formatSidebarTime(
              chat.sentAt || chat.sendAt || chat.createdAt || Date.now(),
            ),
            isRead: chat.isRead,
            lastMessageSenderId: senderId,
            isOnline, // Preserve live dot from onlineUsers map
            unread: 0, // will be filled in below
          });
        }
      });

      // Attach the computed unread counts to each chat row
      for (const [partnerId, count] of unreadPerPartner) {
        const chat = seenPartners.get(partnerId);
        if (chat) seenPartners.set(partnerId, { ...chat, unread: count });
      }

      const builtChats = Array.from(seenPartners.values());

      set({
        activeChats: builtChats,
        isChatsLoaded: true,
      });

      // ── Fetch live online status for all partners ────────────────────────
      // Problem this solves:
      //   The 'userStatus' event is only emitted when a user connects or
      //   disconnects.  If the partner was ALREADY online before WE connected,
      //   we missed that event entirely.  The server keeps an in-memory
      //   connectedUsers Set, so we ask it: "which of these IDs are online?"
      //   and merge the result into our local onlineUsers map + activeChats.
      //
      // We call this inside the getRecentChats callback (not in connect())
      // because we need the partner list to exist first — otherwise we have
      // no IDs to query.
      const partnerIds = builtChats.map((c) => c.id);
      if (partnerIds.length > 0) {
        const currentSocket = get().socket;
        if (currentSocket?.connected) {
          currentSocket.emit(
            "getOnlineUsers",
            partnerIds,
            (onlineMap: Record<string, boolean>) => {
              if (!onlineMap || typeof onlineMap !== "object") return;

              // Merge server ground-truth into the local onlineUsers map
              set((state) => ({
                onlineUsers: { ...state.onlineUsers, ...onlineMap },
                // Patch isOnline on each chat row in the sidebar
                activeChats: state.activeChats.map((chat) => ({
                  ...chat,
                  isOnline: onlineMap[chat.id] ?? chat.isOnline ?? false,
                })),
                // Patch activeChat header too if it's one of the queried IDs
                activeChat:
                  state.activeChat &&
                  onlineMap[state.activeChat.id] !== undefined
                    ? {
                        ...state.activeChat,
                        isOnline: onlineMap[state.activeChat.id],
                      }
                    : state.activeChat,
              }));
            },
          );
        }
      }
    };

    const fallbackFetchRecentChats = async () => {
      try {
        const response = await axios.get(`${getApiOrigin()}/chat/recent`);
        if (Array.isArray(response.data)) {
          applyRecentChats(response.data);
          return;
        }
      } catch (error) {
        console.error("[Chat] REST fallback for recent chats failed:", error);
      }

      // Keep any previously loaded chats if they exist; only hard-reset on first load.
      if (get().activeChats.length === 0) {
        set({ activeChats: [], isChatsLoaded: true });
      } else {
        set({ isChatsLoaded: true });
      }
    };

    socket.timeout(10000).emit(
      "getRecentChats",
      (error: Error | null, chats: any[]) => {
        if (error) {
          console.warn("[Chat] getRecentChats socket timeout, using REST fallback");
          void fallbackFetchRecentChats();
          return;
        }

        if (!Array.isArray(chats)) {
          void fallbackFetchRecentChats();
          return;
        }

        // Production hardening: if WS returns empty on first load, try REST once.
        if (chats.length === 0 && get().activeChats.length === 0) {
          void fallbackFetchRecentChats();
          return;
        }

        applyRecentChats(chats);
      },
    );
  },

  getChatHistory: (userId2: string) => {
    const { socket, me } = get();
    if (!socket?.connected || !me) return;

    // Signal loading — only clear currentMessages if not already loading for this chat.
    // setActiveChat now sets isHistoryLoading=true atomically, so on a fresh chat switch
    // this is a no-op (isHistoryLoading is already true). This prevents a double-clear
    // if getChatHistory is called directly after setActiveChat.
    if (!get().isHistoryLoading) {
      set({ isHistoryLoading: true, currentMessages: [] });
    }

    socket.emit(
      "getChatHistory",
      { userId2, limit: 50 },
      (
        res:
          | { messages: any[]; partnerId: string; partnerProfile: any }
          | any[],
      ) => {
        const history = Array.isArray(res) ? res : res?.messages || [];
        const resolvedPartnerId = Array.isArray(res) ? null : res?.partnerId;
        const partnerProfile = Array.isArray(res) ? null : res?.partnerProfile;

        // Race condition guard: if user switched chats while request was in-flight, discard.
        // Compare against userId2 (the original input we emitted) only — NOT resolvedPartnerId.
        // resolvedPartnerId is the server's resolved User PK, which may differ from the
        // employee/company ID stored in activeChat.id, causing a false positive discard.
        const currentActiveChat = get().activeChat;
        if (
          currentActiveChat &&
          currentActiveChat.id.toLowerCase() !== userId2.toLowerCase()
        ) {
          set({ isHistoryLoading: false });
          return;
        }

        if (Array.isArray(history)) {
          const meId = get().me?.id || me.id;
          const formatted = history.map((msg) => {
            const senderId =
              typeof msg.sender === "string"
                ? msg.sender
                : msg.sender?.id || msg.senderId;

            // For history messages: derive deliveryStatus from isRead
            // We don't have 'sending' state in history — all stored messages are 'sent'.
            // If the message is mine and was read, show 'seen'; otherwise 'sent'.
            const isMine = senderId?.toLowerCase() === meId.toLowerCase();
            const deliveryStatus: IMessage["deliveryStatus"] = isMine
              ? msg.isRead
                ? "seen"
                : "sent"
              : undefined; // Partner's messages don't show delivery state on our side

            return {
              id: msg.id,
              senderId,
              senderName: msg.senderName,
              content: msg.content,
              timestamp: parseMessageDate(msg.sentAt || msg.createdAt),
              isMe: isMine,
              isRead: msg.isRead,
              messageType: msg.messageType,
              reactions: msg.reactions || {},
              isDeleted: msg.isDeleted ?? false,
              isEdited: msg.isEdited ?? false,
              deliveryStatus,
              // Attachment fields — persisted URL from the server
              attachment: normalizeMediaUrl(msg.attachment) ?? null,
              attachmentType:
                (msg.attachmentType as IMessage["attachmentType"]) ?? undefined,
              attachmentFilename: msg.attachmentFilename ?? undefined,
              attachmentDuration: msg.attachmentDuration ?? undefined,
              attachmentAmplitude: msg.attachmentAmplitude ?? undefined,
              // replyTo is built below if replyToId is present and resolvable from history
              // For now we attach a minimal placeholder; a future enhancement could
              // resolve the full preview by looking up msg.replyToId in the history array.
              replyTo: undefined as IMessage["replyTo"],
            };
          });

          // Second pass: resolve replyTo previews from within the loaded history batch.
          // If the parent message is not in this page of history, replyTo stays undefined.
          const messageById = new Map(formatted.map((m) => [m.id, m]));
          const withReplies: IMessage[] = formatted.map((msg, _i) => {
            const rawMsg = history[_i]; // raw from server
            if (!rawMsg.replyToId) return msg;

            const parent = messageById.get(rawMsg.replyToId);
            if (!parent) return msg; // Parent not in this page — skip

            const preview = parent.isDeleted
              ? "This message was deleted"
              : resolveMessageSnippet(parent) || "Message";
            return {
              ...msg,
              replyTo: {
                id: parent.id,
                content: preview,
                senderName: parent.senderName || (parent.isMe ? "You" : ""),
                isDeleted: parent.isDeleted,
              },
            };
          });

          // Update chat header profile if it was in skeleton "Loading..." state
          const latestActiveChat = get().activeChat;
          const isLoadingName = latestActiveChat?.name === "Loading...";

          if (latestActiveChat && isLoadingName && partnerProfile) {
            const { name, avatar } = resolveProfile(partnerProfile);
            set({
              activeChat: {
                ...latestActiveChat,
                name,
                avatar,
              },
              currentMessages: withReplies,
              isHistoryLoading: false,
            });
          } else {
            set({ currentMessages: withReplies, isHistoryLoading: false });
          }
        } else {
          set({ isHistoryLoading: false });
        }
      },
    );
  },

  getUnreadCount: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("getUnreadCount", null, (res: any) => {
        if (typeof res?.unreadCount === "number") {
          set({ unreadCount: res.unreadCount });
        }
      });
    }
  },

  setActiveChat: (chat: IChatPreview | null) => {
    const prevChat = get().activeChat;
    const isSameChat =
      chat && prevChat && prevChat.id.toLowerCase() === chat.id.toLowerCase();

    // Fetch history when:
    //  (a) switching to a new/different chat, OR
    //  (b) same chat but currentMessages is empty (reconnect wiped them)
    const isNewChat = chat && !isSameChat;
    const needsRefetch = isSameChat && get().currentMessages.length === 0;

    // Guard: if we're already loading this exact chat (e.g. URL sync called setActiveChat
    // twice for the same chatId), don't start a second concurrent getChatHistory request.
    const alreadyLoadingThisChat = isSameChat && get().isHistoryLoading;

    if (!chat) {
      // Clearing the active chat — reset all related state atomically
      set({ activeChat: null, currentMessages: [], isHistoryLoading: false });
      return;
    }

    if (isNewChat) {
      // Switching to a new chat: atomically set activeChat AND start the loading state
      // in ONE store update so the UI never sees activeChat=X with stale messages from
      // the previous chat (avoids a flash of old content before the spinner appears).
      set({ activeChat: chat, isHistoryLoading: true, currentMessages: [] });
      get().getChatHistory(chat.id);
    } else if (needsRefetch && !alreadyLoadingThisChat) {
      // Same chat but messages were wiped (e.g. after reconnect). Re-fetch silently.
      set({ activeChat: chat, isHistoryLoading: true, currentMessages: [] });
      get().getChatHistory(chat.id);
    } else {
      // Same chat with messages already loaded (or loading in progress) — just update
      // the chat metadata (e.g. name/avatar resolved from "Loading..." skeleton).
      set({ activeChat: chat });
    }

    // Refresh online status for this specific partner whenever we open a chat.
    // This catches the case where:
    //  (a) getRecentChats ran but getOnlineUsers callback hadn't arrived yet, or
    //  (b) the user navigates to a chat by URL (chatId param) without the partner
    //      being in the sidebar yet.
    const { socket } = get();
    if (socket?.connected) {
      socket.emit(
        "getOnlineUsers",
        [chat.id],
        (onlineMap: Record<string, boolean>) => {
          if (!onlineMap || typeof onlineMap !== "object") return;
          const isOnline = onlineMap[chat.id] ?? false;
          set((state) => ({
            onlineUsers: { ...state.onlineUsers, [chat.id]: isOnline },
            activeChat:
              state.activeChat?.id === chat.id
                ? { ...state.activeChat, isOnline }
                : state.activeChat,
            activeChats: state.activeChats.map((c) =>
              c.id === chat.id ? { ...c, isOnline } : c,
            ),
          }));
        },
      );
    }
  },

  markAsRead: (messageId: string, senderId: string) => {
    const { socket, activeChat } = get();
    if (socket?.connected) {
      socket.emit("markAsRead", { messageId, senderId });

      // ── Optimistic local updates ─────────────────────────────────────────
      // 1. Mark all unread incoming messages in this chat as read locally
      //    so the sidebar badge and bold name clear immediately.
      if (activeChat) {
        set((state) => ({
          // Clear unread count + set isRead on the active chat row
          activeChats: state.activeChats.map((c) =>
            c.id === activeChat.id ? { ...c, isRead: true, unread: 0 } : c,
          ),
          // Mark all incoming messages as read in the open conversation
          currentMessages: state.currentMessages.map((m) =>
            !m.isMe && !m.isRead ? { ...m, isRead: true } : m,
          ),
        }));
      }

      // 2. Recompute total unread count from the updated activeChats list
      const updatedChats = get().activeChats;
      const me = get().me;
      const newUnread = updatedChats.reduce((sum, c) => {
        const isUnread = c.isRead === false && c.lastMessageSenderId !== me?.id;
        return sum + (isUnread ? (c.unread ?? 1) : 0);
      }, 0);
      set({ unreadCount: newUnread });

      // 3. Sync notification store
      useNotificationStore.getState().markReadByChatMessageId(messageId);
    }
  },

  reactToMessage: (
    messageId: string,
    receiverId: string,
    emoji: string | null,
  ) => {
    const { socket } = get();
    if (socket?.connected)
      socket.emit("react", { messageId, receiverId, emoji });
  },

  setTyping: (receiverId: string, isTyping: boolean) => {
    const { socket } = get();
    if (socket?.connected) socket.emit("typing", { receiverId, isTyping });
  },

  /**
   * Soft-delete a message.
   *
   * The store does an optimistic update immediately:
   *  1. The local message is marked isDeleted=true so the tombstone appears instantly.
   *  2. The socket emits 'deleteMessage' to the server.
   *  3. The server broadcasts 'messageDeleted' back to both participants.
   *     The socket listener in connect() handles the broadcast (idempotent update).
   *
   * If the server rejects the delete (e.g. not the sender), the socket will emit
   * an 'error' event and the optimistic update stays visible — in a future iteration
   * we could rollback by re-fetching history on error.
   */
  deleteMessage: (messageId: string, receiverId: string) => {
    const { socket, currentMessages } = get();
    if (!socket?.connected) return;

    // Optimistic update: show tombstone immediately
    set({
      currentMessages: currentMessages.map((m) =>
        m.id === messageId ? { ...m, isDeleted: true } : m,
      ),
    });

    // Tell the server to soft-delete and broadcast to both participants
    socket.emit("deleteMessage", { messageId, receiverId });
  },

  /**
   * Edit the text content of a message the current user sent.
   *
   * The store does an optimistic update immediately:
   *  1. The local message content is updated and isEdited=true is set so the
   *     "(edited)" label appears instantly.
   *  2. The socket emits 'editMessage' to the server.
   *  3. The server broadcasts 'messageEdited' back to both participants.
   *     The socket listener in connect() handles the broadcast (idempotent update).
   */
  editMessage: (messageId: string, receiverId: string, newContent: string) => {
    const { socket, currentMessages } = get();
    if (!socket?.connected) return;

    // Optimistic update: show new content + "(edited)" label immediately
    set({
      currentMessages: currentMessages.map((m) =>
        m.id === messageId ? { ...m, content: newContent, isEdited: true } : m,
      ),
    });

    // Tell the server to update and broadcast to both participants
    socket.emit("editMessage", { messageId, receiverId, newContent });
  },
}));
