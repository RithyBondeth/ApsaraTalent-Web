/* --------------------------------- Helpers --------------------------------- */
interface IFeaturePageHeaderProps {
  title: string;
  description: string;
}

/** A compact editorial introduction for authenticated feature pages. */
export function FeaturePageHeader({
  title,
  description,
}: IFeaturePageHeaderProps) {
  /* ------------------------------- Render UI ------------------------------- */
  return (
    <header className="feature-page-header relative w-full border-b border-border/80 pb-5 pt-1 sm:pb-6">
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Feature Header Mark Section */}
        <div
          className="feature-header-mark relative mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card shadow-sm sm:size-11"
          aria-hidden="true"
        >
          <span className="size-3.5 rounded-full bg-brand" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-foreground/70" />
        </div>

        {/* Feature Header Title and Description Section */}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-foreground sm:text-[1.75rem]">
            {title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}
