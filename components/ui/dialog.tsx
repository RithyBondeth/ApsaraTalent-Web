import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideX } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-scrim/80 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/* ---------------------------------------------------------------------------
 * The dialog surface.
 *
 * Everything the surface *is* lives here: square corners, the 5px cobalt top
 * edge that marks app chrome, and the hard offset shadow. Call sites had been
 * restating all three — and disagreeing while they did it. Across 20 dialogs
 * there were five that swapped the accent to `border-t-foreground`, four that
 * fell back to a soft `shadow-2xl`/`shadow-lg`, five that squared the close
 * button by hand with `[&>button]:rounded-none`, and a dozen that repeated
 * `rounded-none` the base already set.
 *
 * Only two shapes were ever actually needed, so they are variants rather than
 * per-site class strings:
 *
 *   default  padded body — a title, some copy, a footer
 *   flush    the dialog draws its own header/body/footer bands edge to edge
 *
 * Anything else a call site needs (a width, a height, a scroll container)
 * still goes through `className`. The surface itself does not.
 * ------------------------------------------------------------------------- */
const dialogContentVariants = cva(
  "fixed left-0 right-0 top-1/2 isolate z-50 mx-auto flex max-h-[90vh] w-[94vw] -translate-y-1/2 flex-col overflow-hidden rounded-none border border-t-[5px] border-border border-t-foreground bg-background shadow-hard-lg duration-200 focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      variant: {
        // 24px all round, and a real gap between header, body and footer.
        // This was `gap-0 px-3 py-4`: 12px of horizontal padding put content
        // almost against the edge, and with no gap every call site had to
        // invent its own spacing — which is why no two dialogs lined up.
        default: "gap-5 p-6",
        // The dialog draws its own bands, so it owns its padding too.
        flush: "gap-0 p-0",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
        full: "max-w-5xl",
      },
    },
    defaultVariants: { variant: "default", size: "lg" },
  },
);

interface IDialogContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  /** Hide the built-in close button for dialogs that must not be dismissed. */
  hideClose?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  IDialogContentProps
>(({ className, children, variant, size, hideClose, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "auth-dialog-surface",
        dialogContentVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      {children}
      {/* Square, like every other control in the app. This used to be
          rounded-full with a soft `shadow-sm`, which is why five call sites
          carried a `[&>button]:rounded-none` override to undo it. */}
      {hideClose ? null : (
        <DialogPrimitive.Close className="absolute right-4 top-4 z-[110] flex size-8 items-center justify-center rounded-none border border-border bg-background/90 text-foreground opacity-80 backdrop-blur-xl transition-all hover:bg-foreground hover:text-background hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 disabled:pointer-events-none">
          <LucideX className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 pr-8 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "auth-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
