import { Button } from "@/components/ui/button";
import { ReactionPicker } from "../message-utils/reaction-picker";
import { Pencil, Reply, Trash2 } from "lucide-react";

interface MessageBubbleActionsProps {
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

export function MessageBubbleActions(props: MessageBubbleActionsProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    isVisible,
    canReply,
    canEdit,
    canDelete,
    currentReaction,
    onReply,
    onReact,
    onEdit,
    onDelete,
  } = props;

  if (!isVisible) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-0.5">
      {canReply && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onReply}
          aria-label="Reply to message"
        >
          <Reply className="h-3.5 w-3.5" />
        </Button>
      )}

      <ReactionPicker onReact={onReact} currentReaction={currentReaction} />

      {canEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onEdit}
          aria-label="Edit message"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          aria-label="Delete message"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
