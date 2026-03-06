import { useEffect, useRef, useState } from "react";

export function useAvatarState() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openAvatarPopup, setOpenAvatarPopup] = useState(false);
  const [openRemoveAvatarDialog, setOpenRemoveAvatarDialog] = useState(false);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState("");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const ignoreNextClick = useRef(false);

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
    ignoreNextClick,
  };
}
