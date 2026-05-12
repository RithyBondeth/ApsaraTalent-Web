import { useInterviewStore } from "@/stores/apis/matching/interview.store";

/**
 * Returns the live count of pending interviews for the sidebar badge.
 * The sidebar's useFetchOnce is responsible for populating useInterviewStore;
 * this hook just subscribes so it reacts instantly to accept/decline/create.
 */
export function usePendingInterviewCount(): number {
  return useInterviewStore((s) =>
    s.interviews.filter((i) => i.status === "pending").length,
  );
}
