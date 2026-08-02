import { Skeleton } from "@/components/ui/skeleton";

/* -------------------- Message Loading Skeleton Component -------------------- */
export default function MessageLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1500px] h-full flex bg-card overflow-hidden relative border border-border border-t-[5px] border-t-primary shadow-[5px_5px_0_hsl(var(--foreground)/0.055)]">
      <div className="hidden lg:flex w-full h-full">
        {/* Loading Skeleton for Sidebar Section */}
        <div className="w-[26%] min-w-[260px] max-w-[420px]">
          <ChatSidebarSkeleton />
        </div>
        <div className="w-px bg-border" />
        {/* Loading Skeleton for Message Pane Section */}
        <div className="flex-1 min-w-0">
          <MessagePaneSkeleton />
        </div>
      </div>

      {/* Loading Skeleton for Mobile View Section */}
      <div className="lg:hidden w-full h-full">
        <ChatSidebarSkeleton />
      </div>
    </div>
  );
}

/* -------------------- Chat List Item Skeleton Component -------------------- */
function ChatListItemSkeleton() {
  return (
    <div className="w-full flex items-center gap-3 px-3 md:px-4 py-3 border-b border-border border-l-[4px] border-l-transparent">
      <Skeleton className="h-11 w-11 rounded-none shrink-0 md:h-12 md:w-12" />
      <div className="flex-1 min-w-0 space-y-2">
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
    <div className="flex flex-col h-full border-r border-border bg-card">
      <div className="px-3 md:px-4 pt-4 md:pt-5 pb-3 md:pb-4 flex items-end justify-between shrink-0 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-5 rounded-none" />
          <Skeleton className="h-8 w-24 rounded-none" />
        </div>
        <Skeleton className="h-9 w-9 rounded-none" />
      </div>
      <div className="px-3 md:px-4 py-3 shrink-0 border-b border-border">
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
    <div className="flex-1 px-3 py-4 md:px-5 overflow-hidden bg-muted/10 space-y-4">
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
    <div className="flex flex-col h-full min-w-0">
      <div className="px-3 md:px-5 py-3 border-b border-border flex items-center justify-between bg-card shrink-0 gap-2 min-h-16">
        <div className="flex items-center gap-2 min-w-0">
          <Skeleton className="h-8 w-8 rounded-none lg:hidden" />
          <Skeleton className="h-9 w-9 rounded-none hidden lg:block" />
          <Skeleton className="h-8 w-8 rounded-none sm:h-9 sm:w-9" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28 rounded-none" />
            <Skeleton className="h-3 w-12 rounded-none" />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Skeleton className="h-9 w-9 rounded-none hidden sm:block" />
          <Skeleton className="h-9 w-9 rounded-none hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-none sm:h-9 sm:w-9" />
        </div>
      </div>

      <MessageThreadSkeleton />

      <div className="px-3 md:px-5 py-3 border-t border-border bg-card shrink-0">
        <div className="flex items-end gap-1.5 sm:gap-2">
          <div className="flex flex-1 items-end gap-0.5 overflow-hidden border border-border border-l-[4px] border-l-foreground bg-muted/20 px-2.5 py-1.5 sm:gap-1 sm:px-3 sm:py-2">
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
