import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Buttons.
 *
 * Flat: measured across mistral.ai, 2–3 shadowed elements per page out of
 * several thousand, and nothing moves on press. Hierarchy comes from fill and
 * border, which is all a square UI needs.
 *
 * The primary button is *inverted*, not brand-coloured. Their CTA is
 * near-white ink on the dark page (#F4F4F5 on #151524) with the brand colour
 * spent entirely on pixel art and accents — a coloured button would compete
 * with the one thing on the page that is meant to be colourful. The landing
 * hero here already does this with --landing-hero-ink; `default` brings the
 * rest of the app in line, and `brand` stays available for the rare case that
 * genuinely wants ember.
 *
 * Inverting also means the pair is --foreground on --background, which is the
 * body-text pair the contrast gate already holds at AA in both themes.
 * ------------------------------------------------------------------------- */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-foreground/88 bg-foreground text-background",
        brand: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent hover:border-foreground hover:bg-foreground/[0.06]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 rounded-none px-3",
        lg: "h-12 rounded-none px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        data-ui-button=""
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
