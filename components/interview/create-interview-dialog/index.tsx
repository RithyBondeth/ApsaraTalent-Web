"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { LucideCalendarCheck, LucidePlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ICreateInterviewDialogProps } from "./props";
import { IInterviewFormBodyProps } from "./interview-form-body/props";
import { USER_ROLE } from "@/utils/constants/auth.constant";

const InterviewFormBody = dynamic(
  () =>
    import("./interview-form-body").then((module) => module.InterviewFormBody),
  { ssr: false },
);

export function CreateInterviewDialog({
  currentId,
  currentCompanyMatching,
  initialEmployeeId,
}: ICreateInterviewDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("interview");
  const isDesktop = useMediaQuery("(min-width: 640px)");

  /* -------------------------------- All States ------------------------------ */
  const [open, setOpen] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [location, setLocation] = useState<string>("");
  const [meetingLink, setMeetingLink] = useState<string>("");

  /* ----------------------------- API Integration ---------------------------- */
  const { creating, error, createInterview } = useInterviewStore();

  /* --------------------------------- Effects -------------------------------- */
  // Auto-open and pre-select when navigating from matching page with ?with= param
  useEffect(() => {
    if (initialEmployeeId) {
      setSelectedEmployeeId(initialEmployeeId);
      setOpen(true);
    }
  }, [initialEmployeeId]);

  /* --------------------------------- Methods -------------------------------- */
  // ── Scheduled At ─────────────────────────────────────────────────────
  const scheduledAt = useMemo(() => {
    if (!selectedDate) return "";
    const [hh, mm] = selectedTime.split(":").map(Number);
    const dt = new Date(selectedDate);
    dt.setHours(hh, mm, 0, 0);
    return dt.toISOString();
  }, [selectedDate, selectedTime]);

  const canSubmit =
    !!selectedEmployeeId && !!title.trim() && !!scheduledAt && !creating;

  // ── Reset Form ──────────────────────────────────────────────────────
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

  // ── Handle Close ────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  // ── Handle Create Interview ─────────────────────────────────────────
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
      createdBy: USER_ROLE.COMPANY,
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

  // ── Today Date ──────────────────────────────────────────────────────
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // ── Form Props ──────────────────────────────────────────────────────
  const formProps: IInterviewFormBodyProps = {
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

  // ── Trigger Button ──────────────────────────────────────────────────
  const trigger = (
    <Button size="sm" className="rounded-none">
      <LucidePlus className="size-4" />
      {t("scheduleInterview")}
    </Button>
  );

  // ── Header Content ──────────────────────────────────────────────────
  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-none border border-border bg-muted/60 text-foreground">
        <LucideCalendarCheck className="size-5" />
      </div>
      <div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t("scheduleDescription")}
        </p>
      </div>
    </div>
  );

  /* -------------------------------- Render UI -------------------------------- */
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
        <DialogContent variant="flush" className="sm:max-w-[520px]">
          <DialogHeader className="shrink-0 px-6 pb-4 pt-6">
            <DialogTitle className="text-lg font-semibold">
              {t("scheduleInterview")}
            </DialogTitle>
            {headerContent}
          </DialogHeader>
          <Separator className="shrink-0" />
          <div className="flex flex-1 flex-col overflow-y-auto">
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
        className="flex h-[90vh] flex-col rounded-t-2xl p-0"
      >
        <SheetHeader className="shrink-0 px-6 pb-4 pt-6">
          <SheetTitle className="text-lg font-semibold">
            {t("scheduleInterview")}
          </SheetTitle>
          {headerContent}
        </SheetHeader>
        <Separator className="shrink-0" />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <InterviewFormBody {...formProps} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
