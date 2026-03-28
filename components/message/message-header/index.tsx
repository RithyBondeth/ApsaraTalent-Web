import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Phone,
  Users,
  Video,
} from "lucide-react";
import { IChatHeaderProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

/**
 * Chat conversation header.
 *
 * Layout:
 *   [Back (mobile)] [Sidebar toggle (desktop)] [Avatar + Online dot] [Name + status]
 *   ···  [Video call] [Phone call] [Hamburger (mobile)] [⋮]
 *
 * Online dot logic:
 *   - The `chat.isOnline` field comes from the Zustand store (useChatStore.activeChat).
 *   - The store listens to 'userStatus' socket events and sets
 *     activeChat.isOnline = true/false in real time.
 *   - Green dot = online.  No dot = offline.
 */
export default function ChatHeader(props: IChatHeaderProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    chat,
    isSidebarOpen,
    onToggleSidebar,
    onBack,
    onOpenMobileSidebar,
    onStartVoiceCall,
    onStartVideoCall,
  } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="px-2.5 sm:px-3 md:px-4 py-2.5 md:py-3 border-b flex items-center justify-between bg-background shrink-0 gap-1.5 sm:gap-2 min-h-14">
      {/* ── LEFT SECTION ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
        {/* Mobile back button */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 shrink-0 -ml-1"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Desktop sidebar collapse/expand toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden lg:flex h-9 w-9 shrink-0"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {/* Avatar with online indicator dot */}
        <div className="relative shrink-0">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
            {chat.isGroup ? (
              <AvatarFallback className="bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
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

          {/* Green online dot */}
          {chat.isOnline && (
            <span
              aria-label="Online"
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"
            />
          )}
        </div>

        {/* Name & online status text */}
        <div className="min-w-0 max-w-[52vw] sm:max-w-none">
          <h2 className="font-semibold text-sm text-foreground truncate leading-tight">
            {chat.name}
          </h2>
          <TypographyMuted
            className={`text-xs leading-tight ${
              chat.isOnline ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {chat.isOnline ? "Online" : "Offline"}
          </TypographyMuted>
        </div>
      </div>

      {/* ── RIGHT SECTION ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Video call button */}
        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={onStartVideoCall}
          aria-label="Start video call"
        >
          <Video className="h-4 w-4" />
        </Button>

        {/* Voice call button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
          onClick={onStartVoiceCall}
          aria-label="Start voice call"
        >
          <Phone className="h-4 w-4" />
        </Button>

        {/* Mobile hamburger — opens sidebar overlay */}
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
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

        {/* More options */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
