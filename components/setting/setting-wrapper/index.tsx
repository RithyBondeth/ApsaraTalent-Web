import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import React from "react";
import { ISettingWrapperProps } from "./props";

export function SettingWrapper(props: ISettingWrapperProps) {
  /* --------------------------------- Props --------------------------------- */
  const { icon, title, description, children } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section className="setting-section-card overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.04)]">
      {/* Setting Wrapper Header Section */}
      <div className="flex items-start gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
        {/* Setting Wrapper Icon Section */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand-soft">
          <span className="text-brand [&>svg]:size-4">{icon}</span>
        </div>

        {/* Setting Wrapper Title and Description Section */}
        <div className="min-w-0 flex-1 pt-0.5">
          <TypographySmall className="font-semibold leading-tight">
            {title}
          </TypographySmall>
          <TypographyMuted className="mt-1 text-xs leading-relaxed">
            {description}
          </TypographyMuted>
        </div>
      </div>

      {/* Setting Wrapper Content Section */}
      <div>{children}</div>
    </section>
  );
}
