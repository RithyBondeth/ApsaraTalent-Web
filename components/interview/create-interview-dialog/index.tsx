"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideCalendarCheck,
  LucideClock,
  LucideLink,
  LucideMapPin,
  LucidePlus,
  LucideTimer,
  LucideUser,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
import { ICreateInterviewDialogProps } from "./props";
import { cn } from "@/lib/utils";

/* ─── Duration options ─────────────────────────────────────── */
const DURATION_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hr" },
  { value: 90, label: "1 hr 30 min" },
  { value: 120, label: "2 hr" },
];

/* ─── Time slots every 30 min ──────────────────────────────── */
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const hh = String(h).padStart(2, "0");
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { value: `${hh}:${m}`, label: `${h12}:${m} ${suffix}` };
});

/* ─── Field wrapper ────────────────────────────────────────── */
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

/* ─── Shared form body ─────────────────────────────────────── */
function InterviewFormBody({
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
}: any) {
  return (
    <>
      <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto">
        {/* ── Employee ── */}
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
                {currentCompanyMatching.map((emp: any) => {
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
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate">{name}</span>
                        {emp.job && (
                          <span className="text-xs text-muted-foreground ml-1 shrink-0">
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
            <TypographyMuted className="text-sm bg-muted/50 rounded-lg px-3 py-2.5">
              {t("noMatchedEmployees")}
            </TypographyMuted>
          )}
        </Field>

        {/* ── Title ── */}
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

        {/* ── Description ── */}
        <Field label={t("description")}>
          <Textarea
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none min-h-[72px]"
          />
        </Field>

        <Separator />

        {/* ── Date ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <LucideCalendarCheck className="size-3.5 text-muted-foreground" />
            <Label className="text-sm font-medium">
              {t("dateTime")}
              <span className="text-destructive ml-0.5">*</span>
            </Label>
          </div>

          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <LucideCalendarCheck className="mr-2 size-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: today }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <Field label="Time" icon={<LucideClock />}>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-52">
                  {TIME_SLOTS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t("duration")} icon={<LucideTimer />}>
              <Select
                value={String(durationMinutes)}
                onValueChange={(v) => setDurationMinutes(Number(v))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={String(value)}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <Separator />

        {/* ── Optional ── */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Optional
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
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <Separator />
      <div className="px-6 py-4 flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {selectedDate && scheduledAt
            ? `${selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${TIME_SLOTS.find((s) => s.value === selectedTime)?.label}`
            : "No date selected"}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmit} disabled={!canSubmit}>
            {creating ? t("scheduling") : t("scheduleInterview")}
          </Button>
        </div>
      </div>
    </>
  );
}

/* ─── Component ────────────────────────────────────────────── */
export function CreateInterviewDialog({
  currentId,
  currentCompanyMatching,
}: ICreateInterviewDialogProps) {
  const t = useTranslations("interview");
  const { creating, error, createInterview } = useInterviewStore();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const scheduledAt = useMemo(() => {
    if (!selectedDate) return "";
    const [hh, mm] = selectedTime.split(":").map(Number);
    const dt = new Date(selectedDate);
    dt.setHours(hh, mm, 0, 0);
    return dt.toISOString();
  }, [selectedDate, selectedTime]);

  const canSubmit =
    !!selectedEmployeeId && !!title.trim() && !!scheduledAt && !creating;

  const resetForm = useCallback(() => {
    setSelectedEmployeeId("");
    setTitle("");
    setDescription("");
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setDurationMinutes(30);
    setLocation("");
    setMeetingLink("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const handleCreate = useCallback(async () => {
    if (!canSubmit || !currentId) return;
    await createInterview({
      employeeId: selectedEmployeeId,
      companyId: currentId,
      title: title.trim(),
      description: description.trim() || undefined,
      scheduledAt,
      durationMinutes,
      location: location.trim() || undefined,
      meetingLink: meetingLink.trim() || undefined,
      createdBy: "company",
    });
    setOpen(false);
    resetForm();
  }, [
    canSubmit,
    currentId,
    selectedEmployeeId,
    title,
    description,
    scheduledAt,
    durationMinutes,
    location,
    meetingLink,
    createInterview,
    resetForm,
  ]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const formProps = {
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
    onClose: handleClose,
    onSubmit: handleCreate,
  };

  const trigger = (
    <Button size="sm">
      <LucidePlus className="size-4" />
      {t("scheduleInterview")}
    </Button>
  );

  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
        <LucideCalendarCheck className="size-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fill in the details to schedule an interview
        </p>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetForm();
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="text-lg font-semibold">
              {t("scheduleInterview")}
            </DialogTitle>
            {headerContent}
          </DialogHeader>
          <Separator className="shrink-0" />
          <div className="flex-1 overflow-y-auto flex flex-col">
            <InterviewFormBody {...formProps} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] flex flex-col p-0 rounded-t-2xl"
      >
        <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
          <SheetTitle className="text-lg font-semibold">
            {t("scheduleInterview")}
          </SheetTitle>
          {headerContent}
        </SheetHeader>
        <Separator className="shrink-0" />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <InterviewFormBody {...formProps} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
