"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { emptySvgImage } from "@/utils/constants/asset.constant";
import {
  LucideCalendarCheck,
  LucideCheck,
  LucideClock,
  LucideLink,
  LucideMapPin,
  LucidePlus,
  LucideX,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import InterviewLoadingSkeleton from "./loading";
import { getStatusBadgeStyleClass } from "@/utils/extensions/get-interview-status-class";
import { dateFormatter } from "@/utils/functions/dateformatter";

export default function InterviewPage() {
  /* ----------------------------- API Integration ---------------------------- */
  const {
    interviews,
    creating,
    error,
    fetchInterviews,
    createInterview,
    updateStatus,
  } = useInterviewStore();

  const { currentCompanyMatching, queryCurrentCompanyMatching } =
    useGetCurrentCompanyMatchingStore();

  /* -------------------------------- All States ------------------------------ */
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    scheduledAt: string;
    durationMinutes: number;
    location: string;
    meetingLink: string;
  }>({
    title: "",
    description: "",
    scheduledAt: "",
    durationMinutes: 30,
    location: "",
    meetingLink: "",
  });

  /* --------------------------------- Effects --------------------------------- */
  const { isEmployee, isCompany, currentUser } = useFetchOnce({
    cacheKey: "interview-page",
    onEmployeeFetch: (employeeId) => fetchInterviews(employeeId, "employee"),
    onCompanyFetch: (companyId) => {
      fetchInterviews(companyId, "company");
      queryCurrentCompanyMatching(companyId);
    },
  });

  const currentId = isEmployee
    ? currentUser?.employee?.id
    : currentUser?.company?.id;

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Create Interview ─────────────────────────────────────────
  const handleCreateInterview = useCallback(async () => {
    if (
      !currentId ||
      !selectedEmployeeId ||
      !formData.title ||
      !formData.scheduledAt
    )
      return;

    const payload = {
      employeeId: selectedEmployeeId,
      companyId: currentId,
      title: formData.title,
      description: formData.description || undefined,
      scheduledAt: new Date(formData.scheduledAt).toISOString(),
      durationMinutes: formData.durationMinutes,
      location: formData.location || undefined,
      meetingLink: formData.meetingLink || undefined,
      createdBy: "company" as const,
    };

    await createInterview(payload);
    setDialogOpen(false);
    setSelectedEmployeeId("");
    setFormData({
      title: "",
      description: "",
      scheduledAt: "",
      durationMinutes: 30,
      location: "",
      meetingLink: "",
    });
  }, [currentId, selectedEmployeeId, formData, createInterview]);

  // ── Handle Accept Interview ─────────────────────────────────────────
  const handleAccept = useCallback(
    (interviewId: string) => updateStatus(interviewId, "accepted"),
    [updateStatus],
  );

  // ── Handle Decline Interview ─────────────────────────────────────────
  const handleDecline = useCallback(
    (interviewId: string) => updateStatus(interviewId, "declined"),
    [updateStatus],
  );

  /* ------------------------------ Laoding State ----------------------------- */
  if (interviews === null) return <InterviewLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-4 px-2.5 sm:px-5 animate-page-in">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TypographyH2>Interviews</TypographyH2>

        {/* Schedule Interview Form Section  */}
        {isCompany && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <LucidePlus className="size-4" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Schedule Interview</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                {/* Select matched employee */}
                <div className="flex flex-col gap-1.5">
                  <Label>Select Employee *</Label>
                  {currentCompanyMatching &&
                  currentCompanyMatching.length > 0 ? (
                    <Select
                      value={selectedEmployeeId}
                      onValueChange={setSelectedEmployeeId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a matched employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCompanyMatching &&
                          currentCompanyMatching.map((emp) => {
                            const displayName =
                              [emp.firstname, emp.lastname]
                                .filter(Boolean)
                                .join(" ")
                                .trim() ||
                              emp.username ||
                              "Unknown";
                            return (
                              <SelectItem key={emp.id} value={emp.id}>
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="size-6">
                                    <AvatarImage
                                      src={emp.avatar}
                                      alt={displayName}
                                    />
                                    <AvatarFallback className="text-[10px]">
                                      {displayName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="truncate">
                                    {displayName}
                                  </span>
                                  {emp.job && (
                                    <span className="text-xs text-muted-foreground ml-auto">
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
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                      No matched employees yet. You need to match with employees
                      before scheduling interviews.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Technical Interview Round 1"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Interview details..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="scheduledAt">Date & Time *</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          scheduledAt: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={15}
                      max={180}
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          durationMinutes: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Office address or room"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetingLink}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meetingLink: e.target.value,
                      }))
                    }
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  onClick={handleCreateInterview}
                  disabled={
                    creating ||
                    !selectedEmployeeId ||
                    !formData.title ||
                    !formData.scheduledAt
                  }
                >
                  {creating ? "Scheduling..." : "Schedule Interview"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Interview List */}
      {interviews.length > 0 ? (
        <div className="flex flex-col gap-3 stagger-list">
          {interviews.map((interview) => {
            const isCreator =
              interview.createdBy === (isEmployee ? "employee" : "company");
            const showActions = interview.status === "pending" && !isCreator;
            const otherPartyName = isEmployee
              ? (interview.company?.name ?? "Company")
              : `${interview.employee?.firstname ?? ""} ${interview.employee?.lastname ?? ""}`.trim() ||
                interview.employee?.username ||
                "Employee";

            return (
              <div
                key={interview.id}
                className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20"
              >
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold leading-tight truncate">
                        {interview.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        with {otherPartyName}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold whitespace-nowrap ${getStatusBadgeStyleClass(interview.status)}`}
                    >
                      {interview.status.charAt(0).toUpperCase() +
                        interview.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Description */}
                  {interview.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {interview.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full">
                      <LucideCalendarCheck className="size-3.5" />
                      {dateFormatter(interview.scheduledAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full">
                      <LucideClock className="size-3.5" />
                      {interview.durationMinutes} min
                    </span>
                    {interview.location && (
                      <span className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full">
                        <LucideMapPin className="size-3.5" />
                        {interview.location}
                      </span>
                    )}
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-muted/70 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
                      >
                        <LucideLink className="size-3.5" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                {showActions && (
                  <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => handleDecline(interview.id)}
                    >
                      <LucideX className="size-3.5" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => handleAccept(interview.id)}
                    >
                      <LucideCheck className="size-3.5" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="w-full flex flex-col items-center justify-center my-16">
          <Image
            src={emptySvgImage}
            alt="empty"
            height={200}
            width={200}
            className="animate-float"
          />
          <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
            {isEmployee
              ? "No interviews scheduled yet. Companies will schedule interviews with you after matching."
              : 'No interviews scheduled yet. Click "Schedule Interview" to get started.'}
          </TypographyP>
        </div>
      )}
    </div>
  );
}
