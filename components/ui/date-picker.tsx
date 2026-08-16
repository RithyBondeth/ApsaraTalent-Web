"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import type { CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { enUS, km } from "date-fns/locale";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((module) => module.Calendar),
  { ssr: false },
);

interface DatePickerProps extends Omit<
  ButtonProps,
  "value" | "defaultValue" | "onChange"
> {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  popoverSide?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  popoverClassName?: string;
  calendarClassName?: string;
  calendarDisabled?: CalendarProps["disabled"];
  calendarToDate?: Date;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder,
  className = "",
  disabled = false,
  popoverSide = "bottom",
  dateFormat = "PPP",
  popoverClassName,
  calendarClassName,
  calendarDisabled,
  calendarToDate,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
  ...triggerProps
}: DatePickerProps) {
  const localeCode = useLocale();
  const t = useTranslations("calendar");
  const locale = localeCode === "km" ? km : enUS;
  const [open, setOpen] = React.useState(false);
  const isValidDate = date instanceof Date && isValid(date);
  const resolvedPlaceholder = placeholder ?? t("selectDate");

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    if (selectedDate) setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between rounded-md border bg-primary-foreground px-4 py-6 text-left text-muted-foreground",
            !isValidDate && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          disabled={disabled}
          {...triggerProps}
        >
          {isValidDate ? (
            format(date, dateFormat, { locale })
          ) : (
            <span>{resolvedPlaceholder}</span>
          )}
          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "auth-calendar-popover w-[var(--radix-popover-trigger-width)] min-w-[17.5rem] max-w-[calc(100vw-1.5rem)] overflow-hidden p-0",
          popoverClassName,
        )}
        align="start"
        side={popoverSide}
        sideOffset={8}
        aria-label={t("selectDate")}
      >
        <Calendar
          mode="single"
          selected={isValidDate ? date : undefined}
          defaultMonth={isValidDate ? date : undefined}
          onSelect={handleSelect}
          initialFocus
          disabled={disabled ? true : calendarDisabled}
          fromYear={fromYear}
          toYear={toYear}
          toDate={calendarToDate}
          captionLayout="dropdown-buttons"
          locale={locale}
          className={calendarClassName}
        />
      </PopoverContent>
    </Popover>
  );
}
