export interface IMessageBubbleActionsProps {
  isVisible: boolean;
  canReply: boolean;
  canEdit: boolean;
  canDelete: boolean;
  currentReaction?: string;
  onReply?: () => void;
  onReact: (emoji: string | null) => void;
  onEdit: () => void;
  onDelete: () => void;
}
