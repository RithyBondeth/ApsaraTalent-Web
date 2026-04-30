"use client";

import { useChatStore } from "@/stores/features/chat/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useEffect } from "react";

/* ----------------------------------- Hook ----------------------------------- */
/**
 * Establishes (and tears down) the global chat socket connection.
 *
 * Mount this once at the layout level so real-time message events —
 * new messages, unread badge updates, read receipts — work on every page,
 * not just when the user is on /message.
 *
 * Safe to call multiple times: the socket singleton in chat.store.ts
 * deduplicates connections, so mounting this in both the layout AND
 * message/page.tsx causes no double-connect.
 */
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
}
