import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";

/* --------------------------------- Usage --------------------------------- */
/**
 * Returns the live count of interviews that are waiting on THIS user to act,
 * for the real-time badge in navigation.
 *
 * An interview is "pending" from the moment it is created until the invited
 * party accepts or declines it, so `status === "pending"` alone describes both
 * sides of the same interview. Counting that raw meant the party who created
 * the interview badged themselves for their own action, and the badge stayed
 * lit until the *other* person responded — nothing the badge holder could do
 * would clear it.
 *
 * `createdBy` records which side scheduled it, so the ball is in the other
 * side's court: an interview is actionable by me only when I did not create it.
 *
 * Usage:
 *   const pendingCount = usePendingInterviewCount();
 *
 *   <SidebarLink badge={pendingCount} />
 *
 *   // Note: useFetchOnce in the sidebar layout is responsible for populating
 *   // the store. This hook simply subscribes to the actionable count slice.
 */

/* --------------------------------- Hook ---------------------------------- */
export function usePendingInterviewCount(): number {
  const role = useGetCurrentUserStore((s) => s.user?.role);

  return useInterviewStore((s) =>
    role
      ? s.interviews.filter(
          (i) => i.status === "pending" && i.createdBy !== role,
        ).length
      : // Role unknown (user still loading) — we cannot tell whose turn it is,
        // and guessing would badge the wrong person. Show nothing until we can.
        0,
  );
}
