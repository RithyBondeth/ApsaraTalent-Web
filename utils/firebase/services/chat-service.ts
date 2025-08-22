import { chatDatabase } from "@/utils/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface UserProfile {
  id: string;
  name: string;
  profile: string;
  role?: string;
}

export interface ChatData {
  id: string;
  participants: string[];
  participantProfiles: Record<string, UserProfile>;
  createdAt: any;
  lastMessage: string;
  lastMessageAt: any;
}

/**
 * Creates a new chat or returns existing chat between two users
 */
export const createOrGetChat = async (
  user1: UserProfile,
  user2: UserProfile
): Promise<string> => {
  try {
    const participants = [user1.id, user2.id].sort();
    const chatRef = collection(chatDatabase, "chats");

    // Check if chat already exists
    const q = query(chatRef, where("participants", "==", participants));
    const existing = await getDocs(q);
    
    if (!existing.empty) {
      return existing.docs[0].id;
    }

    // Create new chat
    const newChat = await addDoc(chatRef, {
      participants,
      createdAt: serverTimestamp(),
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
      participantProfiles: {
        [user1.id]: {
          name: user1.name,
          profile: user1.profile,
          role: user1.role,
        },
        [user2.id]: {
          name: user2.name,
          profile: user2.profile,
          role: user2.role,
        },
      },
    });

    return newChat.id;
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    throw new Error("Failed to create or retrieve chat");
  }
};

/**
 * Gets chat data by ID
 */
export const getChatById = async (chatId: string): Promise<ChatData | null> => {
  try {
    const chatRef = doc(chatDatabase, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (!chatSnap.exists()) {
      return null;
    }

    return {
      id: chatSnap.id,
      ...chatSnap.data(),
    } as ChatData;
  } catch (error) {
    console.error("Error getting chat:", error);
    throw new Error("Failed to retrieve chat");
  }
};

/**
 * Updates participant profile in all their chats
 */
export const updateUserProfileInChats = async (
  userId: string,
  profile: Partial<UserProfile>
): Promise<void> => {
  try {
    const chatsRef = collection(chatDatabase, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));
    const chatsSnap = await getDocs(q);

    const updatePromises = chatsSnap.docs.map(async (chatDoc) => {
      const chatRef = doc(chatDatabase, "chats", chatDoc.id);
      const updateData: any = {};
      updateData[`participantProfiles.${userId}`] = {
        ...chatDoc.data().participantProfiles[userId],
        ...profile,
      };
      
      return updateDoc(chatRef, updateData);
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating user profile in chats:", error);
    throw new Error("Failed to update user profile in chats");
  }
};

/**
 * Marks messages as read for a user in a chat
 */
export const markMessagesAsRead = async (
  chatId: string,
  userId: string
): Promise<void> => {
  try {
    const messagesRef = collection(chatDatabase, "chats", chatId, "messages");
    const q = query(messagesRef, where("senderId", "!=", userId), where("isRead", "==", false));
    const messagesSnap = await getDocs(q);

    const updatePromises = messagesSnap.docs.map(async (messageDoc) => {
      const messageRef = doc(chatDatabase, "chats", chatId, "messages", messageDoc.id);
      return updateDoc(messageRef, { isRead: true });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw new Error("Failed to mark messages as read");
  }
};
