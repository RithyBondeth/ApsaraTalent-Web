import type { TPixelPetExpression } from "./sprites";

export interface IPixelPetProps {
  /**
   * Which face to draw. `smiling` is the default and the only one that still
   * reads once shrunk to display size; `serene` and `resting` are for calmer
   * surfaces where she is larger.
   *
   * There are no poses — this is a bust, so there are no arms to gesture with.
   */
  expression?: TPixelPetExpression;
  /**
   * Rendered height in px. Multiples of 34 keep cell edges on whole pixels
   * (68, 102, 136); the sprite is 32 wide × 34 tall, so width follows.
   */
  height?: number;
  /**
   * Accessible name. Omit for decoration beside copy that already names her —
   * she then renders aria-hidden rather than being announced twice.
   */
  label?: string;
  className?: string;
}
