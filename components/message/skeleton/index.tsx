import { Skeleton } from "@/components/ui/skeleton";

/* -------------------- Message Loading Skeleton Component -------------------- */
export default function MessageLoadingSkeleton() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[1500px] overflow-hidden border border-t-[5px] border-border border-t-primary bg-card">
      <div className="hidden h-full w-full lg:flex">
        {/* Loading Skeleton for Sidebar Section */}
        <div className="w-[26%] min-w-[260px] max-w-[420px]">
          <ChatSidebarSkeleton />
        </div>
        <div className="w-px bg-border" />
        {/* Loading Skeleton for Message Pane Section */}
        <div className="min-w-0 flex-1">
          <MessagePaneSkeleton />
        </div>
      </div>

      {/* Loading Skeleton for Mobile View Section */}
      <div className="h-full w-full lg:hidden">
        <ChatSidebarSkeleton />
      </div>
    </div>
  );
}

/* -------------------- Chat List Item Skeleton Component -------------------- */
function ChatListItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 border-b border-l-[4px] border-border border-l-transparent px-3 py-3 md:px-4">
      <Skeleton className="h-11 w-11 shrink-0 rounded-none md:h-12 md:w-12" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-32 rounded-none" />
          <Skeleton className="h-3 w-12 rounded-none" />
        </div>
        <Skeleton className="h-3 w-full max-w-[180px] rounded-none" />
      </div>
    </div>
  );
}

/* -------------------- Chat Sidebar Skeleton Component -------------------- */
function ChatSidebarSkeleton() {
  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex shrink-0 items-end justify-between border-b border-border px-3 pb-3 pt-4 md:px-4 md:pb-4 md:pt-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-5 rounded-none" />
          <Skeleton className="h-8 w-24 rounded-none" />
        </div>
        <Skeleton className="h-9 w-9 rounded-none" />
      </div>
      <div className="shrink-0 border-b border-border px-3 py-3 md:px-4">
        <Skeleton className="h-10 w-full rounded-none" />
      </div>
      <div className="flex-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <ChatListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* -------------------- Message Thread Skeleton Component -------------------- */
export function MessageThreadSkeleton() {
  return (
    <div className="flex-1 space-y-4 overflow-hidden bg-muted/10 px-3 py-4 md:px-5">
      <div className="flex justify-start">
        <Skeleton className="h-16 w-[70%] rounded-none border-l-[4px] border-l-foreground" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-16 w-[58%] rounded-none" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-24 w-[78%] rounded-none border-l-[4px] border-l-foreground" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-14 w-[44%] rounded-none" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-20 w-[66%] rounded-none border-l-[4px] border-l-foreground" />
      </div>
    </div>
  );
}

/* -------------------- Message Pane Skeleton Component -------------------- */
export function MessagePaneSkeleton() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex min-h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-none lg:hidden" />
          <Skeleton className="hidden h-9 w-9 rounded-none lg:block" />
          <Skeleton className="h-8 w-8 rounded-none sm:h-9 sm:w-9" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28 rounded-none" />
            <Skeleton className="h-3 w-12 rounded-none" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Skeleton className="hidden h-9 w-9 rounded-none sm:block" />
          <Skeleton className="hidden h-9 w-9 rounded-none sm:block" />
          <Skeleton className="h-8 w-8 rounded-none sm:h-9 sm:w-9" />
        </div>
      </div>

      <MessageThreadSkeleton />

      <div className="shrink-0 border-t border-border bg-card px-3 py-3 md:px-5">
        <div className="flex items-end gap-1.5 sm:gap-2">
          <div className="flex flex-1 items-end gap-0.5 overflow-hidden border border-l-[4px] border-border border-l-foreground bg-muted/20 px-2.5 py-1.5 sm:gap-1 sm:px-3 sm:py-2">
            <Skeleton className="h-[30px] flex-1 rounded-none sm:h-8" />
            <Skeleton className="size-8 shrink-0 rounded-none" />
            <Skeleton className="size-8 shrink-0 rounded-none" />
            <Skeleton className="size-8 shrink-0 rounded-none" />
          </div>
          <Skeleton className="h-10 w-10 rounded-none" />
        </div>
      </div>
    </div>
  );
}
