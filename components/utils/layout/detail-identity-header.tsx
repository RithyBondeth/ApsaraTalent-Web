import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideArrowLeft } from "lucide-react";
import React from "react";

/* --------------------------------- Helpers --------------------------------- */
interface IDetailIdentityHeaderProps {
  title: string;
  subtitle?: string | null;
  avatar?: string | null;
  cover?: string | null;
  fallback: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  menu?: React.ReactNode;
  backLabel: string;
  onBack: () => void;
  onAvatarClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Shared identity-first header for employee and company detail pages. */
export function DetailIdentityHeader({
  title,
  subtitle,
  avatar,
  cover,
  fallback,
  meta,
  actions,
  menu,
  backLabel,
  onBack,
  onAvatarClick,
}: IDetailIdentityHeaderProps) {
  /* ------------------------------- Render UI ------------------------------- */
  return (
    <>
      <header className="sticky top-0 z-20 -mx-3 border-b border-border/70 bg-background/90 px-3 backdrop-blur-xl sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5">
        {/* Back Button Section */}
        <div className="flex min-w-0 items-center gap-3 py-2.5">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LucideArrowLeft className="size-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
          <div className="h-5 w-px shrink-0 bg-border" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {title}
          </span>
          {menu}
        </div>
      </header>

      {/* Profile Detail Header Section */}
      <section className="profile-detail-header overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.045)]">
        {/* Cover Image Section */}
        <div
          className="relative h-28 bg-[hsl(var(--illustration-surface))] bg-cover bg-center sm:h-32"
          style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        >
          {cover && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
          )}
          {!cover && (
            <>
              <span className="absolute -right-8 -top-12 size-36 rounded-full border border-brand/15" />
              <span className="absolute right-20 top-7 size-3 rounded-full bg-brand/25" />
              <span className="absolute bottom-5 left-[42%] h-px w-24 bg-border/80" />
            </>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Section */}
            <button
              type="button"
              onClick={onAvatarClick}
              disabled={!onAvatarClick}
              aria-label={title}
              className="-mt-9 shrink-0 rounded-xl outline-none transition-transform duration-300 enabled:cursor-pointer enabled:hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:-mt-10"
            >
              <Avatar
                className="size-20 ring-[3px] ring-card shadow-[0_10px_28px_hsl(var(--foreground)/0.14)] sm:size-24"
                rounded="md"
              >
                <AvatarImage src={avatar ?? ""} />
                <AvatarFallback className="text-xl font-bold uppercase">
                  {fallback}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Profile Info Section */}
            <div className="min-w-0 flex-1 pt-3 tablet-md:mt-1 tablet-md:pt-0 tablet-md:text-center">
              <h1 className="text-2xl font-bold leading-tight tracking-[-0.03em] sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
              {meta && (
                <div className="mt-3 flex flex-wrap gap-2 tablet-md:justify-center">
                  {meta}
                </div>
              )}
            </div>

            {actions && (
              <div className="flex shrink-0 gap-2 pt-3 tablet-md:hidden">
                {actions}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
