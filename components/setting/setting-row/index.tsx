import React from "react";
import { Separator } from "@/components/ui/separator";
import { ISettingRowProps } from "./props";

export function SettingRow(props: ISettingRowProps) {
  /* --------------------------------- Props --------------------------------- */
  const { icon, label, value, last = false } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-muted-foreground shrink-0 [&>svg]:size-4">
            {icon}
          </span>
          <span className="text-sm font-medium truncate">{label}</span>
        </div>
        <div className="shrink-0 text-sm text-muted-foreground">{value}</div>
      </div>
      {!last && <Separator />}
    </>
  );
}
