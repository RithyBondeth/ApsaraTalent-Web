"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PixelPet } from "@/components/utils/brand/pixel-pet";
import { PixelPattern } from "@/components/utils/brand/pixel-pattern";
import { LucideTriangleAlert } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

  /* --------------------------------- Utils ---------------------------------- */
  const t = useTranslations("states");

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
      // A band of the sheet, not a card floating in it. What went:
      //   - the 5px accent rule. A full-width bright bar is the loudest thing
      //     the reference never does; separation there is a 1px hairline.
      //   - the outer border, which doubled the rule of the band above it.
      //   - `min-h-[55vh]`. A page with nothing in it does not earn half a
      //     viewport of void; it earns a short, clear statement.
      //   - centre alignment. Every other surface here is left-aligned
      //     editorial, and an empty state is not the place to break that.
      className={cn(
        "pixel-band relative isolate flex w-full",
        compact && "min-h-full items-center justify-center",
        className,
      )}
    >
      {/* The pixel field. An empty state is the one surface with nothing on it
          to give it structure, so the ground does that work instead of leaving
          a blank rectangle. Seeded from the title so each empty state keeps
          its own arrangement rather than repeating the same tiles. */}
      <PixelPattern seed={title} cell={40} className="-z-10" />

      <div
        className={cn(
          "w-full",
          compact
            ? "flex flex-col items-center gap-6 px-6 py-12 text-center"
            : "grid grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1fr)_auto]",
        )}
      >
        {/* State Copy Section */}
        <div
          className={cn(
            "flex min-w-0 flex-col justify-center",
            compact ? "order-2 items-center" : "pixel-pad items-start",
          )}
        >
          {/* The state's own eyebrow, so an empty list announces itself in the
              same voice as every other section header in the sheet. */}
          <div className="pixel-label flex items-center gap-2 text-muted-foreground">
            <span aria-hidden className="flex shrink-0">
              <span
                className={cn(
                  "size-1",
                  isError ? "bg-destructive" : "bg-pixel-2",
                )}
              />
              <span
                className={cn(
                  "size-1",
                  isError ? "bg-destructive" : "bg-pixel-3",
                )}
              />
              <span
                className={cn(
                  "size-1",
                  isError ? "bg-destructive" : "bg-pixel-5",
                )}
              />
            </span>
            {isError ? t("errorStateLabel") : t("emptyStateLabel")}
          </div>

          <h2
            className={cn(
              "pixel-display mt-4 max-w-[22ch] text-2xl sm:text-3xl",
              compact && "mt-3 max-w-[36ch] text-xl sm:text-2xl",
              isError ? "text-destructive" : "text-foreground",
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-3 text-sm leading-6 text-muted-foreground",
                compact ? "max-w-[46ch]" : "max-w-[52ch]",
              )}
            >
              {description}
            </p>
          )}

          {/* State Action Section */}
          {action ? (
            <div className="mt-6">
              {action.href ? (
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
            </div>
          ) : null}
        </div>

        {/* State Visual Section — its own ruled cell on the right, the same
            split the page banner uses for its stats. */}
        <div
          className={cn(
            "flex justify-center",
            compact
              ? "order-1"
              : "items-end border-t border-border px-8 pt-8 lg:border-l lg:border-t-0 lg:pt-0",
          )}
        >
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              aria-hidden={imageAlt === ""}
              height={200}
              width={200}
              className="h-28 w-28 object-contain sm:h-36 sm:w-36"
            />
          ) : isError ? (
            <span
              aria-hidden
              className="mb-8 grid size-14 place-items-center border border-destructive/25 bg-destructive/10 text-destructive"
            >
              <LucideTriangleAlert className="size-6" />
            </span>
          ) : (
            // An empty list is the one moment with nothing to show, so a
            // character earns the space here as she would nowhere else.
            // `resting` — she is waiting, and so is the page.
            <PixelPet expression="resting" height={compact ? 102 : 136} />
          )}
        </div>
      </div>
    </section>
  );
}
