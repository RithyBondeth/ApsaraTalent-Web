import { useEffect, useRef, useState } from "react";

export function useCmpAvatarCoverState() {
  // Avatar States
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openAvatarPopup, setOpenAvatarPopup] = useState<boolean>(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] =
    useState<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [openCropDialog, setOpenCropDialog] = useState<boolean>(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>("");

  // Cover States
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [openRemoveCoverDialog, setOpenRemoveCoverDialog] =
    useState<boolean>(false);

  // Both Avatar and Cover
  const ignoreNextClick = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (cropImageUrl?.startsWith("blob:")) URL.revokeObjectURL(cropImageUrl);
    };
  }, [cropImageUrl]);

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
    coverInputRef,

    ignoreNextClick,
  };
}
