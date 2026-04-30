import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import AvatarCropDialog from "@/components/utils/dialogs/avatar-crop-dialog";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { DragDropFile } from "@/components/utils/forms/drag-drop-file";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useEffect, useState } from "react";

export default function AvatarCompanyStepForm({
  setValue,
  getValues,
  errors,
}: IStepFormProps<TCompanySignup>) {
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

  // ── Handle Crop Complete ─────────────────────────────────────────
  const handleCropComplete = (croppedFile: File): void => {
    setValue?.("avatar", croppedFile, { shouldValidate: true });
    const objectUrl = URL.createObjectURL(croppedFile);
    setPreview(objectUrl);
  };

  /* --------------------------------- Effects -------------------------------- */
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
      <TypographyH4>Add your company profile picture (Optional)</TypographyH4>

      {/* Drag Drop File Section */}
      <div className="w-full flex justify-center">
        {setValue && (
          <DragDropFile<TCompanySignup>
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes="image/*"
            maxFileSize={5242880}
            multiple={false}
            boxText="Drop your company profile picture here"
            boxSubText="JPG, PNG or WEBP files up to 5MB"
            className="max-w-md"
            preview={preview}
            fileName="avatar"
            setValue={setValue}
          />
        )}
      </div>

      {/* Validation Message Section */}
      {errors?.avatar?.message && (
        <ErrorMessage>{errors.avatar.message as string}</ErrorMessage>
      )}

      {/* Crop Avatar Dialog Section */}
      {selectedImage && (
        <AvatarCropDialog
          title="Crop Company Profile Picture"
          open={cropDialogOpen}
          setOpen={setCropDialogOpen}
          image={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
