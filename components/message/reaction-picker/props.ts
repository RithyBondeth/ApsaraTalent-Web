export interface IReactionPickerProps {
  onReact: (emoji: string | null) => void;
  currentReaction?: string;
}
