import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { cn } from "@/lib/utils";
import React from "react";
import { ISettingWrapperProps } from "./props";

export function SettingWrapper(props: ISettingWrapperProps) {
  /* --------------------------------- Props --------------------------------- */
  const { icon, title, description, children, className } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section className={cn("flex h-full flex-col gap-4", className)}>
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
      <div className="min-h-0 flex-1 overflow-hidden border border-border bg-card">
        {children}
      </div>
    </section>
  );
}
