import AuthBrandPanel from "@/components/auth/auth-brand-panel";
import LogoComponent from "@/components/utils/brand/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IAuthShellProps } from "./props";

export default function AuthShell(props: IAuthShellProps) {
  /* ----------------------------------- Props ----------------------------------- */
  const {
    children,
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
          "auth-form-column relative flex flex-1 flex-col px-6 sm:px-10 lg:px-12 xl:px-16",
          wide ? "py-6 sm:py-8" : "py-8 sm:py-10 lg:py-12",
        )}
      >
        <Link
          href="/"
          aria-label="Apsara Talent home"
          className="auth-mobile-logo relative z-10 mb-10 inline-flex w-fit lg:hidden"
        >
          <LogoComponent className="!h-14 w-auto" />
        </Link>

        <div
          className={cn(
            "auth-form-container relative mx-auto my-auto w-full",
            wide ? "max-w-[880px]" : "max-w-[480px]",
            className,
          )}
        >
          {children}
        </div>
      </div>

      {/* Brand Panel Section: Pinned to the viewport as the form scrolls */}
      <AuthBrandPanel
        eyebrowKey={eyebrowKey}
        titleKey={titleKey}
        subtitleKey={subtitleKey}
        className={cn(
          "lg:sticky lg:top-0 lg:h-screen lg:self-start",
          wide
            ? "lg:max-w-[560px] lg:basis-[35%]"
            : "lg:max-w-[680px] lg:basis-[42%]",
        )}
      />
    </div>
  );
}
