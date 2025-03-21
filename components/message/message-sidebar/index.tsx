"use client"

import { Search, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from 'react';
import { IChatPreview } from '../props';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  chats: IChatPreview[] | undefined;
  activeChat: IChatPreview | null;
  isOpen: boolean;
  className?: string;
  onChatSelect: (chat: IChatPreview) => void;
}

const ChatSidebar = ({ chats, activeChat, className, isOpen, onChatSelect }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChats = searchQuery 
    ? chats?.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  return (
    <div 
      className={cn(`${isOpen ? 'w-96' : 'w-20'} border-r flex flex-col transition-all duration-300 ease-in-out overflow-hidden`, className)}
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
            onChatSelect={onChatSelect} 
          />
        ) : (
          <CollapsedChatList 
            chats={filteredChats} 
            activeChat={activeChat} 
            onChatSelect={onChatSelect} 
          />
        )}
      </div>
    </div>
  );
};

// Expanded chat list
interface ChatListProps {
  chats: IChatPreview[] | undefined;
  activeChat: IChatPreview | null;
  onChatSelect: (chat: IChatPreview) => void;
}

const ExpandedChatList = ({ chats, activeChat, onChatSelect }: ChatListProps) => (
  <>
    {!chats || chats.length === 0 ? (
      <div className="p-4 text-center text-muted-foreground">
        No chats found
      </div>
    ) : (
      chats?.map(chat => (
        <div 
          key={chat.id} 
          className={`flex items-center p-4 hover:bg-muted transition-colors cursor-pointer ${activeChat?.id === chat.id ? 'bg-muted/70' : ''}`}
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
                  {chat.name.split(' ').map(n => n[0]).join('')}
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
          </div>
          <div className="ml-3 flex-1 h-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="font-medium text-sm text-foreground">{chat.name}</h3>
                {chat.tag && (
                  <Badge variant="outline" className="ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {chat.tag}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{chat.time}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate w-full text-wrap">{chat.preview}</p>
          </div>
        </div>
      ))
    )}
  </>
);

// Collapsed chat list
const CollapsedChatList = ({ chats, activeChat, onChatSelect }: ChatListProps) => (
  <div className="flex flex-col items-center gap-4 pt-2">
    {chats?.map(chat => (
      <TooltipProvider key={chat.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`relative cursor-pointer p-1 rounded-full transition-all ${activeChat?.id === chat.id ? 'bg-muted scale-110' : 'hover:bg-muted/50'}`}
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
                    {chat.name.split(' ').map(n => n[0]).join('')}
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
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{chat.name}</p>
            {chat.tag && <p className="text-xs text-muted-foreground">{chat.tag}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ))}
  </div>
);

export default ChatSidebar;