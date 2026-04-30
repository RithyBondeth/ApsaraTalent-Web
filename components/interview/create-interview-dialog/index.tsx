import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { LucidePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { ICreateInterviewDialogProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export function CreateInterviewDialog({
  currentId,
  currentCompanyMatching,
}: ICreateInterviewDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("interview");

  /* ----------------------------------- Form --------------------------------- */
  const { creating, error, createInterview } = useInterviewStore();

  /* -------------------------------- All States ------------------------------ */
  const [open, setOpen] = useState<boolean>(false);
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

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Create Interview ─────────────────────────────────────────
  const handleCreate = useCallback(async () => {
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

    setOpen(false);
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

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Dialog Trigger Section */}
      <DialogTrigger asChild>
        <Button size="sm">
          <LucidePlus className="size-4" />
          {t("scheduleInterview")}
        </Button>
      </DialogTrigger>

      {/* Dialog Content Section */}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("scheduleInterview")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {/* Select Matched Employee Section */}
          <div className="flex flex-col gap-1.5">
            <Label>{t("selectEmployee")} *</Label>
            {currentCompanyMatching && currentCompanyMatching.length > 0 ? (
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("chooseMatchedEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {currentCompanyMatching.map((emp) => {
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
                            <AvatarImage src={emp.avatar} alt={displayName} />
                            <AvatarFallback className="text-[10px]">
                              {displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{displayName}</span>
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
              <TypographyMuted className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                {t("noMatchedEmployees")}
              </TypographyMuted>
            )}
          </div>

          {/* Title Section */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">{t("interviewTitle")} *</Label>
            <Input
              id="title"
              placeholder={t("interviewTitlePlaceholder")}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              placeholder={t("descriptionPlaceholder")}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Date Time and Duration Section */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Time Section */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scheduledAt">{t("dateTime")} *</Label>
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

            {/* Duration Section */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">{t("duration")}</Label>
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

          {/* Location Section */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              placeholder={t("locationPlaceholder")}
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          {/* Meeting Link Section */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meetingLink">{t("meetingLink")}</Label>
            <Input
              id="meetingLink"
              placeholder={t("meetingLinkPlaceholder")}
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  meetingLink: e.target.value,
                }))
              }
            />
          </div>

          {/* Error Section */}
          {error && (
            <TypographyP className="[&:not(:first-child)]:mt-0 text-sm text-destructive">
              {error}
            </TypographyP>
          )}

          {/* Create Button Section */}
          <Button
            onClick={handleCreate}
            disabled={
              creating ||
              !selectedEmployeeId ||
              !formData.title ||
              !formData.scheduledAt
            }
          >
            {creating ? t("scheduling") : t("scheduleInterview")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
