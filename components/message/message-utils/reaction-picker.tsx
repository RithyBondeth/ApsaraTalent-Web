"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CHAT_REACTION_EMOJIS } from "@/utils/constants/chat.constant";
import { Smile } from "lucide-react";

interface IReactionPickerProps {
  onReact: (emoji: string | null) => void;
  currentReaction?: string;
}

export const ReactionPicker = (props: IReactionPickerProps) => {
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
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm"
        >
          <Smile className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-fit p-1 rounded-full shadow-lg border-muted bg-background/95 backdrop-blur-md"
      >
        <div className="flex gap-1">
          {CHAT_REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReactionSelect(emoji)}
              className={`p-2 transition-all hover:scale-125 rounded-full hover:bg-muted ${
                currentReaction === emoji ? "bg-primary/20 scale-110" : ""
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
