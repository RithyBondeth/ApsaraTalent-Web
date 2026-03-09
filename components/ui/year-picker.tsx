"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface YearPickerProps {
  year: number | undefined;
  onYearChange: (year: number | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
}

const YEARS_PER_PAGE = 12;

export function YearPicker({
  year,
  onYearChange,
  placeholder = "Pick a year",
  className = "",
  disabled = false,
  fromYear = 1950,
  toYear = new Date().getFullYear() + 10,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(() => {
    const startYear = year ?? new Date().getFullYear();
    return Math.floor((startYear - fromYear) / YEARS_PER_PAGE);
  });

  const totalPages = Math.ceil((toYear - fromYear + 1) / YEARS_PER_PAGE);
  const pageStartYear = fromYear + page * YEARS_PER_PAGE;
  const pageEndYear = Math.min(pageStartYear + YEARS_PER_PAGE - 1, toYear);

  const years: number[] = [];
  for (let y = pageStartYear; y <= pageEndYear; y++) {
    years.push(y);
  }

  const handleSelect = (selectedYear: number) => {
    onYearChange(selectedYear);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between border rounded-md px-4 py-6 text-left text-muted-foreground bg-primary-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          {year ? (
            <span className="text-foreground">{year}</span>
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {pageStartYear} - {pageEndYear}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Year Grid */}
        <div className="grid grid-cols-3 gap-1">
          {years.map((y) => (
            <Button
              key={y}
              variant={y === year ? "default" : "ghost"}
              size="sm"
              className="h-9 w-full text-sm"
              onClick={() => handleSelect(y)}
            >
              {y}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
