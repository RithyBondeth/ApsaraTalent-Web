"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TParsedResumeData,
  useParseResumeStore,
} from "@/stores/apis/auth/parse-resume.store";
import {
  LucideBriefcase,
  LucideCheckCircle2,
  LucideChevronDown,
  LucideChevronUp,
  LucideFileText,
  LucideMail,
  LucidePhone,
  LucideSparkles,
  LucideUpload,
  LucideUser,
  LucideX,
  LucideZap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

/* ---------------------------------- Helper ---------------------------------- */
function Chip({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-none border bg-background px-2.5 py-0.5 text-[11px] text-foreground/80">
      {icon}
      {label}
    </span>
  );
}

export default function SmartResumeUpload({
  onParsed,
}: {
  onParsed: (data: TParsedResumeData) => void;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");

  /* ------------------------------- All States ------------------------------- */
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  const { loading, data, parseResume, reset } = useParseResumeStore();

  /* --------------------------------- Methods -------------------------------- */
  // ── Drag handlers ───────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // ── Drag handlers ───────────────────────────────────────────
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // ── File handler ────────────────────────────────────────────
  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        toast.error(t("smartUploadPdfOnly"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("smartUploadFileTooLarge"));
        return;
      }

      const parsed = await parseResume(file);
      if (parsed) {
        onParsed(parsed);
        setShowDetails(true);
      } else {
        toast.error(t("smartUploadFailed"));
      }
    },
    [onParsed, parseResume, t],
  );

  // ── Drag handlers ───────────────────────────────────────────
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // ── Field count helper ──────────────────────────────────────
  const countFilledFields = (d: TParsedResumeData): number => {
    let count = 0;
    if (d.jobTitle) count++;
    if (d.yearsOfExperience) count++;
    if (d.availability) count++;
    if (d.description) count++;
    if (d.skills?.length) count++;
    if (d.experiences?.length) count++;
    if (d.educations?.length) count++;
    if (d.careerScopes?.length) count++;
    return count;
  };

  /* ----------------------------------- Render UI ---------------------------------- */
  /* --------------------------------- Success State -------------------------------- */
  if (data) {
    const filled = countFilledFields(data);
    return (
      <div className="w-full overflow-hidden rounded-none border border-l-[5px] border-green-500/30 border-l-green-500 bg-green-50/50 dark:bg-green-950/20">
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <LucideCheckCircle2 className="size-4 shrink-0 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {t("smartUploadSuccess", { count: filled })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowDetails((p) => !p)}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {showDetails ? (
                <>
                  {t("smartUploadHide")}
                  <LucideChevronUp className="size-3.5" />
                </>
              ) : (
                <>
                  {t("smartUploadShowDetails")}
                  <LucideChevronDown className="size-3.5" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={t("smartUploadClear")}
            >
              <LucideX className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Details Panel Section */}
        {showDetails && (
          <div className="space-y-3 border-t border-green-500/20 px-4 py-3">
            {/* Personal Info Found Section (Reference only) */}
            {(data.firstName || data.email || data.phone) && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  {t("smartUploadFoundInResume")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data.firstName || data.lastName) && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 text-xs font-normal"
                    >
                      <LucideUser className="size-3" />
                      {[data.firstName, data.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </Badge>
                  )}
                  {data.email && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 text-xs font-normal"
                    >
                      <LucideMail className="size-3" />
                      {data.email}
                    </Badge>
                  )}
                  {data.phone && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 text-xs font-normal"
                    >
                      <LucidePhone className="size-3" />
                      {data.phone}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Auto-filled Professional Fields Section */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                {t("smartUploadAutoFilled")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.jobTitle && (
                  <Chip
                    icon={<LucideBriefcase className="size-3" />}
                    label={data.jobTitle}
                  />
                )}
                {data.yearsOfExperience && (
                  <Chip
                    icon={<LucideSparkles className="size-3" />}
                    label={data.yearsOfExperience}
                  />
                )}
                {data.skills?.length ? (
                  <Chip
                    label={t("smartUploadSkillCount", {
                      count: data.skills.length,
                    })}
                  />
                ) : null}
                {data.experiences?.length ? (
                  <Chip
                    label={t("smartUploadExpCount", {
                      count: data.experiences.length,
                    })}
                  />
                ) : null}
                {data.educations?.length ? (
                  <Chip
                    label={t("smartUploadEduCount", {
                      count: data.educations.length,
                    })}
                  />
                ) : null}
                {data.careerScopes?.length ? (
                  <Chip
                    label={t("smartUploadCareerCount", {
                      count: data.careerScopes.length,
                    })}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------- Loading State -------------------------------- */
  if (loading) {
    return (
      <div className="flex w-full flex-col items-center gap-3 rounded-none border border-l-[5px] border-dashed border-primary/40 border-l-primary bg-primary/5 px-6 py-8">
        {/* Icon Section */}
        <div className="flex size-10 animate-pulse items-center justify-center rounded-full bg-primary/10">
          <LucideFileText className="size-5 text-primary" />
        </div>
        {/* Content Section */}
        <div className="text-center">
          <p className="text-sm font-medium">{t("smartUploadAnalyzing")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("smartUploadAnalyzingDesc")}
          </p>
        </div>
        {/* Loading Animation Section */}
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-1.5 animate-bounce rounded-full bg-primary/60"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* --------------------------------- Idle / Drop Zone State -------------------------------- */
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`w-full rounded-none border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? "scale-[1.01] border-primary bg-primary/10"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-7 text-center">
        {/* Icon Section */}
        <div
          className={`flex size-11 items-center justify-center rounded-full transition-colors ${isDragging ? "bg-primary/20" : "bg-primary/10"}`}
        >
          <LucideZap
            className={`size-5 transition-colors ${isDragging ? "text-primary" : "text-primary/70"}`}
          />
        </div>

        {/* Copy Section */}
        <div>
          <p className="text-sm font-semibold">{t("smartUploadTitle")}</p>
          <p className="mt-0.5 max-w-xs text-xs text-muted-foreground">
            {t("smartUploadSubtitle")}
          </p>
        </div>

        {/* CTA Button Section */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <LucideUpload className="size-3.5" />
          {t("smartUploadBrowse")}
        </Button>

        {/* Hint Section */}
        <p className="text-[11px] text-muted-foreground">
          {t("smartUploadHint")}
        </p>

        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
