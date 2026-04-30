import { IChatPreview } from "@/utils/interfaces/chat/chat.interface";

export interface IChatHeaderProps {
  chat: IChatPreview;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** Mobile: navigates back to the conversations list */
  onBack?: () => void;
  /** Mobile: opens the sidebar overlay sheet */
  onOpenMobileSidebar?: () => void;
  /** Called when the user clicks the voice-call button. */
  onStartVoiceCall?: () => void;
  /** Called when the user clicks the video-call button (future). */
  onStartVideoCall?: () => void;
}
