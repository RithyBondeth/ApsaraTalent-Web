"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LucideInbox,
  LucideTriangleAlert,
  type LucideIcon,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

interface IPageStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface IPageStateProps {
  variant: "empty" | "error";
  title: string;
  description?: string;
  image?: StaticImageData | string;
  imageAlt?: string;
  /**
   * The glyph for this particular state. Without it every empty state in the
   * app shows the same inbox, so "no messages", "no interviews" and "no search
   * results" are indistinguishable at a glance. Ignored when `image` is set.
   * Error states always use the warning triangle.
   */
  icon?: LucideIcon;
  action?: IPageStateAction;
  compact?: boolean;
  className?: string;
}

export function PageState(props: IPageStateProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    variant,
    title,
    description,
    image,
    imageAlt = "",
    icon: Icon,
    action,
    compact = false,
    className,
  } = props;

  /* -------------------------------- Render UI -------------------------------- */
  const isError = variant === "error";
  const actionClassName = cn(
    "min-w-32 px-5 text-xs",
    isError &&
      "border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive",
  );
  const actionButton = action ? (
    <Button
      type="button"
      variant={isError ? "outline" : "default"}
      onClick={action.onClick}
      className={actionClassName}
    >
      {action.label}
    </Button>
  ) : null;

  return (
    <section
      role={isError ? "alert" : "region"}
      aria-label={title}
      aria-live={isError ? "assertive" : "polite"}
      className={cn(
        "flex w-full flex-col items-center justify-center border border-t-[5px] border-border bg-card px-4 text-center shadow-hard",
        compact ? "gap-3" : "gap-4",
        isError
          ? "border-t-destructive bg-destructive/[0.025]"
          : "border-t-primary",
        compact ? "min-h-64 py-9 sm:py-10" : "min-h-[55vh] py-12",
        className,
      )}
    >
      {/* State Visual Section */}
      {image ? (
        <Image
          src={image}
          alt={imageAlt}
          aria-hidden={imageAlt === ""}
          height={200}
          width={200}
          className={cn(
            "animate-float object-contain grayscale motion-reduce:animate-none",
            compact ? "size-20 sm:size-24" : "h-28 w-28 sm:h-40 sm:w-40",
          )}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "grid place-items-center border",
            compact ? "size-11" : "size-14",
            isError
              ? "border-destructive/25 bg-destructive/10 text-destructive"
              : "border-primary/25 bg-primary/10 text-primary",
          )}
        >
          {(() => {
            const Glyph = isError ? LucideTriangleAlert : (Icon ?? LucideInbox);
            return <Glyph className={compact ? "size-5" : "size-6"} />;
          })()}
        </span>
      )}

      {/* State Copy Section
       *
       * The title used to be `text-lg font-black sm:text-xl` in both modes —
       * the weight reserved for the page `h1`, at a size above every section
       * heading in the app. A compact state sitting inside a settings card was
       * typeset larger than the card's own title, and identically to one
       * filling the viewport. It now takes its scale from where it lives:
       * subordinate inside a section, prominent when it *is* the page. */}
      <div
        className={cn(
          "flex flex-col",
          compact ? "max-w-md gap-1" : "max-w-lg gap-2",
        )}
      >
        <h2
          className={cn(
            compact
              ? "text-base font-bold tracking-[-0.015em]"
              : "text-lg font-black tracking-[-0.025em] sm:text-xl",
            isError ? "text-destructive" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-muted-foreground",
              compact ? "text-xs leading-5" : "text-sm leading-6",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* State Action Section */}
      {action?.href ? (
        <Button
          asChild
          variant={isError ? "outline" : "default"}
          className={actionClassName}
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : (
        actionButton
      )}
    </section>
  );
}
