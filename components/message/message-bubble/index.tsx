// src/components/message/ChatMessages.tsx
import { useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IChatPreview, IMessage } from '../props';

interface ChatMessagesProps {
  messages: IMessage[];
  activeChat: IChatPreview;
}

const ChatMessages = ({ messages, activeChat }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <>
          <div className="text-center text-xs text-muted-foreground mb-4">Today</div>
          
          {messages.map((message) => (
            <MessageBubble 
              key={message.id}
              message={message}
              activeChat={activeChat}
            />
          ))}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

interface MessageBubbleProps {
  message: IMessage;
  activeChat: IChatPreview;
}

const MessageBubble = ({ message, activeChat }: MessageBubbleProps) => (
  <div 
    className={`mb-4 max-w-xs ${message.isMe ? 'ml-auto' : ''}`}
  >
    {!message.isMe && (
      <div className="flex items-center mb-1">
        <Avatar className="h-6 w-6 mr-2">
          {activeChat.isGroup ? (
            <AvatarFallback>
              {message.senderId.split(' ').map((n)=> n[0]).join('')}
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
              <AvatarFallback>
                {activeChat.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        {activeChat.isGroup && (
          <span className="text-xs font-medium text-foreground">{message.senderId}</span>
        )}
      </div>
    )}
    <div 
      className={`p-3 rounded-lg ${
        message.isMe 
          ? 'bg-primary text-primary-foreground rounded-br-none' 
          : 'bg-background text-foreground rounded-tl-none shadow-sm'
      }`}
    >
      {message.content}
    </div>
    <div className={`text-xs text-muted-foreground mt-1 ${message.isMe ? 'text-right' : ''}`}>
      {message.timestamp instanceof Date ? message.timestamp.toDateString() : 'Sending...'}
    </div>
  </div>
);

export default ChatMessages;