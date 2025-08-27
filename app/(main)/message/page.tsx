'use client';

import ChatMessages from '@/components/message/message-bubble';
import ChatHeader from '@/components/message/message-header';
import ChatInput from '@/components/message/message-input';
import ChatSidebar from '@/components/message/message-sidebar';
import { IMessage, IChatPreview } from '@/components/message/props';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDoc,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { chatDatabase } from '@/utils/firebase/firebase';
import { useGetCurrentUserStore } from '@/stores/apis/users/get-current-user.store';
import { useToast } from '@/hooks/use-toast';
import ApsaraLoadingSpinner from '@/components/utils/apsara-loading-spinner';

const MessagePage = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { toast } = useToast();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chats, setChats] = useState<IChatPreview[]>([]);
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Get current user's chat ID (employee or company ID)
  const getCurrentUserId = (): string => {
    if (!currentUser) return '';
    return currentUser.role === 'employee'
      ? (currentUser.employee?.id ?? '')
      : (currentUser.company?.id ?? '');
  };

  // Load chat sidebar with error handling
  useEffect(() => {
    const uid = getCurrentUserId();
    if (!uid) {
      setIsLoading(false);
      return;
    }

    try {
      const q = query(
        collection(chatDatabase, 'chats'),
        where('participants', 'array-contains', uid)
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          try {
            const previews: IChatPreview[] = await Promise.all(
              snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const otherUserId = data.participants.find((id: string) => id !== uid);
                const profile = data.participantProfiles?.[otherUserId];

                // Get last message
                const messagesRef = collection(chatDatabase, 'chats', docSnap.id, 'messages');
                const messagesSnap = await getDocs(
                  query(messagesRef, orderBy('timestamp', 'desc'))
                );
                const lastMessage = messagesSnap.docs[0]?.data();

                return {
                  id: docSnap.id,
                  name: profile?.name ?? 'Unknown User',
                  avatar: profile?.profile ?? '/avatars/default.png',
                  preview: lastMessage?.content || 'No messages yet',
                  time: lastMessage?.timestamp?.toDate?.()?.toLocaleTimeString() || '',
                  isRead: lastMessage?.isRead ?? true,
                };
              })
            );

            setChats(previews.filter(Boolean));
            setIsLoading(false);
          } catch (error) {
            console.error('Error loading chat previews:', error);
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to load chats. Please try again.',
            });
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error in chat snapshot listener:', error);
          toast({
            variant: 'destructive',
            title: 'Connection Error',
            description: 'Lost connection to chat service.',
          });
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up chat listener:', error);
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  // Load messages for selected chat with error handling
  useEffect(() => {
    const uid = getCurrentUserId();
    if (!chatId || !uid) {
      setIsLoadingMessages(false);
      return;
    }

    setIsLoadingMessages(true);

    try {
      // Load chat info and set active chat
      const chatRef = doc(chatDatabase, 'chats', chatId);
      getDoc(chatRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const participantId = data.participants.find((id: string) => id !== uid);
            const profile = data.participantProfiles?.[participantId];

            setActiveChat({
              id: chatId,
              name: profile?.name ?? 'Unknown User',
              avatar: profile?.profile ?? '/avatars/default.png',
              preview: '',
              time: '',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Chat Not Found',
              description: 'The requested chat does not exist.',
            });
          }
        })
        .catch((error) => {
          console.error('Error loading chat info:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load chat information.',
          });
        });

      // Listen to messages
      const messagesRef = collection(chatDatabase, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...(data as Omit<IMessage, 'id'>),
              isMe: data.senderId === uid,
              timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
            };
          });
          setMessages(loaded);
          setIsLoadingMessages(false);
        },
        (error) => {
          console.error('Error in messages snapshot listener:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load messages.',
          });
          setIsLoadingMessages(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up message listener:', error);
      setIsLoadingMessages(false);
    }
  }, [chatId, toast]);

  // Send message with error handling and loading state
  const handleSendMessage = async (text: string) => {
    const uid = getCurrentUserId();
    if (!text.trim() || !chatId || !uid) return;

    setIsSending(true);

    try {
      const message: Omit<IMessage, 'id'> = {
        senderId: uid,
        content: text.trim(),
        timestamp: serverTimestamp(),
        isRead: false,
      };

      await addDoc(collection(chatDatabase, 'chats', chatId, 'messages'), message);

      // Update last message in chat document
      const chatRef = doc(chatDatabase, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: 'Your message could not be sent. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <ApsaraLoadingSpinner size={80} loop/>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-background border-border message-xs:flex-col message-xs:[&>div]:w-full">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        isOpen={isSidebarOpen}
        onChatSelect={(chat) => {
          window.location.href = `/message?chatId=${chat.id}`;
        }}
      />

      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            chat={activeChat}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          
          {isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <ApsaraLoadingSpinner size={40} loop/>
                <p className="text-muted-foreground text-sm">Loading messages...</p>
              </div>
            </div>
          ) : (
            <ChatMessages messages={messages} activeChat={activeChat} />
          )}
          
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isDisabled={isSending || isLoadingMessages}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium">No conversation selected</h2>
            <p className="text-muted-foreground mt-2">
              Select a chat from the sidebar to start messaging.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;