import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import React from "react";
import { ISettingWrapperProps } from "./props";

export function SettingWrapper(props: ISettingWrapperProps) {
  /* --------------------------------- Props --------------------------------- */
  const { icon, title, description, children } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section className="flex flex-col gap-3">
      {/* Setting Wrapper Header Section */}
      <div className="flex items-start gap-3">
        {/* Setting Wrapper Icon Section */}
        <div className="flex size-9 shrink-0 items-center justify-center bg-foreground text-background">
          <span className="[&>svg]:size-4">{icon}</span>
        </div>

        {/* Setting Wrapper Title and Description Section */}
        <div className="flex min-w-0 flex-col pt-0.5">
          <TypographySmall className="pixel-display">{title}</TypographySmall>
          <TypographyMuted className="mt-1 text-xs leading-5">
            {description}
          </TypographyMuted>
        </div>
      </div>

      {/* Setting Wrapper Content Section */}
      <div className="overflow-hidden border border-t-[4px] border-border border-t-primary bg-card shadow-[4px_4px_0_hsl(var(--foreground)/0.05)]">
        {children}
      </div>
    </section>
  );
}
