// src/components/message/ChatInput.tsx
import { useState } from 'react';
import { Paperclip, Send, SmilePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (newMessage.trim() === '' || isSending) return;
    
    setIsSending(true);
    
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-t flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 relative flex items-center">
        <Input
          type="text"
          placeholder="Type your message..."
          className="pr-10"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isSending}
        />
        <Button variant="ghost" size="icon" className="absolute right-2">
          <SmilePlus className="h-5 w-5" />
        </Button>
      </div>
      
      <Button 
        size="icon" 
        onClick={handleSend}
        disabled={isSending || !newMessage.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;