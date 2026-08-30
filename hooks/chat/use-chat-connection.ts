"use client";

import { useChatStore } from "@/stores/features/chat/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useEffect } from "react";

/* --------------------------------- Usage --------------------------------- */
/**
 * Initialises the real-time chat socket for the current user, and re-syncs the
 * unread state whenever the tab is brought back to the foreground.
 *
 * Usage:
 *   // Mount once in the authenticated layout so the socket stays alive
 *   // on every page, not just /message.
 *   useChatConnection();
 */

/* ----------------------------------- Hook ----------------------------------- */
export function useChatConnection() {
  /* -------------------------------- All States -------------------------------- */
  const user = useGetCurrentUserStore((s) => s.user);

  /* --------------------------------- Effects ---------------------------------- */
  useEffect(() => {
    if (!user) {
      return;
    }

    const { connect, disconnect } = useChatStore.getState();
    connect(user);

    return () => {
      disconnect();
    };
  }, [user]);

  /*
    Re-read the unread state on focus.

    Unlike the notification and matching badges, the message count is still
    maintained locally — chat is far too chatty to re-read the total on every
    message, and the optimistic bump is what makes the badge feel instant. The
    cost is that local arithmetic can drift: a missed socket event, a message
    read on another device, or a reconnect that replays events all leave the
    number slightly wrong with nothing to correct it, because getUnreadCount()
    otherwise runs only when the socket first connects.

    Focus is the natural reconciliation point, and it is the same signal the
    notification badge already uses. getRecentChats() comes along so the
    per-conversation rows agree with the total — markAsRead recomputes the
    badge by summing them, so a stale row would immediately undo this.
  */
  useEffect(() => {
    if (!user) {
      return;
    }

    const resyncUnread = () => {
      if (document.visibilityState !== "visible") return;
      const { socket, getUnreadCount, getRecentChats } =
        useChatStore.getState();
      if (!socket?.connected) return;
      getUnreadCount();
      getRecentChats();
    };

    document.addEventListener("visibilitychange", resyncUnread);
    return () => {
      document.removeEventListener("visibilitychange", resyncUnread);
    };
  }, [user]);
}
