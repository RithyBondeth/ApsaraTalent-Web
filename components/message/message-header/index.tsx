// src/components/message/ChatHeader.tsx
import { ChevronLeft, ChevronRight, MoreVertical, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IChatPreview } from '../props';

interface ChatHeaderProps {
  chat: IChatPreview;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const ChatHeader = ({ chat, isSidebarOpen, onToggleSidebar }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2 message-xl:hidden">
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
          <span className="sr-only">
            {isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          </span>
        </Button>
        
        <Avatar className="h-10 w-10">
          {chat.isGroup ? (
            <AvatarFallback className="bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>
                {chat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="ml-3">
          <h2 className="font-medium text-foreground">{chat.name}</h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;