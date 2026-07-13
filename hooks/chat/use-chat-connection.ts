"use client";

import { useChatStore } from "@/stores/features/chat/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useEffect } from "react";

/* --------------------------------- Usage --------------------------------- */
/**
 * Initialises the real-time chat socket for the current user.
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
}
