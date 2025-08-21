// import { db } from "@/lib/firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   Timestamp,
// } from "firebase/firestore";

// export const createOrGetChat = async (uid1: string, uid2: string): Promise<string> => {
//   const participants = [uid1, uid2].sort(); // 🔑 Always sort

//   const chatRef = collection(db, "chats");

//   // ✅ Query for exact sorted participants
//   const q = query(chatRef, where("participants", "==", participants));

//   const existing = await getDocs(q);
//   if (!existing.empty) {
//     return existing.docs[0].id;
//   }

//   // ✅ Create new chat
//   const newChat = await addDoc(chatRef, {
//     participants,
//     createdAt: Timestamp.now(),
//     lastMessage: "",
//     lastMessageAt: Timestamp.now(),
//     participantProfiles: {
//       [uid1]: {
//         name: "Placeholder name for uid1",
//         profile: "Placeholder profile url",
//       },
//       [uid2]: {
//         name: "Placeholder name for uid2",
//         profile: "Placeholder profile url",
//       },
//     },
//   });

//   return newChat.id;
// };

// utils/firebase/chatService.ts
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

interface UserProfile {
  id: string;
  name: string;
  profile: string;
}

export const createOrGetChat = async (
  user1: UserProfile,
  user2: UserProfile
): Promise<string> => {
  const participants = [user1.id, user2.id].sort();
  const chatRef = collection(db, "chats");

  const q = query(chatRef, where("participants", "==", participants));
  const existing = await getDocs(q);
  if (!existing.empty) {
    return existing.docs[0].id;
  }

  const newChat = await addDoc(chatRef, {
    participants,
    createdAt: Timestamp.now(),
    lastMessage: "",
    lastMessageAt: Timestamp.now(),
    participantProfiles: {
      [user1.id]: {
        name: user1.name,
        profile: user1.profile,
      },
      [user2.id]: {
        name: user2.name,
        profile: user2.profile,
      },
    },
  });

  return newChat.id;
};
