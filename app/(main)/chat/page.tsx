// // 'use client';
// // import { useLoginStore } from '@/stores/apis/auth/login.store';
// // import { useState, useEffect, useRef } from 'react';
// // import { Socket } from 'socket.io-client';
// // import io from 'socket.io-client';

// // type Message = {
// //   senderId: string;
// //   senderName: string;
// //   content: string;
// //   timestamp: Date;
// // };

// // export default function ChatPage() {
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [input, setInput] = useState('');
// //   const [isConnected, setIsConnected] = useState(false);
// //   const socketRef = useRef<typeof Socket | null>(null);
// //   const accessToken = useLoginStore((state) => state.accessToken);

// //     useEffect(() => {
// //     if (!accessToken) {
// //       console.error('No access token available');
// //       return;
// //     }

// //     // Initialize Socket.IO with proper types
// //     const socket: typeof Socket = io('http://localhost:6379', {  // Added /chat namespace
// //       auth: {
// //         token: accessToken
// //       },
// //       transports: ['websocket'],  // Force WebSocket transport
// //       reconnectionAttempts: 5,
// //       reconnectionDelay: 3000
// //     });

// //     socketRef.current = socket;

// //     // Connection handlers
// //     const onConnect = () => {
// //       setIsConnected(true);
// //       console.log('Connected to chat server');
// //     };

// //     const onDisconnect = () => {
// //       setIsConnected(false);
// //       console.log('Disconnected from chat server');
// //     };

// //     const onMessage = (message: Message) => {
// //       setMessages(prev => [...prev, message]);
// //     };

// //     const onUserStatus = (data: { userId: string; status: string }) => {
// //       console.log(`User ${data.userId} is now ${data.status}`);
// //     };

// //     const onError = (err: Error) => {
// //       console.error('Socket error:', err);
// //     };

// //     socket.on('connect', onConnect);
// //     socket.on('disconnect', onDisconnect);
// //     socket.on('newMessage', onMessage);
// //     socket.on('userStatus', onUserStatus);
// //     socket.on('connect_error', onError);

// //     return () => {
// //       socket.off('connect', onConnect);
// //       socket.off('disconnect', onDisconnect);
// //       socket.off('newMessage', onMessage);
// //       socket.off('userStatus', onUserStatus);
// //       socket.off('connect_error', onError);
// //       socket.disconnect();
// //     };
// //   }, [accessToken]);  // Added dependency

// //   const sendMessage = () => {
// //     if (!socketRef.current || !input.trim()) return;
    
// //     const messagePayload = {
// //       receiverId: 'TARGET_USER_ID', // Replace with actual user ID
// //       content: input,
// //       type: 'text'
// //     };

// //     socketRef.current.emit('sendMessage', messagePayload, (response: { status: string }) => {
// //       console.log('Server acknowledged message:', response.status);
// //     });
    
// //     setInput('');
// //   };

// //   return (
// //     <div className="p-4 max-w-md mx-auto">
// //       <div className={`p-2 mb-4 ${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}>
// //         Status: {isConnected ? 'Connected' : 'Disconnected'}
// //       </div>
      
// //       <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4">
// //         {messages.length === 0 ? (
// //           <p className="text-gray-500 text-center">No messages yet</p>
// //         ) : (
// //           messages.map((msg, i) => (
// //             <div key={i} className="mb-2">
// //               <strong>{msg.senderName}:</strong> {msg.content}
// //               <div className="text-xs text-gray-500">
// //                 {new Date(msg.timestamp).toLocaleTimeString()}
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       <div className="flex gap-2">
// //         <input
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           className="flex-1 border p-2 rounded"
// //           placeholder="Type a message..."
// //           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
// //         />
// //         <button 
// //           onClick={sendMessage}
// //           disabled={!isConnected}
// //           className={`px-4 py-2 rounded ${
// //             isConnected 
// //               ? 'bg-blue-500 text-white hover:bg-blue-600' 
// //               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //           }`}
// //         >
// //           Send
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useLoginStore } from '@/stores/apis/auth/login.store';
// import { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// type Message = {
//   senderId: string;
//   senderName: string;
//   content: string;
//   timestamp: string;
// };

// export default function ChatPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const socketRef = useRef<ReturnType<typeof io> | null>(null);

//   const accessToken = useLoginStore((state) => state.accessToken);
//   // const currentUser = useLoginStore((state) => state.user); // optional, if available in store

//   const receiverId = 'TARGET_USER_ID'; // 🔁 Replace with actual ID or selection later

//   useEffect(() => {
//     if (!accessToken) {
//       console.error('No access token available');
//       return;
//     }

//     const socket = io('http://localhost:3000/chat', {
//       auth: { token: accessToken },
//       transports: ['websocket'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 3000,
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => {
//       setIsConnected(true);
//       console.log('✅ Connected to chat server');
//     });

//     socket.on('disconnect', () => {
//       setIsConnected(false);
//       console.log('❌ Disconnected from chat server');
//     });

//     socket.on('newMessage', (message: Message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     socket.on('userStatus', (data: { userId: string; status: string }) => {
//       const { userId, status } = data;
//       console.log(`ℹ️ User ${userId} is now ${status}`);
//     });

//     socket.on('connect_error', (err: Error) => {
//       console.error('Socket connection error:', err);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [accessToken]);

//   const sendMessage = () => {
//     if (!socketRef.current || !input.trim()) return;

//     const messagePayload = {
//       receiverId: receiverId,
//       content: input.trim(),
//       type: 'text',
//     };

//     socketRef.current.emit('sendMessage', messagePayload, (response: { status: string }) => {
//       console.log('✅ Server acknowledged message:', response.status);
//     });

//     // Optimistic render (optional)
//     setMessages((prev) => [
//       ...prev,
//       {
//         senderId: 'me',
//         senderName: 'Me',
//         content: input,
//         timestamp: new Date().toISOString(),
//       },
//     ]);

//     setInput('');
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <div className={`p-2 mb-4 ${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}>
//         Status: {isConnected ? 'Connected' : 'Disconnected'}
//       </div>

//       <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-white shadow">
//         {messages.length === 0 ? (
//           <p className="text-gray-500 text-center">No messages yet</p>
//         ) : (
//           messages.map((msg, i) => (
//             <div key={i} className="mb-3">
//               <div className="font-semibold">{msg.senderName}</div>
//               <div>{msg.content}</div>
//               <div className="text-xs text-gray-400">
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border p-2 rounded"
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           disabled={!isConnected}
//           className={`px-4 py-2 rounded ${
//             isConnected
//               ? 'bg-blue-500 text-white hover:bg-blue-600'
//               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }