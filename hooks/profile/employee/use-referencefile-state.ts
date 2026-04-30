import { useRef, useState } from "react";

/* ----------------------------------- Hook ----------------------------------- */
export function useReferenceFilesState() {
  /* -------------------------------- All States -------------------------------- */
  // ── Resume States ─────────────────────────────────────────
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveResumeDialog, setOpenRemoveResumeDialog] =
    useState<boolean>(false);

  // ── Cover Letter States ─────────────────────────────────────────
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveCoverLetterDialog, setOpenRemoveCoverLetterDialog] =
    useState<boolean>(false);

  // ── Preview States ─────────────────────────────────────────
  const [openReferencePreview, setOpenReferencePreview] = useState(false);
  const [previewReferenceType, setPreviewReferenceType] = useState<
    "resume" | "coverletter"
  >("resume");
  const [previewReferenceUrl, setPreviewReferenceUrl] = useState<string>("");

  /* --------------------------------- Methods ---------------------------------- */
  return {
    resumeFile,
    setResumeFile,
    coverLetterFile,
    setCoverLetterFile,
    openRemoveResumeDialog,
    setOpenRemoveResumeDialog,
    openRemoveCoverLetterDialog,
    setOpenRemoveCoverLetterDialog,
    resumeInputRef,
    coverLetterInputRef,
    openReferencePreview,
    setOpenReferencePreview,
    previewReferenceType,
    setPreviewReferenceType,
    previewReferenceUrl,
    setPreviewReferenceUrl,
  };
}
