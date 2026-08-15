import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Buttons in the pixel language.
 *
 * The press is the whole idea: a raised button carries a hard offset shadow
 * and, on :active, travels exactly that offset so it lands flush with the
 * page. That is `.pixel-press` — displacement rather than the scale(0.95)
 * this used to do, which shrank the hit target under the finger mid-tap.
 *
 * Only the two variants that commit to something (default, destructive) are
 * raised. Outline, secondary and ghost stay flat, so a row of buttons reads
 * its own hierarchy from elevation without needing colour to do all of it.
 * ------------------------------------------------------------------------- */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Flat. Measured across mistral.ai: 2–3 shadowed elements per page out
      // of several thousand, and nothing moves on press. Hierarchy comes from
      // fill and border, which is all a square UI actually needs.
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:border-primary hover:bg-accent hover:text-accent-foreground",
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
