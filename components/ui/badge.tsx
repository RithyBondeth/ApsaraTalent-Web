import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/* Matches the status pill on mistral.ai/models: Space Mono at 12px, weight
 * 400, letter-spacing normal, uppercase, 4px 8px of padding on a fill one step
 * up from the surface. The 4px radius is theirs too — one of the few places
 * that design is not square, and it is deliberate: a pill this small reads as
 * a tag rather than as a cell of the grid.
 *
 * `secondary` is the neutral status shape; `default` is for the rare pill that
 * has to carry the brand. */
const badgeVariants = cva(
  "pixel-label inline-flex items-center rounded border px-2 py-1 text-[12px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-popover text-popover-foreground hover:bg-popover/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
