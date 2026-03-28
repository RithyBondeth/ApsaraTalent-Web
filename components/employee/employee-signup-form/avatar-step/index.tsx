import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import AvatarCropDialog from "@/components/utils/dialogs/avatar-crop-dialog";
import { DragDropFile } from "@/components/utils/forms/drag-drop-file";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useEffect, useState } from "react";

export default function AvatarStepForm({
  setValue,
  getValues,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  /* -------------------------------- All States ------------------------------ */
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Files Selected ─────────────────────────────────────────
  const handleFilesSelected = (files: File[]): void => {
    const file = files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setCropDialogOpen(true);
    }
  };

  // ── Handle Crop Completed ─────────────────────────────────────────
  const handleCropComplete = (croppedFile: File) => {
    setValue?.("avatar", croppedFile, { shouldValidate: true });
    const objectUrl = URL.createObjectURL(croppedFile);
    setPreview(objectUrl);
  };

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    const avatar = getValues?.("avatar");
    if (avatar) {
      let objectUrl = "";
      if (avatar instanceof File) objectUrl = URL.createObjectURL(avatar);
      else if (typeof avatar === "string") objectUrl = avatar;

      setPreview(objectUrl);
    }
  }, [getValues]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Title Section */}
      <TypographyH4>Add your profile picture (Optional)</TypographyH4>

      {/* Drag Drop File Section */}
      <div className="w-full flex justify-center">
        {setValue && (
          <DragDropFile<TEmployeeSignUp>
            preview={preview}
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes="image/*"
            maxFileSize={5242880}
            multiple={false}
            boxText="Drop your company profile picture here"
            boxSubText="JPG, PNG or GIF files up to 5MB"
            fileName="avatar"
            setValue={setValue}
          />
        )}
      </div>

      {/* Validation Message Section */}
      {errors?.avatar && <ErrorMessage>{errors.avatar.message}</ErrorMessage>}

      {/* Avatar Crop Dialog Section */}
      {selectedImage && (
        <AvatarCropDialog
          title="Crop Profile Picture"
          open={cropDialogOpen}
          setOpen={setCropDialogOpen}
          image={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
