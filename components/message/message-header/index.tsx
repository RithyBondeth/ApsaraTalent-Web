import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Users,
} from "lucide-react";
import { IChatHeaderProps } from "./props";

/**
 * Chat conversation header.
 *
 * Layout:
 *   [Back (mobile)] [Sidebar toggle (desktop)] [Avatar + Online dot] [Name + status]  ···  [Hamburger (mobile)] [⋮]
 *
 * Online dot logic:
 *   - The `chat.isOnline` field comes from the Zustand store (useChatStore.activeChat).
 *   - The store listens to 'userStatus' socket events from the server and sets
 *     activeChat.isOnline = true/false in real time.
 *   - Green dot = online.  No dot (hidden) = offline.
 */
export default function ChatHeader(props: IChatHeaderProps) {
  const {
    chat,
    isSidebarOpen,
    onToggleSidebar,
    onBack,
    onOpenMobileSidebar,
  } = props;

  return (
    <div className="px-3 md:px-4 py-3 border-b flex items-center justify-between bg-background shrink-0 gap-2">
      {/* ── LEFT SECTION ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile back button — navigates to the conversation list (md:hidden) */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 shrink-0 -ml-1"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop sidebar collapse/expand toggle (hidden md:flex) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden md:flex h-9 w-9 shrink-0"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {/* Avatar with online indicator dot.
            The wrapper is relative so we can overlay the dot on the corner. */}
        <div className="relative shrink-0">
          <Avatar className="h-9 w-9">
            {chat.isGroup ? (
              <AvatarFallback className="bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="text-sm font-medium">
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          {/* Green online dot — only rendered when the partner is online.
              The border-background ring separates it from the avatar image. */}
          {chat.isOnline && (
            <span
              aria-label="Online"
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"
            />
          )}
        </div>

        {/* Name & online status text */}
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-foreground truncate leading-tight">
            {chat.name}
          </h2>
          {/* Status text mirrors the dot: green "Online" or muted "Offline".
              This gives screen-reader users a text equivalent of the dot. */}
          <p
            className={`text-xs leading-tight ${
              chat.isOnline ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {chat.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* ── RIGHT SECTION ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mobile hamburger — opens sidebar overlay (md:hidden) */}
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={onOpenMobileSidebar}
            aria-label="Open conversations"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        )}

        {/* More options (future: context menu for mute, block, etc.) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
