// 'use client';

// import ChatMessages from '@/components/message/message-bubble';
// import ChatHeader from '@/components/message/message-header';
// import ChatInput from '@/components/message/message-input';
// import ChatSidebar from '@/components/message/message-sidebar';
// import { IMessage, IChatPreview } from '@/components/message/props';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import {
//   getFirestore,
//   doc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   getDoc,
//   where,
//   getDocs,
//   QuerySnapshot,
//   DocumentData,
// } from 'firebase/firestore';
// import { useGetCurrentUserStore } from '@/stores/apis/users/get-current-user.store';

// const MessagePage = () => {
//   const db = getFirestore();
//   const searchParams = useSearchParams();
//   const chatId = searchParams.get('chatId');
//   const currentUser = useGetCurrentUserStore((state) => state.user);

//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [chats, setChats] = useState<IChatPreview[]>([]);
//   const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

//   // 🧠 Get actual Firebase ID (employee or company)
//   const getCurrentUserId = () => {
//     if (!currentUser) return '';
//     return currentUser.role === 'employee'
//       ? currentUser.employee?.id
//       : currentUser.company?.id;
//   };

//   // 🧠 Get display name from user doc
//   const getUserDisplayName = async (userId: string): Promise<string> => {
//     try {
//       const userDoc = await getDoc(doc(db, 'users', userId));
//       const userData = userDoc.data();
  
//       if (!userData || !userData.role) return 'Unknown';
  
//       if (userData.role === 'employee' && userData.employeeId) {
//         const empDoc = await getDoc(doc(db, 'employees', userData.employeeId));
//         const empData = empDoc.data();
//         return empData?.username || 'Employee';
//       }
  
//       if (userData.role === 'company' && userData.companyId) {
//         const compDoc = await getDoc(doc(db, 'companies', userData.companyId));
//         const compData = compDoc.data();
//         return compData?.name || 'Company';
//       }
  
//       return 'Unknown';
//     } catch (error) {
//       console.error('Failed to get display name:', error);
//       return 'Unknown';
//     }
//   };

//   // 🔁 Load chat list for sidebar
//   useEffect(() => {
//     const uid = getCurrentUserId();
//     if (!uid) return;

//     const q = query(collection(db, 'chats'), where('participants', 'array-contains', uid));

//     const unsubscribe = onSnapshot(q, async (snapshot: QuerySnapshot<DocumentData>) => {
//       const chatPreviews: IChatPreview[] = await Promise.all(
//         snapshot.docs.map(async (docSnap) => {
//           const data = docSnap.data();
//           const otherUserId = data.participants.find((id: string) => id !== uid);
//           const displayName = await getUserDisplayName(otherUserId);

//           const messagesRef = collection(db, 'chats', docSnap.id, 'messages');
//           const messagesSnap = await getDocs(query(messagesRef, orderBy('timestamp', 'desc')));
//           const lastMessage = messagesSnap.docs[0]?.data();

//           return {
//             id: docSnap.id,
//             name: displayName,
//             avatar: '/avatars/default.png',
//             preview: lastMessage?.content || '',
//             time: lastMessage?.timestamp?.toDate()?.toLocaleTimeString() || '',
//           };
//         })
//       );
//       setChats(chatPreviews);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   // 📩 Load messages for selected chat
//   useEffect(() => {
//     const uid = getCurrentUserId();
//     if (!chatId || !uid) return;

//     const chatRef = doc(db, 'chats', chatId);
//     getDoc(chatRef).then((snapshot) => {
//       const chatData = snapshot.data();
//       if (chatData) {
//         const participantId = chatData.participants.find((id: string) => id !== uid);
//         getUserDisplayName(participantId).then((displayName) => {
//           setActiveChat({
//             id: chatId,
//             name: displayName,
//             avatar: '/avatars/default.png',
//             preview: '',
//             time: '',
//           });
//         });
//       }
//     });

//     const messagesRef = collection(db, 'chats', chatId, 'messages');
//     const q = query(messagesRef, orderBy('timestamp'));

//     const unsubscribeMessages = onSnapshot(q, (snapshot) => {
//       const loadedMessages = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           ...(data as IMessage),
//           isMe: data.senderId === uid,
//         };
//       });
//       setMessages(loadedMessages);
//       setIsLoading(false);
//     });

//     return () => {
//       unsubscribeMessages();
//     };
//   }, [chatId, currentUser]);

//   // 📨 Send new message
//   const handleSendMessage = async (text: string) => {
//     const uid = getCurrentUserId();
//     if (!text.trim() || !chatId || !uid) return;

//     const message: Omit<IMessage, 'id'> = {
//       senderId: uid,
//       content: text.trim(),
//       timestamp: serverTimestamp() as any,
//       isRead: false,
//     };

//     await addDoc(collection(db, 'chats', chatId, 'messages'), message);
//   };

//   if (isLoading) {
//     return <div className="h-full flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className="w-full h-full flex bg-background border-border message-xs:flex-col message-xs:[&>div]:w-full">
//       <ChatSidebar
//         chats={chats}
//         activeChat={activeChat}
//         isOpen={isSidebarOpen}
//         onChatSelect={(chat) => window.location.href = `/message?chatId=${chat.id}`}
//       />

//       {activeChat ? (
//         <div className="flex-1 flex flex-col">
//           <ChatHeader
//             chat={activeChat}
//             isSidebarOpen={isSidebarOpen}
//             onToggleSidebar={toggleSidebar}
//           />
//           <ChatMessages messages={messages} activeChat={activeChat} />
//           <ChatInput onSendMessage={handleSendMessage} />
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h2 className="text-xl font-medium">No conversation selected</h2>
//             <p className="text-muted-foreground mt-2">
//               Please go back and select a match.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagePage;

// 'use client';

// import ChatMessages from '@/components/message/message-bubble';
// import ChatHeader from '@/components/message/message-header';
// import ChatInput from '@/components/message/message-input';
// import ChatSidebar from '@/components/message/message-sidebar';
// import { IMessage, IChatPreview } from '@/components/message/props';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import {
//   getFirestore,
//   doc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   getDoc,
//   where,
//   getDocs,
//   QuerySnapshot,
//   DocumentData,
// } from 'firebase/firestore';
// import { useGetCurrentUserStore } from '@/stores/apis/users/get-current-user.store';
// import { useGetOneEmployeeStore } from '@/stores/apis/employee/get-one-emp.store';
// import { getUnifiedAccessToken } from '@/utils/auth/get-access-token';
// import { useGetOneCompanyStore } from '@/stores/apis/company/get-one-cmp.store';

// const MessagePage = () => {
//   const db = getFirestore();
//   const searchParams = useSearchParams();
//   const chatId = searchParams.get('chatId');
//   const currentUser = useGetCurrentUserStore((state) => state.user);
//   const accessToken = getUnifiedAccessToken();
//   const { employeeData, queryOneEmployee } = useGetOneEmployeeStore();
//   const { companyData, queryOneCompany } = useGetOneCompanyStore();

//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [chats, setChats] = useState<IChatPreview[]>([]);
//   const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

//   useEffect(() => {
//     if (!currentUser) return;

//     const q = query(
//       collection(db, 'chats'),
//       where('participants', 'array-contains', currentUser.id)
//     );

//     const unsubscribe = onSnapshot(q, async (snapshot: QuerySnapshot<DocumentData>) => {
//       const chatPreviews: IChatPreview[] = await Promise.all(
//         snapshot.docs.map(async (docSnap) => {
//           const data = docSnap.data();
//           const otherUserId = data.participants.find((id: string) => id !== currentUser.id);
//           await queryOneEmployee(otherUserId, accessToken);
//           const messagesRef = collection(db, 'chats', docSnap.id, 'messages');
//           const messagesSnap = await getDocs(query(messagesRef, orderBy('timestamp', 'desc')));
//           const lastMessage = messagesSnap.docs[0]?.data();

//           return {
//             id: docSnap.id,
//             name: employeeData?.username ?? "",
//             avatar:employeeData?.avatar ?? "",
//             preview: lastMessage?.content || '',
//             time: lastMessage?.timestamp?.toDate()?.toLocaleTimeString() || '',
//           };
//         })
//       );
//       setChats(chatPreviews);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   useEffect(() => {
//     if (!chatId || !currentUser) return;

//     const chatRef = doc(db, 'chats', chatId);
//     getDoc(chatRef).then((snapshot) => {
//       const chatData = snapshot.data();     
//       if (chatData) {
//         const participantId = chatData.participants.find((id: string) => id !== currentUser.id);
//         queryOneEmployee(participantId, accessToken);
//         setActiveChat({
//           id: chatId,
//           name: employeeData?.username ?? "",
//           avatar:employeeData?.avatar ?? "",
//           preview: '',
//           time: '',
//         });
//       }
//     });

//     const messagesRef = collection(db, 'chats', chatId, 'messages');
//     const q = query(messagesRef, orderBy('timestamp'));

//     const unsubscribeMessages = onSnapshot(q, (snapshot) => {
//       const loadedMessages = snapshot.docs.map((doc) => ({
//         ...(doc.data() as IMessage),
//         isMe: doc.data().senderId === currentUser.id,
//       }));
//       setMessages(loadedMessages);
//       setIsLoading(false);
//     });

//     return () => {
//       unsubscribeMessages();
//     };
//   }, [chatId, currentUser]);

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim() || !chatId || !currentUser) return;

//     const message: Omit<IMessage, 'id'> = {
//       senderId: currentUser.id,
//       content: text.trim(),
//       timestamp: serverTimestamp() as any,
//       isRead: false,
//     };

//     await addDoc(collection(db, 'chats', chatId, 'messages'), message);
//   };

//   if (isLoading) {
//     return <div className="h-full flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className="w-full h-full flex bg-background border-border message-xs:flex-col message-xs:[&>div]:w-full">
//       <ChatSidebar 
//         chats={chats}
//         activeChat={activeChat}
//         isOpen={isSidebarOpen}
//         onChatSelect={(chat) => window.location.href = `/message?chatId=${chat.id}`}
//       />

//       {activeChat ? (
//         <div className="flex-1 flex flex-col">
//           <ChatHeader 
//             chat={activeChat}
//             isSidebarOpen={isSidebarOpen}
//             onToggleSidebar={toggleSidebar}
//           />

//           <ChatMessages 
//             messages={messages}
//             activeChat={activeChat}
//           />

//           <ChatInput 
//             onSendMessage={handleSendMessage}
//           />
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h2 className="text-xl font-medium">No conversation selected</h2>
//             <p className="text-muted-foreground mt-2">Please go back and select a match.</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagePage;

// MessagePage.tsx (Complete & Updated)

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
} from 'firebase/firestore';
import { chatDatabase } from '@/firebase/firebase';
import { useGetCurrentUserStore } from '@/stores/apis/users/get-current-user.store';

const MessagePage = () => {

  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const currentUser = useGetCurrentUserStore((state) => state.user);

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chats, setChats] = useState<IChatPreview[]>([]);
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const getCurrentUserId = (): string => {
    if (!currentUser) return '';
    return currentUser.role === 'employee'
      ? currentUser.employee?.id!
      : currentUser.company?.id!;
  };

  // Load chat sidebar
  useEffect(() => {
    const uid = getCurrentUserId();
    if (!uid) return;

    const q = query(
      collection(chatDatabase, 'chats'),
      where('participants', 'array-contains', uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const previews: IChatPreview[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const otherUserId = data.participants.find((id: string) => id !== uid);
          const profile = data.participantProfiles?.[otherUserId];

          const messagesRef = collection(chatDatabase, 'chats', docSnap.id, 'messages');
          const messagesSnap = await getDocs(query(messagesRef, orderBy('timestamp', 'desc')));
          const lastMessage = messagesSnap.docs[0]?.data();

          return {
            id: docSnap.id,
            name: profile?.name ?? 'Unknown',
            avatar: profile?.profile ?? '/avatars/default.png',
            preview: lastMessage?.content || '',
            time: lastMessage?.timestamp?.toDate()?.toLocaleTimeString() || '',
          };
        })
      );

      setChats(previews.filter(Boolean));
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load messages for selected chat
  useEffect(() => {
    const uid = getCurrentUserId();
    if (!chatId || !uid) return;

    const chatRef = doc(chatDatabase, 'chats', chatId);
    getDoc(chatRef).then((snapshot) => {
      const data = snapshot.data();
      if (data) {
        const participantId = data.participants.find((id: string) => id !== uid);
        const profile = data.participantProfiles?.[participantId];

        setActiveChat({
          id: chatId,
          name: profile?.name ?? 'Unknown',
          avatar: profile?.profile ?? '/avatars/default.png',
          preview: '',
          time: '',
        });
      }
    });

    const messagesRef = collection(chatDatabase, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...(data as IMessage),
          isMe: data.senderId === uid,
        };
      });
      setMessages(loaded);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const handleSendMessage = async (text: string) => {
    const uid = getCurrentUserId();
    if (!text.trim() || !chatId || !uid) return;

    const message: Omit<IMessage, 'id'> = {
      senderId: uid,
      content: text.trim(),
      timestamp: serverTimestamp() as any,
      isRead: false,
    };

    await addDoc(collection(chatDatabase, 'chats', chatId, 'messages'), message);
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full h-full flex bg-background border-border message-xs:flex-col message-xs:[&>div]:w-full">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        isOpen={isSidebarOpen}
        onChatSelect={(chat) => window.location.href = `/message?chatId=${chat.id}`}
      />

      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            chat={activeChat}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          <ChatMessages messages={messages} activeChat={activeChat} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium">No conversation selected</h2>
            <p className="text-muted-foreground mt-2">Please go back and select a match.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;