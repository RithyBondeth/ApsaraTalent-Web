import { IChatPreview } from "../props";

export interface IChatHeaderProps {
  chat: IChatPreview;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}
