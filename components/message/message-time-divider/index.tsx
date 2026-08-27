import { getDateDividerLabel } from "@/utils/functions/date";

export default function MessageTimeDivider({
  timestamp,
}: {
  timestamp: Date | string;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const label = getDateDividerLabel(timestamp);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="my-8 flex items-center gap-4">
      {/* Time Divider Line Section */}
      <div className="h-[1px] flex-1 bg-muted-foreground/10" />
      {/* Time Divider Label Section */}
      <div className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {/* Time Divider Line Section */}
      <div className="h-[1px] flex-1 bg-muted-foreground/10" />
    </div>
  );
}
