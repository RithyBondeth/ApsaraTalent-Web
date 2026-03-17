import { IChatPreview } from "../props";

export interface IChatHeaderProps {
  chat: IChatPreview;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** Mobile: navigates back to the conversations list */
  onBack?: () => void;
  /** Mobile: opens the sidebar overlay sheet */
  onOpenMobileSidebar?: () => void;
}
