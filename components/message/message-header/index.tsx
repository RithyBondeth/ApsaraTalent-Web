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
    <div className="flex min-h-16 shrink-0 items-center justify-between gap-1.5 border-b border-border bg-card px-2.5 py-2.5 sm:gap-2 sm:px-3 md:px-5 md:py-3">
      {/* Header Identity Section */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        {/* Back Button (Mobile) */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 h-8 w-8 shrink-0 rounded-none lg:hidden"
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
          className="hidden h-9 w-9 shrink-0 rounded-none border border-border lg:flex"
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
          <Avatar className="h-8 w-8 rounded-none border border-border sm:h-9 sm:w-9">
            {chat.isGroup ? (
              <AvatarFallback className="rounded-none bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="rounded-none text-sm font-medium">
                  {avatarInitials}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          {isOnline && (
            <span
              aria-label="Online"
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-success"
            />
          )}
        </div>

        {/* Chat Name and Status Section */}
        <div className="min-w-0 max-w-[52vw] sm:max-w-none">
          <h2 className="pixel-display truncate text-sm text-foreground">
            {chat.name}
          </h2>
          <TypographyMuted
            className={`text-xs leading-tight ${
              isOnline ? "text-success" : "text-muted-foreground"
            }`}
          >
            {presenceLabel}
          </TypographyMuted>
        </div>
      </div>

      {/* Header Actions Section */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        {/* Voice Call Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground sm:h-9 sm:w-9"
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
            className="h-8 w-8 rounded-none lg:hidden"
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
