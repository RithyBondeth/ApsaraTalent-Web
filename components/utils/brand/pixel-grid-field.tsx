import { cn } from "@/lib/utils";

type PixelGridTone = "orange" | "yellow" | "blue" | "paper";

interface PixelGridFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: PixelGridTone;
  animated?: boolean;
  hero?: boolean;
  compact?: boolean;
  mirror?: boolean;
  className?: string;
  contentClassName?: string;
}

export function PixelGridField({
  tone = "orange",
  animated = false,
  hero = false,
  compact = false,
  mirror = false,
  className,
  contentClassName,
  children,
  ...rootProps
}: PixelGridFieldProps) {
  return (
    <div
      {...rootProps}
      className={cn(
        "pixel-grid-field",
        `pixel-grid-field--${tone}`,
        animated && "pixel-grid-field--animated",
        hero && "pixel-grid-field--hero",
        compact && "pixel-grid-field--compact",
        mirror && "pixel-grid-field--mirror",
        className,
      )}
    >
      <div aria-hidden="true" className="pixel-grid-field__mosaic">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} className="pixel-grid-field__block" />
        ))}
      </div>
      <div aria-hidden="true" className="pixel-grid-field__junctions">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
