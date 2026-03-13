import { IChatPreview } from "../props";

export interface IChatSidebarProps {
  chats: IChatPreview[] | undefined;
  activeChat: IChatPreview | null;
  isOpen: boolean;
  currentUserId?: string;
  className?: string;
  onChatSelect: (chat: IChatPreview) => void;
}

export interface IChatListProps {
  chats: IChatPreview[] | undefined;
  activeChat: IChatPreview | null;
  currentUserId?: string;
  onChatSelect: (chat: IChatPreview) => void;
}
