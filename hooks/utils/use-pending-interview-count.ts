import { useInterviewStore } from "@/stores/apis/matching/interview.store";

/* --------------------------------- Usage --------------------------------- */
/**
 * Returns the live count of pending interviews, derived from the interview store.
 * Useful for displaying a real-time badge in sidebar navigation.
 *
 * Usage:
 *   const pendingCount = usePendingInterviewCount();
 *
 *   <SidebarLink badge={pendingCount} />
 *
 *   // Note: useFetchOnce in the sidebar layout is responsible for populating
 *   // the store. This hook simply subscribes to the pending count slice.
 */

/* --------------------------------- Hook ---------------------------------- */
export function usePendingInterviewCount(): number {
  return useInterviewStore(
    (s) => s.interviews.filter((i) => i.status === "pending").length,
  );
}
