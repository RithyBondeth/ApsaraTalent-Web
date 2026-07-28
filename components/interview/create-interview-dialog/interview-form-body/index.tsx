"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import {
  LucideCalendarCheck,
  LucideClock,
  LucideLink,
  LucideMapPin,
  LucideTimer,
  LucideUser,
} from "lucide-react";
import { IInterviewFormBodyProps } from "./props";
import { useLanguageStore } from "@/stores/languages/language-store";
import { km, enUS } from "date-fns/locale";

/* --------------------------------- Helper --------------------------------- */
function Field({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="text-muted-foreground [&>svg]:size-3.5">{icon}</span>
        )}
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      </div>
      {children}
    </div>
  );
}

export function InterviewFormBody(props: IInterviewFormBodyProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    t,
    currentCompanyMatching,
    selectedEmployeeId,
    setSelectedEmployeeId,
    title,
    setTitle,
    description,
    setDescription,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    durationMinutes,
    setDurationMinutes,
    location,
    setLocation,
    meetingLink,
    setMeetingLink,
    scheduledAt,
    today,
    error,
    creating,
    canSubmit,
    onClose,
    onSubmit,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const { language } = useLanguageStore();
  const dateLocale = language === "km" ? km : enUS;
  const displayLocale = language === "km" ? "km" : undefined;
  const minLabel = t("durationMin");

  /* -------------------------------- All States ------------------------------ */
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
        {/* Employee Select Section */}
        <Field label={t("selectEmployee")} required icon={<LucideUser />}>
          {currentCompanyMatching && currentCompanyMatching.length > 0 ? (
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder={t("chooseMatchedEmployee")} />
              </SelectTrigger>
              <SelectContent>
                {currentCompanyMatching.map((emp) => {
                  const name =
                    [emp.firstname, emp.lastname]
                      .filter(Boolean)
                      .join(" ")
                      .trim() ||
                    emp.username ||
                    "Unknown";
                  return (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2.5 py-0.5">
                        <Avatar className="size-6 shrink-0">
                          <AvatarImage src={emp.avatar} alt={name} />
                          <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium">{name}</span>
                        {emp.job && (
                          <span className="ml-1 shrink-0 text-xs text-muted-foreground">
                            {emp.job}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ) : (
            <TypographyMuted className="rounded-none border-l-[4px] border-l-foreground bg-muted/50 px-3 py-2.5 text-sm">
              {t("noMatchedEmployees")}
            </TypographyMuted>
          )}
        </Field>

        {/* Title Input Section */}
        <Field
          label={t("interviewTitle")}
          required
          icon={<LucideCalendarCheck />}
        >
          <Input
            placeholder={t("interviewTitlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        {/* Description Input Section */}
        <Field label={t("description")}>
          <Textarea
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[72px] resize-none"
          />
        </Field>

        <Separator />

        {/* Date and Time Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <LucideCalendarCheck className="size-3.5 text-muted-foreground" />
            <Label className="text-sm font-medium">
              {t("dateTime")}
              <span className="text-destructive ml-0.5">*</span>
            </Label>
          </div>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <LucideCalendarCheck className="mr-2 size-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString(displayLocale, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : t("pickDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                disabled={{ before: today }}
                locale={dateLocale}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="mt-1 grid grid-cols-2 gap-3">
            <Field label={t("time")} icon={<LucideClock />}>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="h-10"
              />
            </Field>

            <Field label={t("duration")} icon={<LucideTimer />}>
              <div className="flex items-center h-10 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background">
                <input
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => {
                    const v = Math.max(
                      5,
                      Math.min(480, Number(e.target.value) || 5),
                    );
                    setDurationMinutes(v);
                  }}
                  className="w-full bg-transparent text-sm outline-none tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="ml-1.5 shrink-0 text-sm text-muted-foreground">
                  {minLabel}
                </span>
              </div>
            </Field>
          </div>
        </div>

        <Separator />

        {/* Optional Details Section */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("optional")}
          </p>

          <Field label={t("location")} icon={<LucideMapPin />}>
            <Input
              placeholder={t("locationPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Field>

          <Field label={t("meetingLink")} icon={<LucideLink />}>
            <Input
              placeholder={t("meetingLinkPlaceholder")}
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </Field>
        </div>

        {error && (
          <p className="rounded-none border border-destructive/20 border-l-[4px] border-l-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      {/* Footer Action Section */}
      <Separator />
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div className="text-xs text-muted-foreground">
          {selectedDate && scheduledAt
            ? t("scheduledAtSummary", {
                date: selectedDate.toLocaleDateString(displayLocale, {
                  month: "short",
                  day: "numeric",
                }),
                time: selectedTime,
              })
            : t("noDateSelected")}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button size="sm" onClick={onSubmit} disabled={!canSubmit}>
            {creating ? t("scheduling") : t("scheduleInterview")}
          </Button>
        </div>
      </div>
    </>
  );
}
