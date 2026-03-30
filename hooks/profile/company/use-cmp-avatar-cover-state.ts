import { useEffect, useRef, useState } from "react";

export function useCmpAvatarCoverState() {
  /* --------------------------------- All States -------------------------------- */
  // ── Avatar States ─────────────────────────────────────────
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openAvatarPopup, setOpenAvatarPopup] = useState<boolean>(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] =
    useState<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [openCropDialog, setOpenCropDialog] = useState<boolean>(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>("");

  // ── Cover States ─────────────────────────────────────────
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveCoverDialog, setOpenRemoveCoverDialog] =
    useState<boolean>(false);
  const [openCoverCropDialog, setOpenCoverCropDialog] =
    useState<boolean>(false);
  const [coverCropImageUrl, setCoverCropImageUrl] = useState<string>("");

  // ── Shared States ─────────────────────────────────────────
  const ignoreNextClick = useRef<boolean>(false);

  /* ---------------------------------- Effects --------------------------------- */
  useEffect(() => {
    return () => {
      if (cropImageUrl?.startsWith("blob:")) URL.revokeObjectURL(cropImageUrl);
      if (coverCropImageUrl?.startsWith("blob:"))
        URL.revokeObjectURL(coverCropImageUrl);
    };
  }, [cropImageUrl, coverCropImageUrl]);

  /* ---------------------------------- Return ---------------------------------- */
  return {
    avatarFile,
    setAvatarFile,
    openAvatarPopup,
    setOpenAvatarPopup,
    openRemoveAvatarDialog,
    setOpenRemoveAvatarDialog,
    openCropDialog,
    setOpenCropDialog,
    cropImageUrl,
    setCropImageUrl,
    avatarInputRef,

    coverFile,
    setCoverFile,
    openRemoveCoverDialog,
    setOpenRemoveCoverDialog,
    openCoverCropDialog,
    setOpenCoverCropDialog,
    coverCropImageUrl,
    setCoverCropImageUrl,
    coverInputRef,

    ignoreNextClick,
  };
}
