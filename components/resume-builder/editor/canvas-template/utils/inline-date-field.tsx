import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { Editable } from "./editable";

export function InlineDateField(props: {
  value: string;
  placeholder: string;
  onCommit: (v: string) => void;
}) {
  /* ----------------------------------- Props --------------------------------- */
  const { value, placeholder, onCommit } = props;

  /* -------------------------------- All States ------------------------------- */
  const [open, setOpen] = useState<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
  // ── Parse Date ─────────────────────────────────────────
  function parseDate(s: string): Date | undefined {
    if (!s || s.toLowerCase() === "present") return undefined;
    // Try "MMMM yyyy" (e.g. "January 2022")
    const d = parse(s, "MMMM yyyy", new Date());
    if (isValid(d)) return d;
    // Try "MMM yyyy" (e.g. "Jan 2022")
    const d2 = parse(s, "MMM yyyy", new Date());
    if (isValid(d2)) return d2;
    // Fallback
    const d3 = new Date(s);
    return isValid(d3) ? d3 : undefined;
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span className="group/date inline-flex items-center gap-0.5">
      {/* Editable Section */}
      <Editable value={value} placeholder={placeholder} onCommit={onCommit} />
      {/* Popover Section */}
      <Popover open={open} onOpenChange={setOpen}>
        {/* Popover Trigger Section */}
        <PopoverTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            title="Pick a date"
            className="opacity-0 group-hover/date:opacity-50 hover:!opacity-100 transition-opacity ml-0.5"
            style={{ color: "#9ca3af", lineHeight: 1 }}
          >
            <CalendarDays size={10} />
          </button>
        </PopoverTrigger>

        {/* Popover Content Section */}
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <Calendar
            mode="single"
            selected={parseDate(value)}
            onSelect={(d) => {
              if (d) {
                onCommit(format(d, "MMMM yyyy"));
              }
              setOpen(false);
            }}
            fromYear={1950}
            toYear={new Date().getFullYear() + 5}
            captionLayout="dropdown-buttons"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </span>
  );
}
