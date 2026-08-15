import type { TPixelPetPose } from "./sprites";

export interface IPixelPetProps {
  /**
   * Which sprite to draw. Pick by what the surface means: `rest` for an empty
   * list, `wave` for a greeting, `cheer` for a match or a completed profile,
   * `idle` for everything else.
   */
  pose?: TPixelPetPose;
  /**
   * Rendered height in px. Multiples of 34 keep cell edges on whole pixels
   * (68, 102, 136); the sprite is 24 wide × 34 tall, so width follows.
   */
  height?: number;
  /**
   * Accessible name. Omit for decoration beside copy that already names her —
   * the sprite then renders aria-hidden rather than being announced twice.
   */
  label?: string;
  className?: string;
}
