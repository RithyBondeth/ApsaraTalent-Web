"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { enUS, km } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: suppliedLocale,
  labels,
  lang,
  ...props
}: CalendarProps) {
  const localeCode = useLocale();
  const t = useTranslations("calendar");
  const calendarLocale = suppliedLocale ?? (localeCode === "km" ? km : enUS);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={calendarLocale}
      lang={lang ?? localeCode}
      labels={{
        labelMonthDropdown: () => t("month"),
        labelYearDropdown: () => t("year"),
        labelPrevious: () => t("previousMonth"),
        labelNext: () => t("nextMonth"),
        ...labels,
      }}
      className={cn("w-full p-4", className)}
      classNames={{
        root: "w-full",
        months: "flex w-full flex-col gap-4 sm:flex-row",
        month: "w-full space-y-4",
        caption:
          "grid h-10 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2",
        caption_label: "sr-only",
        caption_dropdowns:
          "col-start-2 row-start-1 flex min-w-0 items-center justify-center gap-2",
        dropdown:
          "h-9 w-full appearance-none border border-input bg-background px-2 text-center text-sm font-medium text-foreground outline-none transition-colors hover:border-foreground/30 focus:border-foreground focus:ring-2 focus:ring-ring/10",
        dropdown_month: "flex min-w-0 flex-1",
        dropdown_year: "flex w-[5.25rem] shrink-0",
        dropdown_icon: "hidden",
        vhidden: "sr-only",
        nav: "contents",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-transparent p-0 text-muted-foreground shadow-none hover:text-foreground",
        ),
        nav_button_previous: "col-start-1 row-start-1",
        nav_button_next: "col-start-3 row-start-1",
        table: "w-full table-fixed border-collapse",
        head: "border-b border-border/70",
        head_row: "flex w-full pb-2",
        head_cell:
          "flex-1 text-center text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
        tbody: "block pt-2",
        row: "mt-1 flex w-full",
        cell: "relative flex aspect-square flex-1 items-center justify-center p-0 text-center text-sm focus-within:z-20 [&:has([aria-selected])]:bg-accent/40",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-full min-h-8 w-full p-0 text-sm font-normal shadow-none aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary font-semibold text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today:
          "border border-foreground/45 bg-transparent font-semibold text-foreground",
        day_outside:
          "day-outside text-muted-foreground/40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled:
          "cursor-not-allowed text-muted-foreground opacity-35 line-through",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      captionLayout="dropdown-buttons"
      fromYear={1900}
      toYear={new Date().getFullYear() + 10}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
