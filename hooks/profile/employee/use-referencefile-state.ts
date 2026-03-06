import { useRef, useState } from "react";

export function useReferenceFilesState() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const [openRemoveResumeDialog, setOpenRemoveResumeDialog] = useState(false);
  const [openRemoveCoverLetterDialog, setOpenRemoveCoverLetterDialog] =
    useState(false);

  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);

  const [openReferencePreview, setOpenReferencePreview] = useState(false);
  const [previewReferenceType, setPreviewReferenceType] = useState<
    "resume" | "coverletter"
  >("resume");
  const [previewReferenceUrl, setPreviewReferenceUrl] = useState("");

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
