import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CHAT_REACTION_EMOJIS } from "@/utils/constants/chat.constant";
import { Smile } from "lucide-react";

export const ReactionPicker = (props: {
  onReact: (emoji: string | null) => void;
  currentReaction?: string;
}) => {
  /* --------------------------------- Props --------------------------------- */
  const { onReact, currentReaction } = props;

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Reaction Select ─────────────────────────────────────────
  const handleReactionSelect = (emoji: string) => {
    onReact(emoji === currentReaction ? null : emoji);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Popover>
      {/* Reaction Picker Trigger Section */}
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none bg-background/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Smile className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      {/* Reaction Picker Section */}
      <PopoverContent
        side="top"
        align="center"
        className="w-fit rounded-none border-muted bg-background/95 p-1 shadow-lg backdrop-blur-md"
      >
        {/* Emoji List Section */}
        <div className="flex gap-1">
          {CHAT_REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReactionSelect(emoji)}
              className={`rounded-none p-2 transition-all hover:scale-125 hover:bg-muted ${
                currentReaction === emoji ? "scale-110 bg-primary/20" : ""
              }`}
            >
              <span className="text-xl leading-none">{emoji}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
