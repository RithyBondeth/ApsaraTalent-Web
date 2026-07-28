import React from "react";
import { Separator } from "@/components/ui/separator";
import { ISettingRowProps } from "./props";

export function SettingRow(props: ISettingRowProps) {
  /* --------------------------------- Props --------------------------------- */
  const { icon, label, value, last = false } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Setting Row Section */}
      <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        {/* Setting Row Left Section */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-foreground [&>svg]:size-4">
            {icon}
          </span>
          <span className="text-sm font-medium truncate">{label}</span>
        </div>

        {/* Setting Row Right Section */}
        <div className="pl-11 text-sm text-muted-foreground sm:shrink-0 sm:pl-0 sm:text-right">
          {value}
        </div>
      </div>

      {/* Separator Section */}
      {!last && <Separator />}
    </>
  );
}
