// src/components/message/ChatInput.tsx
import { useState } from 'react';
import { Paperclip, Send, SmilePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isDisabled?: boolean;
}

const ChatInput = ({ onSendMessage, isDisabled = false }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (newMessage.trim() === '' || isSending || isDisabled) return;
    
    setIsSending(true);
    
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const inputDisabled = isSending || isDisabled;
  const sendDisabled = inputDisabled || !newMessage.trim();

  return (
    <div className="p-4 border-t flex items-center gap-2">
      <Button variant="ghost" size="icon" disabled={inputDisabled}>
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 relative flex items-center">
        <Input
          type="text"
          placeholder={isDisabled ? "Loading..." : "Type your message..."}
          className="pr-10"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={inputDisabled}
        />
        <Button variant="ghost" size="icon" className="absolute right-2" disabled={inputDisabled}>
          <SmilePlus className="h-5 w-5" />
        </Button>
      </div>
      
      <Button 
        size="icon" 
        onClick={handleSend}
        disabled={sendDisabled}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;