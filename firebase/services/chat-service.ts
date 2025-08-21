import { chatDatabase } from "@/firebase/firebase";
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
  const chatRef = collection(chatDatabase, "chats");

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
