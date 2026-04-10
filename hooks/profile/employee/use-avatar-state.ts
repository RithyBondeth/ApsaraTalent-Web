import { useEffect, useRef, useState } from "react";

/* ----------------------------------- Hook ----------------------------------- */
export function useAvatarState() {
  /* -------------------------------- All States -------------------------------- */
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openAvatarPopup, setOpenAvatarPopup] = useState<boolean>(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] =
    useState<boolean>(false);
  const [openCropDialog, setOpenCropDialog] = useState<boolean>(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>("");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const ignoreNextClick = useRef<boolean>(false);

  /* --------------------------------- Effects ---------------------------------- */
  useEffect(() => {
    return () => {
      if (cropImageUrl?.startsWith("blob:")) URL.revokeObjectURL(cropImageUrl);
    };
  }, [cropImageUrl]);

  /* --------------------------------- Methods ---------------------------------- */
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
    ignoreNextClick,
  };
}
