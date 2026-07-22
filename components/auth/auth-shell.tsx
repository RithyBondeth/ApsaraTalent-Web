import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";
import AuthBrandPanel from "./auth-brand-panel";

/* ----------------------------------- Helper ----------------------------------- */
interface IAuthShellProps {
  children: React.ReactNode;
  /** The page's own illustration, shown as the brand-panel hero. */
  image?: StaticImageData;
  imageAlt?: string;
  /** Dynamic per-page brand-panel copy (i18n keys under the "auth" namespace). */
  eyebrowKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  /** Widen the form column for multi-column signup wizards. */
  wide?: boolean;
  className?: string;
}

export default function AuthShell(props: IAuthShellProps) {
  /* ----------------------------------- Props ----------------------------------- */
  const {
    children,
    image,
    imageAlt,
    eyebrowKey,
    titleKey,
    subtitleKey,
    wide = false,
    className,
  } = props;

  /* --------------------------------- Render UI --------------------------------- */
  return (
    <div className="auth-scope relative flex min-h-screen w-full bg-background">
      {/* Form Column Section */}
      <div
        className={cn(
          "relative flex flex-1 flex-col px-6 sm:px-10",
          wide ? "py-6 sm:py-8" : "py-14",
        )}
      >
        {/* Quiet Warm Flourish Section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_100%_0%,hsl(var(--foreground)/0.035),transparent_60%)]"
        />
        <div
          className={cn(
            "auth-form-container relative mx-auto my-auto w-full",
            wide ? "max-w-[680px]" : "max-w-[440px]",
            className,
          )}
        >
          {children}
        </div>
      </div>

      {/* Brand Panel Section: Pinned to the viewport as the form scrolls */}
      <AuthBrandPanel
        image={image}
        imageAlt={imageAlt}
        eyebrowKey={eyebrowKey}
        titleKey={titleKey}
        subtitleKey={subtitleKey}
        className="lg:sticky lg:top-0 lg:h-screen lg:self-start lg:basis-[46%] lg:max-w-[760px]"
      />
    </div>
  );
}
