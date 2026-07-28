"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Users,
  Video,
} from "lucide-react";
import { IChatHeaderProps } from "./props";
import { useTranslations } from "next-intl";
import { getNameInitials } from "@/utils/functions/text";
import UserModerationMenu from "@/components/moderation/user-moderation-menu";

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

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
  const isOnline = Boolean(chat.isOnline);
  const presenceLabel = isOnline ? t("online") : t("offline");
  const sidebarToggleLabel = isSidebarOpen
    ? t("collapseSidebar")
    : t("expandSidebar");
  const avatarInitials = getNameInitials(chat.name);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="px-2.5 sm:px-3 md:px-5 py-2.5 md:py-3 border-b border-border flex items-center justify-between bg-card shrink-0 gap-1.5 sm:gap-2 min-h-16">
      {/* Header Identity Section */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
        {/* Back Button (Mobile) */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 shrink-0 -ml-1 rounded-none"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Sidebar Toggle Button (Desktop) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden lg:flex h-9 w-9 shrink-0 rounded-none border border-border"
          aria-label={sidebarToggleLabel}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        {/* Avatar and Online Status Section */}
        <div className="relative shrink-0">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-none border border-border">
            {chat.isGroup ? (
              <AvatarFallback className="bg-primary/10 rounded-none">
                <Users className="h-4 w-4 text-primary" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="text-sm font-medium rounded-none">
                  {avatarInitials}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          {isOnline && (
            <span
              aria-label="Online"
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"
            />
          )}
        </div>

        {/* Chat Name and Status Section */}
        <div className="min-w-0 max-w-[52vw] sm:max-w-none">
          <h2 className="font-black text-sm text-foreground truncate leading-tight tracking-[-0.01em]">
            {chat.name}
          </h2>
          <TypographyMuted
            className={`text-xs leading-tight ${
              isOnline ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {presenceLabel}
          </TypographyMuted>
        </div>
      </div>

      {/* Header Actions Section */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Video Call Button (Desktop) */}
        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex h-9 w-9 rounded-none text-muted-foreground hover:text-foreground"
          onClick={onStartVideoCall}
          aria-label="Start video call"
        >
          <Video className="h-4 w-4" />
        </Button>

        {/* Voice Call Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-none text-muted-foreground hover:text-foreground"
          onClick={onStartVoiceCall}
          aria-label="Start voice call"
        >
          <Phone className="h-4 w-4" />
        </Button>

        {/* Mobile Conversations Button */}
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 rounded-none"
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

        {/* More Options Button Section: (Block / Report) */}
        {!chat.isGroup && (
          <UserModerationMenu targetId={chat.id} targetName={chat.name} />
        )}
      </div>
    </div>
  );
}
