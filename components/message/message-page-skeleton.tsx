import { Skeleton } from "@/components/ui/skeleton";

const ChatListItemSkeleton = () => (
  <div className="w-full flex items-center gap-3 px-4 py-3">
    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-3 w-full max-w-[180px]" />
    </div>
  </div>
);

export function ChatSidebarSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="px-4 pt-5 pb-3 flex items-center justify-between shrink-0">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="px-4 pb-3 shrink-0">
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
      <div className="flex-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <ChatListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function MessageThreadSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex-1 px-3 py-4 md:px-4 overflow-hidden bg-muted/20 space-y-3">
      <div className="flex justify-start">
        <Skeleton className="h-16 w-[70%] rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-16 w-[58%] rounded-2xl" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-24 w-[78%] rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-14 w-[44%] rounded-2xl" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-20 w-[66%] rounded-2xl" />
      </div>
    </div>
  );
}

export function MessagePaneSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="px-3 md:px-4 py-3 border-b flex items-center justify-between bg-background shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Skeleton className="h-9 w-9 rounded-md lg:hidden" />
          <Skeleton className="h-9 w-9 rounded-md hidden lg:block" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Skeleton className="h-9 w-9 rounded-md hidden sm:block" />
          <Skeleton className="h-9 w-9 rounded-md hidden sm:block" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      <MessageThreadSkeleton />

      <div className="px-3 py-3 border-t bg-background shrink-0">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
