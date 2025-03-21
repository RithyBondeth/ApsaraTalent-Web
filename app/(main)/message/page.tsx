'use client';

import ChatMessages from '@/components/message/message-bubble';
import ChatHeader from '@/components/message/message-header';
import ChatInput from '@/components/message/message-input';
import ChatSidebar from '@/components/message/message-sidebar';
import { IChatPreview, IMessage } from '@/components/message/props';
import { fetchChats, fetchMessages, sendNewMessage } from '@/data/message.service';
import React, { useState, useEffect } from 'react';

const MessagePage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<IChatPreview[]>();
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 980 && window.innerWidth >= 430) {
        setSidebarOpen(false); // Close sidebar on smaller screens
      } else if (window.innerWidth < 430) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(true); // Open sidebar on larger screens
      }
    };

    handleResize(); // Call once to set the initial state

    window.addEventListener('resize', handleResize); // Add event listener for resizing
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup the event listener on unmount
    };
  }, [])

  // Fetch chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChats();
        setChats(data);
        
        // Select the first chat by default
        if (data.length > 0) {
          handleChatSelect(data[0]);
        }
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadChats();
  }, []);

  const handleChatSelect = async (chat: IChatPreview) => {
    setActiveChat(chat);
    
    // Mark as read when selecting
    // setChats(chats.map((c: IChatPreview) => 
    //   c.id === chat.id ? { ...c, unread: undefined } : c
    // ));
    
    try {
      const messageData = await fetchMessages(chat.id);
      setMessages(messageData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChat) return;
    
    const tempMessage: IMessage = {
      id: Date.now(), // Temporary ID
      sender: 'You',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    // Optimistically update UI
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      await sendNewMessage(activeChat.id, content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading chats...</div>;
  }

  return (
    <div className="w-full h-full flex bg-background border-border message-xs:flex-col message-xs:[&>div]:w-full">
      <ChatSidebar 
        chats={chats}
        activeChat={activeChat}
        isOpen={isSidebarOpen}
        onChatSelect={handleChatSelect}
      />
      
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            chat={activeChat}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          
          <ChatMessages 
            messages={messages}
            activeChat={activeChat}
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium">Select a conversation</h2>
            <p className="text-muted-foreground mt-2">Choose a chat from the sidebar to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;