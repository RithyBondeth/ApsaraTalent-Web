import { useRef, useState } from "react";

export function useReferenceFilesState() {
  // Resume States
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveResumeDialog, setOpenRemoveResumeDialog] =
    useState<boolean>(false);

  // CoverLetter States
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveCoverLetterDialog, setOpenRemoveCoverLetterDialog] =
    useState<boolean>(false);

  // Reference States
  const [openReferencePreview, setOpenReferencePreview] = useState(false);
  const [previewReferenceType, setPreviewReferenceType] = useState<
    "resume" | "coverletter"
  >("resume");
  const [previewReferenceUrl, setPreviewReferenceUrl] = useState<string>("");

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
