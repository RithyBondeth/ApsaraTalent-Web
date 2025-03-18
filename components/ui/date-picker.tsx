import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  popoverSide?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className = "",
  disabled = false,
  popoverSide = "bottom",
  dateFormat = "PPP",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between border rounded-md px-4 py-6 text-left text-muted-foreground bg-primary-foreground",
            !date && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side={popoverSide}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}