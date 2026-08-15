"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideInbox, LucideTriangleAlert } from "lucide-react";
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
        "flex w-full flex-col items-center justify-center gap-4 border border-t-[5px] border-border bg-card px-4 text-center shadow-[5px_5px_0_hsl(var(--foreground)/0.055)]",
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
          className="animate-float h-28 w-28 object-contain grayscale motion-reduce:animate-none sm:h-40 sm:w-40"
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "grid size-14 place-items-center border",
            isError
              ? "border-destructive/25 bg-destructive/10 text-destructive"
              : "border-primary/25 bg-primary/10 text-primary",
          )}
        >
          {isError ? (
            <LucideTriangleAlert className="size-6" />
          ) : (
            <LucideInbox className="size-6" />
          )}
        </span>
      )}

      {/* State Copy Section */}
      <div className="flex max-w-lg flex-col gap-2">
        <h2
          className={cn(
            "pixel-display text-lg sm:text-xl",
            isError ? "text-destructive" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-6 text-muted-foreground">
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
