"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface ReactionPickerProps {
  onReact: (emoji: string | null) => void;
  currentReaction?: string;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export const ReactionPicker = ({
  onReact,
  currentReaction,
}: ReactionPickerProps) => {
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
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(emoji === currentReaction ? null : emoji)}
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
