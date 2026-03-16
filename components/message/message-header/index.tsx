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
      {/* Left section */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile back button — goes back to conversation list */}
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

        {/* Desktop sidebar toggle — hidden on mobile */}
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

        {/* Avatar */}
        <Avatar className="h-9 w-9 shrink-0">
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

        {/* Name & status */}
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-foreground truncate leading-tight">
            {chat.name}
          </h2>
          <p className="text-xs text-green-500 leading-tight">Online</p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mobile hamburger — opens sidebar sheet overlay */}
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={onOpenMobileSidebar}
            aria-label="Open conversations"
          >
            {/* Simple chat-bubble grid icon */}
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
