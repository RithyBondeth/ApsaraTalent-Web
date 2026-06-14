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

/* --------------------------------- Helpers -------------------------------- */
function Chip({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] bg-background border rounded-full px-2.5 py-0.5 text-foreground/80">
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

  // ── Drag handlers ───────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  // ── File handler ────────────────────────────────────────────
  const handleFile = async (file: File) => {
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
  };

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
      <div className="w-full rounded-xl border border-green-500/30 bg-green-50/50 dark:bg-green-950/20 overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <LucideCheckCircle2 className="size-4 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {t("smartUploadSuccess", { count: filled })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowDetails((p) => !p)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded"
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
              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title={t("smartUploadClear")}
            >
              <LucideX className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Details Panel Section */}
        {showDetails && (
          <div className="border-t border-green-500/20 px-4 py-3 space-y-3">
            {/* Personal Info Found Section (Reference only) */}
            {(data.firstName || data.email || data.phone) && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
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
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
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
      <div className="w-full rounded-xl border border-dashed border-primary/40 bg-primary/5 px-6 py-8 flex flex-col items-center gap-3">
        {/* Icon Section */}
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <LucideFileText className="size-5 text-primary" />
        </div>
        {/* Content Section */}
        <div className="text-center">
          <p className="text-sm font-medium">{t("smartUploadAnalyzing")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("smartUploadAnalyzingDesc")}
          </p>
        </div>
        {/* Loading Animation Section */}
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-1.5 rounded-full bg-primary/60 animate-bounce"
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
      className={`w-full rounded-xl border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.01]"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className="px-6 py-7 flex flex-col items-center gap-3 text-center">
        {/* Icon Section */}
        <div
          className={`size-11 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-primary/20" : "bg-primary/10"}`}
        >
          <LucideZap
            className={`size-5 transition-colors ${isDragging ? "text-primary" : "text-primary/70"}`}
          />
        </div>

        {/* Copy Section */}
        <div>
          <p className="text-sm font-semibold">{t("smartUploadTitle")}</p>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
            {t("smartUploadSubtitle")}
          </p>
        </div>

        {/* CTA Button Section */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 mt-1"
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
