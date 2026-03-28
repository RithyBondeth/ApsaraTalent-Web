import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import React from "react";
import { ISettingWrapperProps } from "./props";

export function SettingWrapper(props: ISettingWrapperProps) {
  const { icon, title, description, children } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <span className="text-primary [&>svg]:size-4">{icon}</span>
        </div>
        <div className="flex flex-col">
          <TypographySmall className="font-semibold leading-none">
            {title}
          </TypographySmall>
          <TypographyMuted className="text-xs mt-0.5">
            {description}
          </TypographyMuted>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}
