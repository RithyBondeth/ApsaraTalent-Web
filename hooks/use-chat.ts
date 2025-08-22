import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGetCurrentUserStore } from '@/stores/apis/users/get-current-user.store';
import { IMessage, IChatPreview } from '@/components/message/props';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { chatDatabase } from '@/utils/firebase/firebase';
import { createOrGetChat, UserProfile } from '@/utils/firebase/services/chat-service';

export const useChat = (chatId?: string | null) => {
  const { toast } = useToast();
  const currentUser = useGetCurrentUserStore((state) => state.user);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chats, setChats] = useState<IChatPreview[]>([]);
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Get current user's chat ID
  const getCurrentUserId = useCallback((): string => {
    if (!currentUser) return '';
    return currentUser.role === 'employee'
      ? (currentUser.employee?.id ?? '')
      : (currentUser.company?.id ?? '');
  }, [currentUser]);

  // Create or get chat between two users
  const createChat = useCallback(async (otherUser: UserProfile): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');

    const currentUserProfile: UserProfile = {
      id: getCurrentUserId(),
      name: currentUser.role === 'employee' 
        ? (currentUser.employee?.username ?? 'Employee')
        : (currentUser.company?.name ?? 'Company'),
      profile: currentUser.role === 'employee'
        ? (currentUser.employee?.avatar ?? '/avatars/default.png')
        : (currentUser.company?.logo ?? '/avatars/default.png'),
      role: currentUser.role,
    };

    return await createOrGetChat(currentUserProfile, otherUser);
  }, [currentUser, getCurrentUserId]);

  // Load all chats for current user
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
  }, [getCurrentUserId, toast]);

  // Load messages for specific chat
  useEffect(() => {
    const uid = getCurrentUserId();
    if (!chatId || !uid) {
      setIsLoadingMessages(false);
      return;
    }

    setIsLoadingMessages(true);

    try {
      // Load chat info
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
  }, [chatId, getCurrentUserId, toast]);

  // Send message
  const sendMessage = useCallback(async (text: string, targetChatId?: string) => {
    const uid = getCurrentUserId();
    const finalChatId = targetChatId || chatId;
    
    if (!text.trim() || !finalChatId || !uid) return;

    setIsSending(true);

    try {
      const message: Omit<IMessage, 'id'> = {
        senderId: uid,
        content: text.trim(),
        timestamp: serverTimestamp() as any,
        isRead: false,
      };

      await addDoc(collection(chatDatabase, 'chats', finalChatId, 'messages'), message);

      // Update last message in chat document
      const chatRef = doc(chatDatabase, 'chats', finalChatId);
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
  }, [chatId, getCurrentUserId, toast]);

  return {
    // State
    messages,
    chats,
    activeChat,
    isLoading,
    isLoadingMessages,
    isSending,
    
    // Actions
    sendMessage,
    createChat,
    setActiveChat,
    
    // Utilities
    getCurrentUserId,
  };
};