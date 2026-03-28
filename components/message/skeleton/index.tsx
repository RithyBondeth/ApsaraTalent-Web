import {
  ChatSidebarSkeleton,
  MessagePaneSkeleton,
} from "@/components/message/message-page-skeleton";

export default function MessageLoadingSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full h-full flex bg-background overflow-hidden relative">
      <div className="hidden lg:flex w-full h-full">
        <div className="w-[26%] min-w-[260px] max-w-[420px]">
          <ChatSidebarSkeleton />
        </div>
        <div className="w-px bg-border" />
        <div className="flex-1 min-w-0">
          <MessagePaneSkeleton />
        </div>
      </div>

      <div className="lg:hidden w-full h-full">
        <ChatSidebarSkeleton />
      </div>
    </div>
  );
}
