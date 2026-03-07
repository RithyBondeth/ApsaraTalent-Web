import { useState } from "react";

export default function useCmpImageState() {
  const [openImagePopup, setOpenImagePopup] = useState<boolean>(false);
  const [currentCompanyImage, setCurrentCompanyImage] = useState<string | null>(
    null,
  );
  const [openRemoveImageDialog, setOpenRemoveImageDialog] =
    useState<boolean>(false);
  const [removedImage, setRemoveImage] = useState<{
    id: string;
    index: number;
  } | null>(null);

  return {
    openImagePopup,
    setOpenImagePopup,
    currentCompanyImage,
    setCurrentCompanyImage,
    openRemoveImageDialog,
    setOpenRemoveImageDialog,
    removedImage,
    setRemoveImage,
  };
}
