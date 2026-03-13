"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Search, Users } from "lucide-react";
import { useState } from "react";
import { IChatListProps, IChatSidebarProps } from "./props";

export default function ChatSidebar(props: IChatSidebarProps) {
  const { chats, activeChat, className, isOpen, currentUserId, onChatSelect } =
    props;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = searchQuery
    ? chats?.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.preview.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chats;

  return (
    <div
      className={cn(
        `${isOpen ? "w-96" : "w-20"} border-r flex flex-col transition-all duration-300 ease-in-out overflow-hidden`,
        className,
      )}
    >
      {/* Header */}
      {isOpen ? (
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">WorkChat</h1>
        </div>
      ) : (
        <div className="py-4 flex flex-col items-center border-b">
          <Avatar className="size-10 mb-3">
            <AvatarImage src="/avatars/me.jpg" alt="Your Profile" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Search Bar - Only in expanded view */}
      {isOpen && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isOpen ? (
          <ExpandedChatList
            chats={filteredChats}
            activeChat={activeChat}
            currentUserId={currentUserId}
            onChatSelect={onChatSelect}
          />
        ) : (
          <CollapsedChatList
            chats={filteredChats}
            activeChat={activeChat}
            currentUserId={currentUserId}
            onChatSelect={onChatSelect}
          />
        )}
      </div>
    </div>
  );
}

// Expanded chat list
const ExpandedChatList = (props: IChatListProps) => {
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  return (
    <>
      {!chats || chats.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No chats found
        </div>
      ) : (
        chats?.map((chat) => {
          const isLastFromMe = chat.lastMessageSenderId === currentUserId;
          const isUnread = chat.isRead === false && !isLastFromMe;
          return (
            <div
              key={chat.id}
              className={`flex items-center p-4 hover:bg-muted transition-colors cursor-pointer ${
                activeChat?.id === chat.id
                  ? "bg-muted/70"
                  : isUnread
                    ? "bg-primary/5"
                    : ""
              }`}
              onClick={() => onChatSelect(chat)}
            >
              <div className="relative">
                {chat.isGroup ? (
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                ) : (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                {chat.unread && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {chat.unread}
                  </Badge>
                )}
                {/* Unread dot — shown when no count badge but message is unread */}
                {isUnread && !chat.unread && (
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center min-w-0">
                    <h3
                      className={`text-sm text-foreground truncate ${isUnread ? "font-bold" : "font-medium"}`}
                    >
                      {chat.name}
                    </h3>
                    {chat.tag && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 shrink-0"
                      >
                        {chat.tag}
                      </Badge>
                    )}
                  </div>
                  <span
                    className={`text-xs shrink-0 ml-2 ${isUnread ? "text-primary font-semibold" : "text-muted-foreground"}`}
                  >
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isLastFromMe && (
                    <span className="flex-shrink-0">
                      {chat.isRead ? (
                        <CheckCheck className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </span>
                  )}
                  <p
                    className={`text-sm truncate ${isUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {chat.preview}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

// Collapsed chat list
const CollapsedChatList = (props: IChatListProps) => {
  const { chats, activeChat, currentUserId, onChatSelect } = props;

  return (
    <div className="flex flex-col items-center gap-4 pt-2">
      {chats?.map((chat) => {
        const isLastFromMe = chat.lastMessageSenderId === currentUserId;
        const isUnread = chat.isRead === false && !isLastFromMe;
        return (
          <TooltipProvider key={chat.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`relative cursor-pointer p-1 rounded-full transition-all ${activeChat?.id === chat.id ? "bg-muted scale-110" : "hover:bg-muted/50"}`}
                  onClick={() => onChatSelect(chat)}
                >
                  {chat.isGroup ? (
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  ) : (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {chat.unread && (
                    <Badge
                      variant="default"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {chat.unread}
                    </Badge>
                  )}
                  {/* Unread dot for collapsed view — only for incoming messages */}
                  {isUnread && !chat.unread && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className={isUnread ? "font-bold" : ""}>{chat.name}</p>
                {chat.tag && (
                  <p className="text-xs text-muted-foreground">{chat.tag}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
