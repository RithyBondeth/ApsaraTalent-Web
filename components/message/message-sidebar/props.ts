import { IChatPreview } from "../props";

export interface IChatSidebarProps {
  chats: IChatPreview[] | undefined;
  activeChat: IChatPreview | null;
  isOpen: boolean;
  currentUserId?: string;
  className?: string;
  onChatSelect: (chat: IChatPreview) => void;
  /** Called when the mobile close button (×) is pressed */
  onClose?: () => void;
  /**
   * Called when the user clicks the "New Conversation" pencil button.
   * The parent (MessagePage) should open a contact-picker modal or
   * navigate to a user search page.
   */
  onNewChat?: () => void;
}

export interface IChatListProps {
  chats: IChatPreview[] | undefined;
  activeChat: IChatPreview | null;
  currentUserId?: string;
  onChatSelect: (chat: IChatPreview) => void;
}
